import type { IntegrationContext, IntegrationHealth, IntegrationPlugin } from "../core";

import { getRepositoryIntelligence } from "./repositories.server";

const HEALTH_REPOSITORY = {
  owner: "blackmaw",
  repo: "blackmaw-elev8-command-center",
} as const;

export const githubPlugin: IntegrationPlugin = {
  id: "github",
  name: "GitHub",
  version: "1.0.0",
  category: "source-control",

  capabilities: [
    {
      id: "repositories.read",
      name: "Read repositories",
      readOnly: true,
    },
    {
      id: "commits.read",
      name: "Read commits",
      readOnly: true,
    },
    {
      id: "pull_requests.read",
      name: "Read pull requests",
      readOnly: true,
    },
    {
      id: "workflows.read",
      name: "Read workflow runs",
      readOnly: true,
    },
  ],

  async healthCheck(context?: IntegrationContext): Promise<IntegrationHealth> {
    const startedAt = performance.now();

    try {
      const intelligence = await getRepositoryIntelligence(HEALTH_REPOSITORY);

      return {
        status: "connected",
        checkedAt: new Date().toISOString(),
        latencyMs: Math.round(performance.now() - startedAt),
        message: `Connected to ${intelligence.repository.fullName}.`,
        metadata: {
          requestId: context?.requestId,
          repository: intelligence.repository.fullName,
          defaultBranch: intelligence.repository.defaultBranch,
          latestCommit: intelligence.latestCommit?.shortSha ?? null,
          latestCommitMessage: intelligence.latestCommit?.message ?? null,
          latestWorkflow:
            intelligence.latestWorkflowRun?.conclusion ??
            intelligence.latestWorkflowRun?.status ??
            null,
          openPullRequests: intelligence.openPullRequests.length,
          stars: intelligence.repository.stars,
          forks: intelligence.repository.forks,
        },
      };
    } catch (error) {
      return {
        status: "error",
        checkedAt: new Date().toISOString(),
        latencyMs: Math.round(performance.now() - startedAt),
        message: error instanceof Error ? error.message : "GitHub health check failed.",
      };
    }
  },
};
