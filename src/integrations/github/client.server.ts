import { IntegrationConfigurationError, IntegrationRequestError } from "../core";

const GITHUB_API_URL = "https://api.github.com";
const GITHUB_API_VERSION = "2022-11-28";

interface GitHubErrorPayload {
  message?: string;
  documentation_url?: string;
}

function getGitHubToken(): string {
  const token = process.env.GITHUB_TOKEN?.trim();

  if (!token) {
    throw new IntegrationConfigurationError("github", "GITHUB_TOKEN is not configured.");
  }

  return token;
}

export async function githubRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getGitHubToken();
  const url = new URL(path, GITHUB_API_URL);

  let response: Response;

  try {
    response = await fetch(url, {
      ...init,
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": GITHUB_API_VERSION,
        "User-Agent": "elev8-command-center",
        ...init.headers,
      },
    });
  } catch (error) {
    throw new IntegrationRequestError(
      "github",
      `Unable to reach GitHub: ${error instanceof Error ? error.message : "Unknown network error"}`,
      undefined,
      error,
    );
  }

  if (!response.ok) {
    let payload: GitHubErrorPayload | undefined;

    try {
      payload = (await response.json()) as GitHubErrorPayload;
    } catch {
      payload = undefined;
    }

    const rateLimitRemaining = response.headers.get("x-ratelimit-remaining");
    const rateLimitReset = response.headers.get("x-ratelimit-reset");

    throw new IntegrationRequestError(
      "github",
      [
        payload?.message ?? `GitHub request failed with ${response.status}.`,
        rateLimitRemaining === "0"
          ? `Rate limit exhausted; reset timestamp: ${rateLimitReset ?? "unknown"}.`
          : undefined,
      ]
        .filter(Boolean)
        .join(" "),
      response.status,
    );
  }

  return (await response.json()) as T;
}
