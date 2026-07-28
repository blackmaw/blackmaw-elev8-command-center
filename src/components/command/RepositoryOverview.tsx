import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { GitBranch, GitPullRequest, Star } from "lucide-react";

import { Mono, StatusPill, Tag, Label } from "@/components/primitives";
import { DataTable } from "@/components/DataTable";
import { listRepositories, productName } from "@/data/selectors";
import { GATE_STATE } from "@/domain/status";
import { getGitHubHealth, type GitHubHealthResponse } from "@/integrations/github";

const EMPTY_HEALTH: GitHubHealthResponse = {
  status: "unknown",
  checkedAt: new Date(0).toISOString(),
  message: null,
  latencyMs: null,
  repository: null,
  defaultBranch: null,
  latestCommit: null,
  latestCommitMessage: null,
  latestWorkflow: null,
  openPullRequests: 0,
  stars: 0,
  forks: 0,
};

const STATUS_TONE: Record<
  GitHubHealthResponse["status"],
  "success" | "warning" | "critical" | "muted"
> = {
  connected: "success",
  degraded: "warning",
  disconnected: "critical",
  error: "critical",
  unknown: "muted",
};

/** Repository register with live GitHub provider intelligence. */
export function RepositoryOverview() {
  const repos = listRepositories();
  const fetchGitHubHealth = useServerFn(getGitHubHealth);

  const [health, setHealth] = useState<GitHubHealthResponse>(EMPTY_HEALTH);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const result = await fetchGitHubHealth();

        if (active) {
          setHealth(result);
        }
      } catch {
        if (active) {
          setHealth({
            ...EMPTY_HEALTH,
            status: "error",
            checkedAt: new Date().toISOString(),
            message: "Unable to load GitHub repository intelligence.",
          });
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [fetchGitHubHealth]);

  return (
    <div className="space-y-3">
      <div className="panel-lift flex min-w-0 flex-col gap-3 p-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[0.8125rem] font-semibold">Live GitHub Provider</div>
            <div className="truncate text-[0.6875rem] text-muted-foreground">
              {loading
                ? "Loading repository intelligence..."
                : (health.message ?? "Live source-control provider status")}
            </div>
          </div>

          <Tag tone={STATUS_TONE[health.status]}>
            {loading ? "loading" : health.status.replace(/_/g, " ")}
          </Tag>
        </div>

        <div className="grid gap-3 border-t border-border pt-3 sm:grid-cols-2 lg:grid-cols-4">
          <Metric
            label="Repository"
            value={health.repository ? <Mono>{health.repository}</Mono> : "Unavailable"}
          />

          <Metric
            label="Default branch"
            value={
              health.defaultBranch ? (
                <span className="inline-flex items-center gap-1.5">
                  <GitBranch className="size-3 text-muted-foreground" aria-hidden />
                  <Mono>{health.defaultBranch}</Mono>
                </span>
              ) : (
                "Unavailable"
              )
            }
          />

          <Metric
            label="Latest commit"
            value={health.latestCommit ? <Mono>{health.latestCommit}</Mono> : "Unavailable"}
          />

          <Metric
            label="Latency"
            value={health.latencyMs !== null ? `${health.latencyMs} ms` : "Unavailable"}
          />

          <Metric label="Commit message" value={health.latestCommitMessage ?? "Unavailable"} />

          <Metric label="Latest workflow" value={health.latestWorkflow ?? "No workflow run"} />

          <Metric
            label="Open pull requests"
            value={
              <span className="inline-flex items-center gap-1.5">
                <GitPullRequest className="size-3 text-muted-foreground" aria-hidden />
                <span className="num">{health.openPullRequests}</span>
              </span>
            }
          />

          <Metric
            label="Stars"
            value={
              <span className="inline-flex items-center gap-1.5">
                <Star className="size-3 text-muted-foreground" aria-hidden />
                <span className="num">{health.stars}</span>
              </span>
            }
          />

          <Metric label="Forks" value={<span className="num">{health.forks}</span>} />

          <Metric
            label="Last checked"
            value={
              health.checkedAt === EMPTY_HEALTH.checkedAt
                ? "Pending"
                : new Date(health.checkedAt).toLocaleString()
            }
          />
        </div>
      </div>

      <DataTable
        rows={repos}
        columns={[
          {
            key: "name",
            header: "Repository",
            render: (r) => <Mono className="font-medium">{r.name}</Mono>,
          },
          {
            key: "product",
            header: "Product",
            render: (r) => productName(r.product_id),
            secondary: true,
          },
          {
            key: "branch",
            header: "Branch",
            render: (r) => <Mono>{r.current_branch}</Mono>,
          },
          {
            key: "commit",
            header: "Latest recorded commit",
            render: (r) => (
              <span className="flex min-w-0 items-center gap-2">
                <Mono>{r.latest_commit}</Mono>
                <span className="truncate text-[0.75rem] text-muted-foreground">
                  {r.latest_commit_message}
                </span>
              </span>
            ),
          },
          {
            key: "review",
            header: "Review state",
            render: (r) => (
              <StatusPill map={GATE_STATE} value={r.documentation_state} dot={false} />
            ),
          },
          {
            key: "integration",
            header: "Integration",
            render: (r) => (
              <Tag tone={r.integration_state === "not_connected" ? "muted" : "success"}>
                {r.integration_state.replace(/_/g, " ")}
              </Tag>
            ),
          },
        ]}
      />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <Label>{label}</Label>
      <div className="mt-0.5 truncate text-[0.75rem] text-foreground">{value}</div>
    </div>
  );
}
