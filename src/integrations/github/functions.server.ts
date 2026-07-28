import { createServerFn } from "@tanstack/react-start";

export interface GitHubHealthResponse {
  status: "connected" | "degraded" | "disconnected" | "error" | "unknown";
  checkedAt: string;
  message: string | null;
  latencyMs: number | null;
  repository: string | null;
  defaultBranch: string | null;
  latestCommit: string | null;
  latestCommitMessage: string | null;
  latestWorkflow: string | null;
  openPullRequests: number;
  stars: number;
  forks: number;
}

export const getGitHubHealth = createServerFn({
  method: "GET",
}).handler(async (): Promise<GitHubHealthResponse> => {
  const { githubPlugin } = await import("./plugin.server");

  const health = await githubPlugin.healthCheck({
    requestId: crypto.randomUUID(),
  });

  const metadata = health.metadata ?? {};

  return {
    status: health.status,
    checkedAt: health.checkedAt,
    message: health.message ?? null,
    latencyMs: health.latencyMs ?? null,

    repository: typeof metadata.repository === "string" ? metadata.repository : null,

    defaultBranch: typeof metadata.defaultBranch === "string" ? metadata.defaultBranch : null,

    latestCommit: typeof metadata.latestCommit === "string" ? metadata.latestCommit : null,

    latestCommitMessage:
      typeof metadata.latestCommitMessage === "string" ? metadata.latestCommitMessage : null,

    latestWorkflow: typeof metadata.latestWorkflow === "string" ? metadata.latestWorkflow : null,

    openPullRequests: typeof metadata.openPullRequests === "number" ? metadata.openPullRequests : 0,

    stars: typeof metadata.stars === "number" ? metadata.stars : 0,

    forks: typeof metadata.forks === "number" ? metadata.forks : 0,
  };
});
