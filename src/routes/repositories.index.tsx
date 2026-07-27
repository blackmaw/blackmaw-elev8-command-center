import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DataTable } from "@/components/DataTable";
import { DemoBanner, Mono, PageHeader, Panel, StatusPill } from "@/components/primitives";
import { listRepositories, productName } from "@/data/selectors";
import { GATE_STATE, INTEGRATION_STATE, WORKING_TREE } from "@/domain/status";

export const Route = createFileRoute("/repositories/")({
  head: () => ({
    meta: [
      { title: "Repository Center — Elev8 Command Center" },
      { name: "description", content: "Tracked repositories with recorded branch, commit, verification, and review state." },
      { property: "og:title", content: "Repository Center — Elev8 Command Center" },
      { property: "og:description", content: "Repository register with manually verified state." },
    ],
  }),
  component: RepositoriesIndex,
});

function RepositoriesIndex() {
  const navigate = useNavigate();
  const repos = listRepositories();

  return (
    <div className="mx-auto max-w-[1600px] space-y-4 p-4 lg:p-6">
      <PageHeader
        title="Repositories"
        descriptor="Repository state is recorded by hand. No source-control provider is connected in this phase."
        provenance="integration_not_connected"
      >
        <DemoBanner />
      </PageHeader>

      <Panel dense>
        <DataTable
          rows={repos}
          onRowClick={(r) => navigate({ to: "/repositories/$repositoryId", params: { repositoryId: r.id } })}
          columns={[
            { key: "name", header: "Repository", render: (r) => <Mono className="font-medium">{r.name}</Mono> },
            { key: "product", header: "Product", render: (r) => productName(r.product_id), secondary: true },
            { key: "branch", header: "Branch", render: (r) => <Mono>{r.current_branch}</Mono> },
            { key: "commit", header: "Latest recorded commit", render: (r) => <Mono>{r.latest_commit}</Mono> },
            { key: "tree", header: "Working tree", render: (r) => <StatusPill map={WORKING_TREE} value={r.working_tree} />, secondary: true },
            { key: "ci", header: "CI", render: (r) => <StatusPill map={GATE_STATE} value={r.ci_status} dot={false} />, secondary: true },
            { key: "integration", header: "Integration", render: (r) => <StatusPill map={INTEGRATION_STATE} value={r.integration_state} /> },
          ]}
        />
      </Panel>
    </div>
  );
}