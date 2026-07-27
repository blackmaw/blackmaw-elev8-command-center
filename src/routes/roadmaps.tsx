import { createFileRoute } from "@tanstack/react-router";
import { DemoBanner, Label, PageHeader, Panel, StatusPill } from "@/components/primitives";
import { listRoadmaps, productName } from "@/data/selectors";
import { STAGE_STATE } from "@/domain/status";

export const Route = createFileRoute("/roadmaps")({
  head: () => ({
    meta: [
      { title: "Roadmaps — Elev8 Command Center" },
      { name: "description", content: "Horizon planning by lane and quarter across Elev8 Technologies and the Driving Academy." },
      { property: "og:title", content: "Roadmaps — Elev8 Command Center" },
      { property: "og:description", content: "Lanes, quarters, and horizon planning." },
    ],
  }),
  component: RoadmapsPage,
});

const QUARTERS = ["2026 Q3", "2026 Q4", "2027 Q1", "2027 Q2"];

function RoadmapsPage() {
  const roadmaps = listRoadmaps();

  return (
    <div className="mx-auto max-w-[1600px] space-y-4 p-4 lg:p-6">
      <PageHeader
        title="Roadmaps"
        descriptor="Planning horizons expressed as lanes and quarters. Nothing here changes a stage state — planning and governance stay separate."
        provenance="demonstration"
      >
        <DemoBanner />
      </PageHeader>

      {roadmaps.map((rm) => (
        <Panel key={rm.id} title={rm.name} subtitle={`Horizon ${rm.horizon}`}>
          <div className="overflow-x-auto">
            <div className="min-w-[52rem] space-y-2">
              <div className="grid grid-cols-[10rem_repeat(4,1fr)] gap-2">
                <span />
                {QUARTERS.map((q) => (
                  <div key={q} className="label-caps border-b border-border pb-1">
                    {q}
                  </div>
                ))}
              </div>
              {rm.lanes.map((lane) => (
                <div key={lane.id} className="grid grid-cols-[10rem_repeat(4,1fr)] items-start gap-2">
                  <div className="pt-1 text-[0.8125rem] font-medium">{lane.label}</div>
                  {QUARTERS.map((q) => (
                    <div key={q} className="space-y-1.5">
                      {lane.items
                        .filter((i) => i.quarter === q)
                        .map((item) => (
                          <div key={item.id} className="rounded-xs border border-border bg-canvas p-2">
                            <div className="truncate text-[0.75rem]">{item.label}</div>
                            <div className="mt-1 flex items-center justify-between gap-2">
                              <StatusPill map={STAGE_STATE} value={item.state} dot={false} />
                              <span className="truncate text-[0.625rem] text-muted-foreground">{productName(item.product_id)}</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3">
            <Label>Planning record only — commitments require an approval record.</Label>
          </div>
        </Panel>
      ))}
    </div>
  );
}