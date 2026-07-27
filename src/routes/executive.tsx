import { createFileRoute, Link } from "@tanstack/react-router";
import { DataTable } from "@/components/DataTable";
import { DemoBanner, KeyValue, PageHeader, Panel, StatusPill, Tag } from "@/components/primitives";
import { listApprovals, listBusinessUnits, listDecisions, listDocuments, listOrganizations, listRisks } from "@/data/selectors";
import { DECISION_STATE, ENTITY_STATUS, SEVERITY } from "@/domain/status";

export const Route = createFileRoute("/executive")({
  head: () => ({
    meta: [
      { title: "Executive Oversight — Elev8 Command Center" },
      { name: "description", content: "Bell Cap Group parent-company oversight: entities, units, readiness, and corporate risk." },
      { property: "og:title", content: "Executive Oversight — Elev8 Command Center" },
      { property: "og:description", content: "Parent-company oversight for Bell Cap Group LLC." },
    ],
  }),
  component: ExecutivePage,
});

function ExecutivePage() {
  const orgs = listOrganizations();
  const parent = orgs.find((o) => o.parent_id === null) ?? orgs[0];
  const units = listBusinessUnits();
  const approvals = listApprovals({ pendingOnly: true });
  const risks = listRisks();
  const decisions = listDecisions().filter((d) => d.workspace_id === "executive" || d.product_id === null);
  const corporateDocs = listDocuments().filter((d) => ["corporate", "legal"].includes(d.doc_type));

  return (
    <div className="mx-auto max-w-[1600px] space-y-4 p-4 lg:p-6">
      <PageHeader
        title="Executive — Bell Cap Group"
        descriptor="Parent-company oversight across legal entities, business units, readiness posture, and governance."
        provenance="manually_recorded"
      >
        <DemoBanner />
      </PageHeader>

      <div className="grid gap-3 xl:grid-cols-[1.4fr_1fr]">
        <Panel title="Parent company" subtitle={parent.legal_name}>
          <p className="text-xs text-muted-foreground">{parent.summary}</p>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <KeyValue label="Jurisdiction" value={parent.jurisdiction} />
            <KeyValue label="Entity kind" value={parent.kind} />
            <KeyValue label="Formed" value={parent.formed_on ?? "Not filed"} />
            <KeyValue label="Status" value={<StatusPill map={ENTITY_STATUS} value={parent.status} />} />
          </div>
        </Panel>

        <Panel title="Readiness posture" subtitle="Manually recorded — no institution is connected.">
          <div className="grid grid-cols-2 gap-3">
            <KeyValue label="Registered agent" value={<StatusPill map={ENTITY_STATUS} value={parent.registered_agent_state} />} />
            <KeyValue label="EIN" value={<StatusPill map={ENTITY_STATUS} value={parent.ein_state} />} />
            <KeyValue label="Banking" value={<StatusPill map={ENTITY_STATUS} value={parent.banking_state} />} />
            <KeyValue label="Business credit" value={<StatusPill map={ENTITY_STATUS} value={parent.credit_state} />} />
            <KeyValue label="Insurance" value={<StatusPill map={ENTITY_STATUS} value={parent.insurance_state} />} />
          </div>
        </Panel>
      </div>

      <Panel
        title="Legal entities"
        subtitle="Ownership and governance hierarchy"
        dense
        actions={
          <Link to="/organizations" className="text-[0.75rem] text-teal-bright hover:underline">
            Open registry
          </Link>
        }
      >
        <DataTable
          rows={orgs}
          columns={[
            { key: "name", header: "Entity", render: (o) => <span className="font-medium">{o.name}</span> },
            { key: "legal", header: "Legal name", render: (o) => o.legal_name, secondary: true },
            { key: "kind", header: "Type", render: (o) => o.kind },
            { key: "parent", header: "Parent", render: (o) => orgs.find((p) => p.id === o.parent_id)?.name ?? "—", secondary: true },
            { key: "status", header: "Formation", render: (o) => <StatusPill map={ENTITY_STATUS} value={o.status} /> },
          ]}
        />
      </Panel>

      <div className="grid gap-3 xl:grid-cols-2">
        <Panel title="Business units" dense>
          <DataTable
            rows={units}
            columns={[
              { key: "name", header: "Unit", render: (u) => u.name },
              { key: "function", header: "Function", render: (u) => u.function, secondary: true },
              { key: "headcount", header: "Planned headcount", render: (u) => <span className="num">{u.headcount_plan}</span> },
            ]}
          />
        </Panel>

        <Panel title="Strategic initiatives" subtitle="Cross-entity initiatives derived from the recorded register">
          <ul className="space-y-2 text-[0.8125rem]">
            <li className="flex items-start gap-2">
              <Tag tone="teal">Technology</Tag>
              <span className="min-w-0">Complete the AI Creator Studio validation cycle and controlled pre-alpha.</span>
            </li>
            <li className="flex items-start gap-2">
              <Tag tone="warning">Infrastructure</Tag>
              <span className="min-w-0">Bring the primary rack into service ahead of the September readiness gate.</span>
            </li>
            <li className="flex items-start gap-2">
              <Tag tone="info">Corporate</Tag>
              <span className="min-w-0">Complete entity verification, banking, and business-credit groundwork.</span>
            </li>
          </ul>
        </Panel>
      </div>

      <div className="grid gap-3 xl:grid-cols-2">
        <Panel title="Corporate approvals" subtitle="Explicit founder decisions required" dense>
          <DataTable
            rows={approvals}
            emptyTitle="No pending approvals"
            columns={[
              { key: "title", header: "Subject", render: (a) => a.title },
              { key: "type", header: "Type", render: (a) => a.subject_type, secondary: true },
              { key: "decision", header: "State", render: (a) => <Tag tone="warning">{a.decision}</Tag> },
            ]}
          />
        </Panel>

        <Panel title="Corporate risks" dense>
          <DataTable
            rows={risks}
            emptyTitle="No recorded risks"
            columns={[
              { key: "title", header: "Risk", render: (r) => r.title },
              { key: "severity", header: "Severity", render: (r) => <StatusPill map={SEVERITY} value={r.severity} /> },
              { key: "state", header: "State", render: (r) => r.state, secondary: true },
            ]}
          />
        </Panel>
      </div>

      <div className="grid gap-3 xl:grid-cols-2">
        <Panel title="Corporate records" dense>
          <DataTable
            rows={corporateDocs}
            emptyTitle="No corporate records"
            emptyDescription="Corporate and legal documents will appear here once recorded."
            columns={[
              { key: "title", header: "Document", render: (d) => d.title },
              { key: "version", header: "Version", render: (d) => <span className="tech">v{d.version}</span> },
              { key: "status", header: "Status", render: (d) => d.status.replace(/_/g, " "), secondary: true },
            ]}
          />
        </Panel>

        <Panel title="Governance decisions" dense>
          <DataTable
            rows={decisions}
            emptyTitle="No governance decisions"
            columns={[
              { key: "id", header: "Identifier", render: (d) => <span className="tech">{d.identifier}</span> },
              { key: "title", header: "Decision", render: (d) => d.title },
              { key: "state", header: "State", render: (d) => <StatusPill map={DECISION_STATE} value={d.state} /> },
            ]}
          />
        </Panel>
      </div>
    </div>
  );
}