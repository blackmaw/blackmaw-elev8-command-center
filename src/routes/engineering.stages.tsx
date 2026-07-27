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
  Tag,
} from "@/components/primitives";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  listApprovalsForSubject,
  listStageRequirements,
  listStages,
  productName,
} from "@/data/selectors";
import { GATE_STATE, STAGE_STATE } from "@/domain/status";
import type { Stage } from "@/domain/types";

export const Route = createFileRoute("/engineering/stages")({
  head: () => ({
    meta: [
      { title: "Stage Register — Elev8 Command Center" },
      {
        name: "description",
        content:
          "Every stage gate with entry criteria, requirements, and the human approval record required to advance.",
      },
      { property: "og:title", content: "Stage Register — Elev8 Command Center" },
      { property: "og:description", content: "Governed stage gates and approval records." },
    ],
  }),
  component: StagesPage,
});

function StagesPage() {
  const stages = listStages();
  const [selected, setSelected] = useState<Stage | null>(null);
  const requirements = selected ? listStageRequirements(selected.id) : [];
  const approvals = selected ? listApprovalsForSubject(selected.id) : [];

  return (
    <div className="mx-auto max-w-[1600px] space-y-4 p-4 lg:p-6">
      <PageHeader
        title="Stage Gates"
        descriptor="Stages never advance automatically. Approved and Frozen transitions require an explicit, recorded human approval."
        provenance="manually_recorded"
      >
        <DemoBanner />
      </PageHeader>

      <Panel dense>
        <DataTable
          rows={stages}
          onRowClick={(s) => setSelected(s)}
          columns={[
            {
              key: "code",
              header: "Stage",
              render: (s) => <Mono className="font-medium">{s.code}</Mono>,
            },
            { key: "name", header: "Name", render: (s) => s.name },
            {
              key: "product",
              header: "Product",
              render: (s) => productName(s.product_id),
              secondary: true,
            },
            {
              key: "state",
              header: "State",
              render: (s) => <StatusPill map={STAGE_STATE} value={s.state} />,
            },
            {
              key: "commit",
              header: "Recorded commit",
              render: (s) => <Mono>{s.commit_ref ?? s.non_code_designation ?? "—"}</Mono>,
              secondary: true,
            },
            {
              key: "opened",
              header: "Opened",
              render: (s) => <span className="num">{s.opened_on}</span>,
              secondary: true,
            },
            {
              key: "target",
              header: "Target",
              render: (s) => <span className="num">{s.target_on}</span>,
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
                  {selected.code} — {selected.name}
                </SheetTitle>
                <SheetDescription className="text-xs">{selected.objective}</SheetDescription>
              </SheetHeader>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <KeyValue label="Product" value={productName(selected.product_id)} />
                <KeyValue
                  label="State"
                  value={<StatusPill map={STAGE_STATE} value={selected.state} />}
                />
                <KeyValue
                  label="Commit reference"
                  value={selected.commit_ref ?? selected.non_code_designation ?? "Not applicable"}
                  mono
                />
                <KeyValue
                  label="Freeze record"
                  value={selected.freeze_record_id ?? "None recorded"}
                  mono
                />
              </div>

              <div className="mt-4 space-y-1.5">
                <Label>Entry criteria</Label>
                <ul className="space-y-1 text-[0.8125rem] text-muted-foreground">
                  {selected.entry_criteria.map((c) => (
                    <li key={c}>— {c}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 space-y-1.5">
                <Label>Requirements</Label>
                {requirements.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    No requirements recorded for this stage.
                  </p>
                ) : (
                  <ul className="space-y-1.5">
                    {requirements.map((r) => (
                      <li
                        key={r.id}
                        className="flex items-start justify-between gap-3 border-b border-border/60 pb-1.5 text-[0.8125rem] last:border-0"
                      >
                        <span className="min-w-0">
                          <Tag>{r.kind}</Tag> <span className="ml-1">{r.label}</span>
                        </span>
                        <StatusPill map={GATE_STATE} value={r.state} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mt-4 space-y-1.5">
                <Label>Approval record</Label>
                {approvals.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    No approval recorded. This stage cannot be marked Approved or Frozen without an
                    explicit founder record.
                  </p>
                ) : (
                  approvals.map((a) => (
                    <div
                      key={a.id}
                      className="rounded-xs border border-border bg-canvas p-2 text-[0.8125rem]"
                    >
                      <div className="font-medium">{a.title}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{a.notes}</div>
                      <div className="mt-1.5 flex items-center gap-2">
                        <Tag
                          tone={
                            a.decision === "approved"
                              ? "success"
                              : a.decision === "rejected"
                                ? "critical"
                                : "warning"
                          }
                        >
                          {a.decision}
                        </Tag>
                        <span className="num text-[0.6875rem] text-muted-foreground">
                          {a.decided_at ?? "Awaiting decision"}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-4 space-y-1.5">
                <Label>Rollback notes</Label>
                <p className="text-xs text-muted-foreground">{selected.rollback_notes}</p>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
