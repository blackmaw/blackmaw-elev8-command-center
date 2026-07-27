import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import {
  DemoBanner,
  KeyValue,
  Label,
  Mono,
  PageHeader,
  Panel,
  StatusPill,
} from "@/components/primitives";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { listDecisions, productName } from "@/data/selectors";
import { DECISION_STATE } from "@/domain/status";
import type { Decision } from "@/domain/types";

export const Route = createFileRoute("/decisions")({
  head: () => ({
    meta: [
      { title: "Decision Register — Elev8 Command Center" },
      {
        name: "description",
        content:
          "Architecture and governance decision records with context, alternatives, and consequences.",
      },
      { property: "og:title", content: "Decision Register — Elev8 Command Center" },
      { property: "og:description", content: "ADR register across products and entities." },
    ],
  }),
  component: DecisionsPage,
});

function DecisionsPage() {
  const decisions = listDecisions();
  const [selected, setSelected] = useState<Decision | null>(null);

  return (
    <div className="mx-auto max-w-[1600px] space-y-4 p-4 lg:p-6">
      <PageHeader
        title="Decisions"
        descriptor="Decisions are recorded, not inferred. Each entry keeps its context, the alternatives considered, and the consequences accepted."
        provenance="manually_recorded"
      >
        <DemoBanner />
      </PageHeader>

      <Panel dense>
        <DataTable
          rows={decisions}
          onRowClick={(d) => setSelected(d)}
          columns={[
            {
              key: "identifier",
              header: "Identifier",
              render: (d) => <Mono className="font-medium">{d.identifier}</Mono>,
            },
            { key: "title", header: "Decision", render: (d) => d.title },
            {
              key: "product",
              header: "Product",
              render: (d) => productName(d.product_id),
              secondary: true,
            },
            {
              key: "decided",
              header: "Decided",
              render: (d) => <span className="num">{d.decided_on ?? "Pending"}</span>,
              secondary: true,
            },
            {
              key: "state",
              header: "State",
              render: (d) => <StatusPill map={DECISION_STATE} value={d.state} />,
            },
          ]}
        />
      </Panel>

      <Sheet open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent side="right" className="w-full overflow-y-auto bg-canvas-2 sm:max-w-lg">
          {selected && (
            <>
              <SheetHeader className="p-0">
                <SheetTitle className="text-[0.9375rem]">
                  {selected.identifier} — {selected.title}
                </SheetTitle>
                <SheetDescription className="text-xs">{selected.context}</SheetDescription>
              </SheetHeader>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <KeyValue label="Product" value={productName(selected.product_id)} />
                <KeyValue
                  label="State"
                  value={<StatusPill map={DECISION_STATE} value={selected.state} />}
                />
                <KeyValue label="Decided on" value={selected.decided_on ?? "Not decided"} />
              </div>

              <div className="mt-4 space-y-1.5">
                <Label>Decision</Label>
                <p className="text-[0.8125rem]">{selected.decision}</p>
              </div>

              <div className="mt-4 space-y-1.5">
                <Label>Alternatives considered</Label>
                <ul className="space-y-1 text-[0.8125rem] text-muted-foreground">
                  {selected.alternatives.map((a) => (
                    <li key={a}>— {a}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 space-y-1.5">
                <Label>Consequences</Label>
                <ul className="space-y-1 text-[0.8125rem] text-muted-foreground">
                  {selected.consequences.map((c) => (
                    <li key={c}>— {c}</li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
