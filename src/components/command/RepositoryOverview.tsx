import { Mono, StatusPill, Tag } from "@/components/primitives";
import { DataTable } from "@/components/DataTable";
import { listRepositories, productName } from "@/data/selectors";
import { GATE_STATE } from "@/domain/status";

/** Repository register — manually recorded values, no provider integration. */
export function RepositoryOverview() {
  const repos = listRepositories();
  return (
    <DataTable
      rows={repos}
      columns={[
        { key: "name", header: "Repository", render: (r) => <Mono className="font-medium">{r.name}</Mono> },
        { key: "product", header: "Product", render: (r) => productName(r.product_id), secondary: true },
        { key: "branch", header: "Branch", render: (r) => <Mono>{r.current_branch}</Mono> },
        {
          key: "commit",
          header: "Latest recorded commit",
          render: (r) => (
            <span className="flex min-w-0 items-center gap-2">
              <Mono>{r.latest_commit}</Mono>
              <span className="truncate text-[0.75rem] text-muted-foreground">{r.latest_commit_message}</span>
            </span>
          ),
        },
        { key: "review", header: "Review state", render: (r) => <StatusPill map={GATE_STATE} value={r.documentation_state} dot={false} /> },
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
  );
}