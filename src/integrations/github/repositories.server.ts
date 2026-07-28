import { githubRequest } from "./client.server";

import type {
  GitHubCommit,
  GitHubPullRequest,
  GitHubRepository,
  GitHubRepositoryIntelligence,
  GitHubRepositoryRef,
  GitHubWorkflowRun,
} from "./types";

interface GitHubRepositoryResponse {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  private: boolean;
  archived: boolean;
  default_branch: string;
  html_url: string;
  language: string | null;
  open_issues_count: number;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string | null;
  updated_at: string;
}

interface GitHubCommitResponse {
  sha: string;
  html_url: string;
  author: {
    login: string;
  } | null;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    } | null;
    committer: {
      name: string;
      date: string;
    } | null;
  };
}

interface GitHubPullRequestResponse {
  number: number;
  title: string;
  state: "open" | "closed";
  draft: boolean;
  html_url: string;
  updated_at: string;
  user: {
    login: string;
  };
  head: {
    ref: string;
  };
  base: {
    ref: string;
  };
}

interface GitHubWorkflowRunsResponse {
  workflow_runs: Array<{
    id: number;
    name: string;
    status: string;
    conclusion: string | null;
    head_branch: string | null;
    event: string;
    run_number: number;
    created_at: string;
    updated_at: string;
    html_url: string;
  }>;
}

function repositoryPath({ owner, repo }: GitHubRepositoryRef): string {
  return `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;
}

export async function getRepository(ref: GitHubRepositoryRef): Promise<GitHubRepository> {
  const result = await githubRequest<GitHubRepositoryResponse>(repositoryPath(ref));

  return {
    id: result.id,
    name: result.name,
    fullName: result.full_name,
    description: result.description,
    private: result.private,
    archived: result.archived,
    defaultBranch: result.default_branch,
    htmlUrl: result.html_url,
    language: result.language,
    openIssuesCount: result.open_issues_count,
    stars: result.stargazers_count,
    forks: result.forks_count,
    pushedAt: result.pushed_at,
    updatedAt: result.updated_at,
  };
}

export async function getLatestCommit(ref: GitHubRepositoryRef): Promise<GitHubCommit | null> {
  const results = await githubRequest<GitHubCommitResponse[]>(
    `${repositoryPath(ref)}/commits?per_page=1`,
  );

  const result = results[0];

  if (!result) {
    return null;
  }

  const author = result.commit.author ?? result.commit.committer;

  return {
    sha: result.sha,
    shortSha: result.sha.slice(0, 7),
    message: result.commit.message.split("\n")[0] ?? result.commit.message,
    authorName: author?.name ?? "Unknown",
    authorLogin: result.author?.login ?? null,
    committedAt: author?.date ?? new Date(0).toISOString(),
    htmlUrl: result.html_url,
  };
}

export async function getOpenPullRequests(ref: GitHubRepositoryRef): Promise<GitHubPullRequest[]> {
  const results = await githubRequest<GitHubPullRequestResponse[]>(
    `${repositoryPath(ref)}/pulls?state=open&per_page=20`,
  );

  return results.map((result) => ({
    number: result.number,
    title: result.title,
    state: result.state,
    draft: result.draft,
    authorLogin: result.user.login,
    headBranch: result.head.ref,
    baseBranch: result.base.ref,
    updatedAt: result.updated_at,
    htmlUrl: result.html_url,
  }));
}

export async function getLatestWorkflowRun(
  ref: GitHubRepositoryRef,
): Promise<GitHubWorkflowRun | null> {
  const result = await githubRequest<GitHubWorkflowRunsResponse>(
    `${repositoryPath(ref)}/actions/runs?per_page=1`,
  );

  const run = result.workflow_runs[0];

  if (!run) {
    return null;
  }

  return {
    id: run.id,
    name: run.name,
    status: run.status,
    conclusion: run.conclusion,
    branch: run.head_branch,
    event: run.event,
    runNumber: run.run_number,
    createdAt: run.created_at,
    updatedAt: run.updated_at,
    htmlUrl: run.html_url,
  };
}

export async function getRepositoryIntelligence(
  ref: GitHubRepositoryRef,
): Promise<GitHubRepositoryIntelligence> {
  const [repository, latestCommit, openPullRequests, latestWorkflowRun] = await Promise.all([
    getRepository(ref),
    getLatestCommit(ref),
    getOpenPullRequests(ref),
    getLatestWorkflowRun(ref),
  ]);

  return {
    repository,
    latestCommit,
    openPullRequests,
    latestWorkflowRun,
    collectedAt: new Date().toISOString(),
  };
}
