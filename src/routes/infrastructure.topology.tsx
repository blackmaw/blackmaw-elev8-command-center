import { createFileRoute } from "@tanstack/react-router";
import { DataTable } from "@/components/DataTable";
import { DemoBanner, Mono, PageHeader, Panel, Tag } from "@/components/primitives";
import { InfraTopology } from "@/components/command/InfraTopology";
import { getNode, listConnections } from "@/data/selectors";

export const Route = createFileRoute("/infrastructure/topology")({
  head: () => ({
    meta: [
      { title: "Infrastructure Topology — Elev8 Command Center" },
      {
        name: "description",
        content:
          "Interactive recorded topology from transit to compute, storage, and reserved capacity.",
      },
      { property: "og:title", content: "Infrastructure Topology — Elev8 Command Center" },
      { property: "og:description", content: "Recorded network and compute topology." },
    ],
  }),
  component: TopologyPage,
});

function TopologyPage() {
  const connections = listConnections();

  return (
    <div className="mx-auto max-w-[1600px] space-y-4 p-4 lg:p-6">
      <PageHeader
        title="Topology"
        descriptor="Every node and link below is a manually recorded value. Nothing here is discovered or polled."
        provenance="manually_recorded"
      >
        <DemoBanner />
      </PageHeader>

      <Panel dense bodyClassName="p-0">
        <InfraTopology />
      </Panel>

      <Panel title="Connections" dense>
        <DataTable
          rows={connections}
          columns={[
            {
              key: "from",
              header: "From",
              render: (c) => getNode(c.from_node_id)?.label ?? c.from_node_id,
            },
            {
              key: "to",
              header: "To",
              render: (c) => getNode(c.to_node_id)?.label ?? c.to_node_id,
            },
            { key: "medium", header: "Medium", render: (c) => <Mono>{c.medium}</Mono> },
            {
              key: "state",
              header: "State",
              render: (c) => (
                <Tag tone={c.state === "installed" ? "success" : "muted"}>{c.state}</Tag>
              ),
            },
          ]}
        />
      </Panel>
    </div>
  );
}
