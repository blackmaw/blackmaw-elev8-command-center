import { createFileRoute, Link } from "@tanstack/react-router";
import { DataTable } from "@/components/DataTable";
import {
  DemoBanner,
  MetricTile,
  PageHeader,
  Panel,
  StatusPill,
  Tag,
} from "@/components/primitives";
import { InfraTopology } from "@/components/command/InfraTopology";
import { listAssets, listIntegrations, listRisks } from "@/data/selectors";
import { ASSET_LIFECYCLE, INTEGRATION_STATE, SEVERITY } from "@/domain/status";

export const Route = createFileRoute("/infrastructure/")({
  head: () => ({
    meta: [
      { title: "Infrastructure — Elev8 Command Center" },
      {
        name: "description",
        content:
          "Recorded infrastructure: compute, network, storage, topology, and integration state.",
      },
      { property: "og:title", content: "Infrastructure — Elev8 Command Center" },
      { property: "og:description", content: "Asset registry, topology, and integration posture." },
    ],
  }),
  component: InfrastructureIndex,
});

function InfrastructureIndex() {
  const assets = listAssets();
  const integrations = listIntegrations();
  const risks = listRisks({ workspaceId: "infrastructure" });
  const inService = assets.filter((a) => a.lifecycle === "in_service").length;
  const planned = assets.filter(
    (a) => a.lifecycle === "planned" || a.lifecycle === "staging",
  ).length;

  return (
    <div className="mx-auto max-w-[1600px] space-y-4 p-4 lg:p-6">
      <PageHeader
        title="Infrastructure"
        descriptor="Owned equipment and the recorded topology. No live telemetry is polled and no control operation is implemented."
        provenance="manually_recorded"
        actions={
          <Link
            to="/infrastructure/topology"
            className="rounded-xs border border-border px-2 py-1 text-[0.75rem] hover:border-border-strong"
          >
            Full topology
          </Link>
        }
      >
        <DemoBanner />
      </PageHeader>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricTile label="Recorded assets" value={assets.length} />
        <MetricTile label="In service" value={inService} />
        <MetricTile label="Planned or staging" value={planned} />
        <MetricTile label="Open infrastructure risks" value={risks.length} />
      </div>

      <Panel
        title="Topology"
        subtitle="Recorded connectivity — select a node for its asset record."
        dense
        bodyClassName="p-0"
      >
        <InfraTopology />
      </Panel>

      <Panel
        title="Asset registry"
        dense
        actions={
          <Link to="/assets" className="text-[0.75rem] text-teal-bright hover:underline">
            Full inventory
          </Link>
        }
      >
        <DataTable
          rows={assets}
          columns={[
            {
              key: "name",
              header: "Asset",
              render: (a) => <span className="font-medium">{a.name}</span>,
            },
            { key: "category", header: "Category", render: (a) => a.category, secondary: true },
            { key: "role", header: "Role", render: (a) => a.role, secondary: true },
            { key: "location", header: "Location", render: (a) => a.location, secondary: true },
            {
              key: "lifecycle",
              header: "Lifecycle",
              render: (a) => <StatusPill map={ASSET_LIFECYCLE} value={a.lifecycle} />,
            },
          ]}
        />
      </Panel>

      <div className="grid gap-3 xl:grid-cols-2">
        <Panel title="Integrations" subtitle="Every adapter is unconnected in this phase." dense>
          <DataTable
            rows={integrations}
            columns={[
              { key: "name", header: "Integration", render: (i) => i.name },
              { key: "target", header: "Target", render: (i) => i.target, secondary: true },
              {
                key: "state",
                header: "State",
                render: (i) => <StatusPill map={INTEGRATION_STATE} value={i.state} />,
              },
            ]}
          />
        </Panel>

        <Panel title="Infrastructure risks" dense>
          <DataTable
            rows={risks}
            emptyTitle="No open infrastructure risks"
            columns={[
              { key: "title", header: "Risk", render: (r) => r.title },
              {
                key: "severity",
                header: "Severity",
                render: (r) => <StatusPill map={SEVERITY} value={r.severity} />,
              },
              {
                key: "state",
                header: "State",
                render: (r) => <Tag>{r.state}</Tag>,
                secondary: true,
              },
            ]}
          />
        </Panel>
      </div>
    </div>
  );
}
