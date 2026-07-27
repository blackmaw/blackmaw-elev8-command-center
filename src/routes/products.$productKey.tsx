import { createFileRoute, notFound } from "@tanstack/react-router";
import { DataTable } from "@/components/DataTable";
import { DemoBanner, KeyValue, Mono, PageHeader, Panel, ProgressBar, StatusPill } from "@/components/primitives";
import { getProduct, listStages } from "@/data/selectors";
import { HEALTH, LIFECYCLE, STAGE_STATE } from "@/domain/status";

export const Route = createFileRoute("/products/$productKey")({
  loader: ({ params }) => {
    const product = getProduct(params.productKey);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    const name = loaderData?.product.name ?? "Product";
    return {
      meta: [
        { title: `${name} — Elev8 Command Center` },
        { name: "description", content: loaderData?.product.summary ?? "Product record unavailable." },
        { property: "og:title", content: `${name} — Elev8 Command Center` },
        { property: "og:description", content: loaderData?.product.summary ?? "Product record." },
        ...(loaderData ? [] : [{ name: "robots", content: "noindex" }]),
      ],
    };
  },
  component: ProductDetail,
});

function ProductDetail() {
  const { product } = Route.useLoaderData();
  const stages = listStages(product.id);

  return (
    <div className="mx-auto max-w-[1600px] space-y-4 p-4 lg:p-6">
      <PageHeader title={product.name} descriptor={product.summary} provenance={product.provenance}>
        <DemoBanner />
      </PageHeader>

      <div className="grid gap-3 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Panel title="Stage register" subtitle="Sequenced gates — each transition requires a recorded human decision" dense>
          <DataTable
            rows={stages}
            columns={[
              { key: "code", header: "Code", width: "7rem", render: (s) => <Mono>{s.code}</Mono> },
              { key: "name", header: "Stage", render: (s) => s.name },
              { key: "objective", header: "Objective", render: (s) => s.objective, secondary: true },
              { key: "state", header: "State", render: (s) => <StatusPill map={STAGE_STATE} value={s.state} /> },
            ]}
          />
        </Panel>

        <Panel title="Record">
          <div className="grid gap-3">
            <KeyValue label="Code" value={<Mono>{product.code}</Mono>} />
            <KeyValue label="Type" value={product.type} />
            <KeyValue label="Phase" value={product.current_phase} />
            <KeyValue label="Release state" value={product.release_state} />
            <KeyValue label="Next gate" value={product.next_gate} />
            <div className="flex gap-2">
              <StatusPill map={LIFECYCLE} value={product.lifecycle} />
              <StatusPill map={HEALTH} value={product.health} />
            </div>
            <div>
              <div className="num text-xs">{product.progress}%</div>
              <ProgressBar value={product.progress} className="mt-1" />
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}