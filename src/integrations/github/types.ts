export interface GitHubRepositoryRef {
  owner: string;
  repo: string;
}

export interface GitHubRepository {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  private: boolean;
  archived: boolean;
  defaultBranch: string;
  htmlUrl: string;
  language: string | null;
  openIssuesCount: number;
  stars: number;
  forks: number;
  pushedAt: string | null;
  updatedAt: string;
}

export interface GitHubCommit {
  sha: string;
  shortSha: string;
  message: string;
  authorName: string;
  authorLogin: string | null;
  committedAt: string;
  htmlUrl: string;
}

export interface GitHubPullRequest {
  number: number;
  title: string;
  state: "open" | "closed";
  draft: boolean;
  authorLogin: string;
  headBranch: string;
  baseBranch: string;
  updatedAt: string;
  htmlUrl: string;
}

export interface GitHubWorkflowRun {
  id: number;
  name: string;
  status: string;
  conclusion: string | null;
  branch: string | null;
  event: string;
  runNumber: number;
  createdAt: string;
  updatedAt: string;
  htmlUrl: string;
}

export interface GitHubRepositoryIntelligence {
  repository: GitHubRepository;
  latestCommit: GitHubCommit | null;
  openPullRequests: GitHubPullRequest[];
  latestWorkflowRun: GitHubWorkflowRun | null;
  collectedAt: string;
}
