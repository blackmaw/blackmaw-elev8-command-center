import { createFileRoute } from "@tanstack/react-router";
import { DataTable } from "@/components/DataTable";
import { DemoBanner, Mono, PageHeader, Panel, StatusPill } from "@/components/primitives";
import { listCheckpoints, listSnapshots, productName } from "@/data/selectors";
import { FREEZE_STATE, GATE_STATE } from "@/domain/status";

export const Route = createFileRoute("/engineering/checkpoints")({
  head: () => ({
    meta: [
      { title: "Checkpoints & Snapshots — Elev8 Command Center" },
      {
        name: "description",
        content:
          "Recorded checkpoints and registered build snapshots with checksums and freeze state.",
      },
      { property: "og:title", content: "Checkpoints & Snapshots — Elev8 Command Center" },
      { property: "og:description", content: "Continuity checkpoints and registered snapshots." },
    ],
  }),
  component: CheckpointsPage,
});

function CheckpointsPage() {
  const checkpoints = listCheckpoints();
  const snapshots = listSnapshots();

  return (
    <div className="mx-auto max-w-[1600px] space-y-4 p-4 lg:p-6">
      <PageHeader
        title="Checkpoints & Snapshots"
        descriptor="Continuity records that answer where work stopped, and the registered artifacts that back each stage."
        provenance="manually_recorded"
      >
        <DemoBanner />
      </PageHeader>

      <Panel
        title="Checkpoints"
        subtitle="Each checkpoint states the last completed action and the next required action."
        dense
      >
        <DataTable
          rows={checkpoints}
          columns={[
            {
              key: "label",
              header: "Checkpoint",
              render: (c) => <Mono className="font-medium">{c.label}</Mono>,
            },
            {
              key: "product",
              header: "Product",
              render: (c) => productName(c.product_id),
              secondary: true,
            },
            { key: "summary", header: "Last completed", render: (c) => c.summary },
            {
              key: "next",
              header: "Next required action",
              render: (c) => c.next_action,
              secondary: true,
            },
            {
              key: "branch",
              header: "Branch",
              render: (c) => <Mono>{c.branch ?? "—"}</Mono>,
              secondary: true,
            },
            {
              key: "at",
              header: "Recorded",
              render: (c) => (
                <span className="num">{new Date(c.recorded_at).toLocaleDateString()}</span>
              ),
            },
          ]}
        />
      </Panel>

      <Panel
        title="Snapshots"
        subtitle="Registered artifacts. Checksums are recorded manually — no build system is connected."
        dense
      >
        <DataTable
          rows={snapshots}
          columns={[
            {
              key: "id",
              header: "Identifier",
              render: (s) => <Mono className="font-medium">{s.identifier}</Mono>,
            },
            {
              key: "product",
              header: "Product",
              render: (s) => productName(s.product_id),
              secondary: true,
            },
            { key: "version", header: "Version", render: (s) => <Mono>{s.version}</Mono> },
            {
              key: "commit",
              header: "Commit",
              render: (s) => <Mono>{s.commit_ref}</Mono>,
              secondary: true,
            },
            {
              key: "artifact",
              header: "Artifact",
              render: (s) => <span className="truncate">{s.artifact_name}</span>,
              secondary: true,
            },
            {
              key: "validation",
              header: "Validation",
              render: (s) => <StatusPill map={GATE_STATE} value={s.validation_state} />,
            },
            {
              key: "freeze",
              header: "Freeze",
              render: (s) => <StatusPill map={FREEZE_STATE} value={s.freeze_state} />,
            },
          ]}
        />
      </Panel>
    </div>
  );
}
