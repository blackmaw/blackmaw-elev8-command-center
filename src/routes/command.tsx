import { getGitHubHealth } from "@/integrations/github";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  Building2,
  CheckCircle2,
  Camera,
  FileStack,
  Gauge,
  GitBranch,
  HardDrive,
  Sparkles,
} from "lucide-react";
import { DataTable } from "@/components/DataTable";
import {
  KeyValue,
  Label,
  MetricTile,
  Mono,
  Panel,
  ProgressBar,
  ProvenanceTag,
  RadialProgress,
  SectionGrid,
  StatusRibbon,
  StatusPill,
} from "@/components/primitives";
import { ProductHealthCard } from "@/components/command/ProductHealthCard";
import { InfraTopology } from "@/components/command/InfraTopology";
import { RepositoryOverview } from "@/components/command/RepositoryOverview";
import { EngineeringTimeline } from "@/components/command/EngineeringTimeline";
import { useAppState } from "@/app/app-state";
import {
  currentPriority,
  getStage,
  getUserName,
  listActivity,
  listApprovals,
  listMilestones,
  listProducts,
  listRisks,
  listSnapshots,
  portfolioMetrics,
  productName,
} from "@/data/selectors";
import { GATE_STATE, HEALTH, LIFECYCLE, SEVERITY, STAGE_STATE } from "@/domain/status";
import { INTELLIGENCE_BRIEFING, SYSTEM_STATE } from "@/data/demo";

export const Route = createFileRoute("/command")({
  head: () => ({
    meta: [
      { title: "Command Overview — Elev8 Command Center" },
      {
        name: "description",
        content:
          "Cross-portfolio operating picture: current priority, approvals, risks, and portfolio state.",
      },
      {
        property: "og:title",
        content: "Command Overview — Elev8 Command Center",
      },
      {
        property: "og:description",
        content: "Cross-portfolio operating picture for Bell Cap Group LLC.",
      },
    ],
  }),

  loader: async () => {
    const githubHealth = await getGitHubHealth();

    return {
      githubHealth,
    };
  },

  component: CommandOverview,
});

