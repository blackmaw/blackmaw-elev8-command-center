import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DataTable } from "@/components/DataTable";
import { DemoBanner, PageHeader, Panel, ProgressBar, StatusPill } from "@/components/primitives";
import { listProducts } from "@/data/selectors";
import { HEALTH, LIFECYCLE } from "@/domain/status";

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title: "Product Portfolio — Elev8 Command Center" },
      {
        name: "description",
        content: "Every product record, its lifecycle, health, and governing phase.",
      },
      { property: "og:title", content: "Product Portfolio — Elev8 Command Center" },
      { property: "og:description", content: "Product records, lifecycle, and stage-gate state." },
    ],
  }),
  component: ProductsIndex,
});

function ProductsIndex() {
  const navigate = useNavigate();
  const products = listProducts();

  return (
    <div className="mx-auto max-w-[1600px] space-y-4 p-4 lg:p-6">
      <PageHeader
        title="Product Portfolio"
        descriptor="Canonical product records across all workspaces."
        provenance="demonstration"
      >
        <DemoBanner />
      </PageHeader>
      <Panel dense>
        <DataTable
          rows={products}
          onRowClick={(p) =>
            navigate({ to: "/products/$productKey", params: { productKey: p.key } })
          }
          columns={[
            {
              key: "name",
              header: "Product",
              render: (p) => <span className="font-medium">{p.name}</span>,
            },
            { key: "type", header: "Type", render: (p) => p.type, secondary: true },
            { key: "phase", header: "Phase", render: (p) => p.current_phase, secondary: true },
            {
              key: "lifecycle",
              header: "Lifecycle",
              render: (p) => <StatusPill map={LIFECYCLE} value={p.lifecycle} />,
            },
            {
              key: "health",
              header: "Health",
              render: (p) => <StatusPill map={HEALTH} value={p.health} />,
            },
            {
              key: "progress",
              header: "Progress",
              width: "9rem",
              render: (p) => (
                <div className="flex items-center gap-2">
                  <ProgressBar value={p.progress} className="w-20" />
                  <span className="num text-xs">{p.progress}%</span>
                </div>
              ),
            },
          ]}
        />
      </Panel>
    </div>
  );
}
