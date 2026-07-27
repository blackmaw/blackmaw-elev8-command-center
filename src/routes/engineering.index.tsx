import { createFileRoute, Link } from "@tanstack/react-router";
import { DataTable } from "@/components/DataTable";
import { DemoBanner, Mono, PageHeader, Panel, StatusPill, Tag } from "@/components/primitives";
import { EngineeringTimeline } from "@/components/command/EngineeringTimeline";
import {
  getUserName,
  listCheckpoints,
  listEngineeringSessions,
  listMilestones,
  listStages,
  listTasks,
  productName,
} from "@/data/selectors";
import { STAGE_STATE, TASK_STATE } from "@/domain/status";

export const Route = createFileRoute("/engineering/")({
  head: () => ({
    meta: [
      { title: "Engineering Operations — Elev8 Command Center" },
      {
        name: "description",
        content: "Stage gates, checkpoints, working tasks, and recorded engineering sessions.",
      },
      { property: "og:title", content: "Engineering Operations — Elev8 Command Center" },
      {
        property: "og:description",
        content: "Stage-gate progress, checkpoints, and engineering work in flight.",
      },
    ],
  }),
  component: EngineeringIndex,
});

function EngineeringIndex() {
  const stages = listStages();
  const tasks = listTasks();
  const milestones = listMilestones();
  const checkpoints = listCheckpoints().slice(0, 5);
  const sessions = listEngineeringSessions();

  return (
    <div className="mx-auto max-w-[1600px] space-y-4 p-4 lg:p-6">
      <PageHeader
        title="Engineering"
        descriptor="The governed stage-gate system. Every transition to Approved or Frozen requires an explicit human approval record."
        provenance="manually_recorded"
        actions={
          <div className="flex items-center gap-2">
            <Link
              to="/engineering/stages"
              className="rounded-xs border border-border px-2 py-1 text-[0.75rem] hover:border-border-strong"
            >
              Stage register
            </Link>
            <Link
              to="/engineering/checkpoints"
              className="rounded-xs border border-border px-2 py-1 text-[0.75rem] hover:border-border-strong"
            >
              Checkpoints & snapshots
            </Link>
          </div>
        }
      >
        <DemoBanner />
      </PageHeader>

      <div className="grid gap-3 xl:grid-cols-[1.6fr_1fr]">
        <Panel title="Active stages" subtitle="Ordered by product and sequence" dense>
          <DataTable
            rows={stages}
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
                key: "target",
                header: "Target",
                render: (s) => <span className="num">{s.target_on}</span>,
                secondary: true,
              },
            ]}
          />
        </Panel>

        <Panel
          title="Engineering ledger"
          subtitle="Most recent recorded events"
          dense
          bodyClassName="p-0"
        >
          <EngineeringTimeline limit={8} />
        </Panel>
      </div>

      <div className="grid gap-3 xl:grid-cols-2">
        <Panel title="Work in flight" dense>
          <DataTable
            rows={tasks}
            columns={[
              { key: "title", header: "Task", render: (t) => t.title },
              {
                key: "product",
                header: "Product",
                render: (t) => productName(t.product_id),
                secondary: true,
              },
              {
                key: "state",
                header: "State",
                render: (t) => <StatusPill map={TASK_STATE} value={t.state} />,
              },
              {
                key: "due",
                header: "Due",
                render: (t) => <span className="num">{t.due_on ?? "—"}</span>,
                secondary: true,
              },
            ]}
          />
        </Panel>

        <Panel title="Upcoming gates" dense>
          <DataTable
            rows={milestones}
            columns={[
              { key: "title", header: "Gate", render: (m) => m.title },
              { key: "type", header: "Type", render: (m) => m.gate_type, secondary: true },
              {
                key: "state",
                header: "State",
                render: (m) => <StatusPill map={STAGE_STATE} value={m.state} />,
              },
              { key: "due", header: "Due", render: (m) => <span className="num">{m.due_on}</span> },
            ]}
          />
        </Panel>
      </div>

      <div className="grid gap-3 xl:grid-cols-2">
        <Panel title="Recent checkpoints" dense>
          <DataTable
            rows={checkpoints}
            columns={[
              { key: "label", header: "Checkpoint", render: (c) => <Mono>{c.label}</Mono> },
              { key: "summary", header: "Summary", render: (c) => c.summary },
              {
                key: "branch",
                header: "Branch",
                render: (c) => <Mono>{c.branch ?? "—"}</Mono>,
                secondary: true,
              },
            ]}
          />
        </Panel>

        <Panel title="Engineering sessions" dense>
          <DataTable
            rows={sessions}
            columns={[
              { key: "title", header: "Session", render: (s) => s.title },
              { key: "outcome", header: "Outcome", render: (s) => s.outcome, secondary: true },
              {
                key: "owner",
                header: "Recorded by",
                render: (s) => <Tag>{getUserName(s.owner_id)}</Tag>,
                secondary: true,
              },
            ]}
          />
        </Panel>
      </div>
    </div>
  );
}