function CommandOverview() {
  const { githubHealth } = Route.useLoaderData();

  const { setIntelOpen, setPaletteOpen } = useAppState();
  const priority = currentPriority();
  const stage = getStage(priority.resume.stage_id);
  const metrics = portfolioMetrics();
  const products = listProducts();
  const approvals = listApprovals({ pendingOnly: true });
  const risks = listRisks().filter((r) => r.state !== "closed");
  const activity = listActivity({ limit: 8 });
  const milestones = listMilestones().slice(0, 5);
  const snapshots = listSnapshots().slice(0, 4);

  return (
    <div className="space-y-3 p-3 lg:p-4">
      <header className="flex flex-col gap-2 border-b border-border pb-3">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 sm:flex sm:flex-wrap sm:justify-between">
          <div className="min-w-0">
            <h1 className="truncate text-[1.0625rem] font-semibold tracking-[0.12em]">
              COMMAND OVERVIEW
            </h1>
            <p className="truncate text-xs text-muted-foreground">
              Enterprise Operations &amp; Engineering System
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <ProvenanceTag value="demonstration" />
            <button
              type="button"
              onClick={() => setIntelOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xs border border-teal/50 bg-teal/12 px-2.5 py-1.5 text-[0.75rem] text-teal-bright hover:bg-teal/20"
            >
              <Sparkles className="size-3.5" aria-hidden />
              Brief me
            </button>
          </div>
        </div>
        <StatusRibbon
          items={[
            { label: "System", value: SYSTEM_STATE.system_status, tone: "success" },
            { label: "Environment", value: SYSTEM_STATE.environment, tone: "warning" },
            { label: "Mode", value: SYSTEM_STATE.operational_mode, tone: "teal" },
            { label: "Data", value: "Demonstration records", tone: "warning" },
            {
              label: "Last verified sync",
              value: new Date(SYSTEM_STATE.last_sync_at).toLocaleString(),
              tone: "info",
            },
          ]}
        />
      </header>

      <div className="grid gap-3 2xl:grid-cols-[minmax(0,2.1fr)_minmax(0,1fr)]">
        <Panel
          className="active-edge"
          title="Current priority — where we left off"
          subtitle="Continuity record restored from the latest recorded checkpoint"
          actions={
            <Link
              to="/products/$productKey"
              params={{ productKey: priority.product.key }}
              className="inline-flex items-center gap-1 rounded-xs border border-teal/50 bg-teal/12 px-2.5 py-1.5 text-[0.75rem] text-teal-bright hover:bg-teal/20"
            >
              Resume work
              <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          }
        >
          <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="grid size-9 shrink-0 place-items-center rounded-xs border border-border-active bg-canvas-2">
                  <Boxes className="size-4 text-teal-bright" aria-hidden />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold">{priority.product.name}</h3>
                    <StatusPill map={LIFECYCLE} value={priority.product.lifecycle} />
                    <StatusPill map={HEALTH} value={priority.product.health} />
                  </div>
                  <p className="mt-1 text-[0.8125rem] text-muted-foreground">
                    {priority.product.summary}
                  </p>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <KeyValue label="Phase" value={priority.phase} />
                <KeyValue label="Release status" value={priority.release_status} />
                <KeyValue
                  label="Last completed action"
                  value={priority.resume.last_completed_action}
                />
                <KeyValue
                  label="Next required action"
                  value={priority.resume.next_required_action}
                />
                <KeyValue label="Working branch" value={<Mono>{priority.resume.branch}</Mono>} />
                <KeyValue label="Owner" value={getUserName(priority.resume.owner_id)} />
              </div>
              <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3">
                <Link
                  to="/products/$productKey"
                  params={{ productKey: priority.product.key }}
                  className="rounded-xs border border-border-strong px-2.5 py-1.5 text-[0.75rem] hover:bg-panel-elevated"
                >
                  View product
                </Link>
                <button
                  type="button"
                  onClick={() => setPaletteOpen(true)}
                  className="rounded-xs border border-border-strong px-2.5 py-1.5 text-[0.75rem] hover:bg-panel-elevated"
                >
                  Record checkpoint
                </button>
                <button
                  type="button"
                  onClick={() => setIntelOpen(true)}
                  className="rounded-xs border border-border-strong px-2.5 py-1.5 text-[0.75rem] hover:bg-panel-elevated"
                >
                  View blockers
                </button>
              </div>
            </div>
            <div className="space-y-3 rounded-xs border border-border bg-canvas-2 p-3">
              <Label>Active stage telemetry</Label>
              {stage && (
                <>
                  <div className="flex items-center justify-between gap-2">
                    <Mono>{stage.code}</Mono>
                    <StatusPill map={STAGE_STATE} value={stage.state} />
                  </div>
                  <div className="text-[0.8125rem]">{stage.name}</div>
                  <p className="text-xs text-muted-foreground">{stage.objective}</p>
                </>
              )}
              <div className="flex items-center gap-3 border-t border-border pt-3">
                <RadialProgress
                  value={priority.product.progress}
                  size={60}
                  tone="teal"
                  label="Product completion"
                />
                <div className="min-w-0 flex-1">
                  <Label>Completion</Label>
                  <ProgressBar value={priority.product.progress} className="mt-1.5" />
                </div>
              </div>
              <KeyValue label="Next gate" value={priority.next_gate} />
            </div>
          </div>
        </Panel>

        <SectionGrid className="grid-cols-2 gap-2 lg:grid-cols-4 2xl:grid-cols-2">
          <MetricTile
            icon={Building2}
            label="Organizations"
            value={metrics.activeOrganizations}
            hint="Active entities"
            tone="info"
          />
          <MetricTile
            icon={Gauge}
            label="Products"
            value={metrics.activeProducts}
            hint="Portfolio records"
            tone="teal"
          />
          <MetricTile
            icon={GitBranch}
            label="Projects"
            value={metrics.activeProjects}
            hint="Open engagements"
            tone="teal"
          />
          <MetricTile
            icon={CheckCircle2}
            label="Pending approvals"
            value={metrics.pendingApprovals}
            hint="Awaiting human decision"
            tone="warning"
          />
          <MetricTile
            icon={AlertTriangle}
            label="Blockers"
            value={metrics.openBlockers}
            hint="Open or mitigating"
            tone="critical"
          />
          <MetricTile
            icon={HardDrive}
            label="Infrastructure assets"
            value={metrics.infrastructureAssets}
            hint="Registered equipment"
            tone="success"
          />
          <MetricTile
            icon={FileStack}
            label="Doc coverage"
            value={`${metrics.documentationCoverage}%`}
            hint="Approved documents"
            tone="neutral"
          />
          <MetricTile
            icon={Camera}
            label="Latest snapshot"
            value={metrics.latestSnapshot?.identifier ?? "—"}
            hint={
              metrics.latestSnapshot
                ? `${metrics.latestSnapshot.taken_on} · ${metrics.latestSnapshot.version}`
                : "None registered"
            }
            tone="info"
          />
        </SectionGrid>
      </div>

      <Panel
        title="Product portfolio health"
        subtitle="Recorded lifecycle, gate, and completion state per product"
        actions={
          <Link
            to="/products"
            className="rounded-xs border border-border-strong px-2.5 py-1.5 text-[0.75rem] hover:bg-panel-elevated"
          >
            View portfolio
          </Link>
        }
        bodyClassName="p-3"
      >
        <div className="grid gap-2 sm:grid-cols-2 2xl:grid-cols-4">
          {products.map((p) => (
            <ProductHealthCard key={p.id} product={p} />
          ))}
        </div>
      </Panel>

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <Panel
          title="Infrastructure topology"
          subtitle="Recorded network and compute path — select a node for its asset record"
          actions={<span className="label-caps">Demonstration data</span>}
          dense
        >
          <InfraTopology />
        </Panel>

        <Panel title="Engineering timeline" subtitle="Recent recorded engineering events" dense>
          <EngineeringTimeline />
        </Panel>
      </div>

      <Panel
        title="Repository overview"
        subtitle="Manually recorded repository state — no provider integration is connected"
        actions={<span className="label-caps">Manually recorded</span>}
        dense
      >
        <RepositoryOverview />
      </Panel>

      <div className="grid gap-3 xl:grid-cols-2 2xl:grid-cols-4">
        <Panel title="Upcoming gates" dense>
          <DataTable
            rows={milestones}
            columns={[
              { key: "title", header: "Milestone", render: (m) => m.title },
              { key: "gate", header: "Gate", render: (m) => m.gate_type, secondary: true },
              {
                key: "due",
                header: "Target",
                render: (m) => <span className="num">{m.due_on}</span>,
              },
              {
                key: "state",
                header: "Readiness",
                render: (m) => <StatusPill map={STAGE_STATE} value={m.state} />,
              },
            ]}
          />
        </Panel>

        <Panel title="Founder insight" subtitle="Demonstration briefing" bodyClassName="p-3">
          <div className="space-y-2">
            <div className="label-caps text-warning">Demonstration briefing</div>
            <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">
              {INTELLIGENCE_BRIEFING.headline}
            </p>
            <div className="space-y-1 border-t border-border pt-2">
              <Label>Referenced records</Label>
              {INTELLIGENCE_BRIEFING.citations.map((c) => (
                <div key={c.label} className="truncate text-[0.75rem] text-muted-foreground">
                  {c.label}
                </div>
              ))}
            </div>
          </div>
        </Panel>

        <Panel title="Recent snapshots" dense>
          <DataTable
            rows={snapshots}
            columns={[
              { key: "id", header: "Snapshot", render: (s) => <Mono>{s.identifier}</Mono> },
              {
                key: "product",
                header: "Product",
                render: (s) => productName(s.product_id),
                secondary: true,
              },
              {
                key: "taken",
                header: "Recorded",
                render: (s) => <span className="num">{s.taken_on}</span>,
              },
              {
                key: "state",
                header: "Validation",
                render: (s) => (
                  <StatusPill map={GATE_STATE} value={s.validation_state} dot={false} />
                ),
              },
            ]}
          />
        </Panel>

        <Panel title="Active risks" subtitle="Open and mitigating records" dense>
          <DataTable
            rows={risks}
            columns={[
              { key: "title", header: "Risk", render: (r) => r.title },
              {
                key: "product",
                header: "Product",
                render: (r) => productName(r.product_id),
                secondary: true,
              },
              {
                key: "sev",
                header: "Severity",
                render: (r) => <StatusPill map={SEVERITY} value={r.severity} />,
              },
              { key: "state", header: "State", render: (r) => <Mono>{r.state}</Mono> },
            ]}
          />
        </Panel>
      </div>

      <Panel
        title="Awaiting human approval"
        subtitle="No transition advances without a recorded decision"
        dense
      >
        <DataTable
          rows={approvals}
          columns={[
            { key: "title", header: "Subject", render: (a) => a.title },
            {
              key: "type",
              header: "Related entity",
              render: (a) => <Mono>{a.subject_type}</Mono>,
              secondary: true,
            },
            { key: "approver", header: "Approver", render: (a) => getUserName(a.approver_id) },
            {
              key: "state",
              header: "Decision",
              render: () => <StatusPill map={STAGE_STATE} value="review_required" />,
            },
          ]}
          emptyTitle="No pending approvals"
        />
      </Panel>

      <Panel
        title="System activity stream"
        subtitle="Append-oriented ledger of recorded events"
        actions={
          <Link to="/activity" className="text-[0.75rem] text-teal-bright hover:underline">
            Full ledger
          </Link>
        }
        dense
      >
        <DataTable
          rows={activity}
          columns={[
            {
              key: "when",
              header: "Recorded",
              width: "12rem",
              render: (a) => <Mono>{new Date(a.occurred_at).toLocaleString()}</Mono>,
            },
            {
              key: "kind",
              header: "Event",
              render: (a) => <Mono>{a.kind.replace(/_/g, " ")}</Mono>,
              secondary: true,
            },
            { key: "summary", header: "Summary", render: (a) => a.summary },
            {
              key: "actor",
              header: "Actor",
              render: (a) => getUserName(a.actor_id),
              secondary: true,
            },
          ]}
        />
      </Panel>
    </div>
  );
}
