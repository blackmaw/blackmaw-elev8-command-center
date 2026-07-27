import { createFileRoute, Link } from "@tanstack/react-router";
import { DataTable } from "@/components/DataTable";
import { DemoBanner, EmptyState, KeyValue, PageHeader, Panel, StatusPill } from "@/components/primitives";
import {
  getOrganization,
  getUserName,
  listBusinessUnits,
  listChildOrganizations,
  listDocuments,
  listProducts,
} from "@/data/selectors";
import { ENTITY_STATUS, HEALTH, LIFECYCLE } from "@/domain/status";

export const Route = createFileRoute("/organizations/$organizationId")({
  head: () => ({
    meta: [
      { title: "Organization Record — Elev8 Command Center" },
      { name: "description", content: "Entity record: structure, readiness posture, business units, and owned products." },
      { property: "og:title", content: "Organization Record — Elev8 Command Center" },
      { property: "og:description", content: "Entity structure, readiness, units, and products." },
    ],
  }),
  component: OrganizationDetail,
});

function OrganizationDetail() {
  const { organizationId } = Route.useParams();
  const org = getOrganization(organizationId);

  if (!org) {
    return (
      <div className="mx-auto max-w-[1600px] p-4 lg:p-6">
        <EmptyState
          title="Organization not found"
          description="No entity matches this identifier in the current record set."
          action={
            <Link to="/organizations" className="text-[0.75rem] text-teal-bright hover:underline">
              Back to registry
            </Link>
          }
        />
      </div>
    );
  }

  const children = listChildOrganizations(org.id);
  const units = listBusinessUnits(org.id);
  const products = listProducts({ organization_id: org.id });
  const docs = listDocuments().filter((d) => d.organization_id === org.id);

  return (
    <div className="mx-auto max-w-[1600px] space-y-4 p-4 lg:p-6">
      <PageHeader title={org.name} descriptor={org.summary} provenance={org.provenance}>
        <DemoBanner />
      </PageHeader>

      <div className="grid gap-3 xl:grid-cols-2">
        <Panel title="Entity record">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <KeyValue label="Legal name" value={org.legal_name} />
            <KeyValue label="Entity type" value={org.kind} />
            <KeyValue label="Jurisdiction" value={org.jurisdiction} />
            <KeyValue label="Owner" value={getUserName(org.owner_id)} />
            <KeyValue label="Formed" value={org.formed_on ?? "Not filed"} />
            <KeyValue label="Status" value={<StatusPill map={ENTITY_STATUS} value={org.status} />} />
          </div>
        </Panel>
        <Panel title="Readiness" subtitle="Manually recorded — nothing is verified by an integration.">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <KeyValue label="Registered agent" value={<StatusPill map={ENTITY_STATUS} value={org.registered_agent_state} />} />
            <KeyValue label="EIN" value={<StatusPill map={ENTITY_STATUS} value={org.ein_state} />} />
            <KeyValue label="Banking" value={<StatusPill map={ENTITY_STATUS} value={org.banking_state} />} />
            <KeyValue label="Credit" value={<StatusPill map={ENTITY_STATUS} value={org.credit_state} />} />
            <KeyValue label="Insurance" value={<StatusPill map={ENTITY_STATUS} value={org.insurance_state} />} />
          </div>
        </Panel>
      </div>

      <Panel title="Subsidiary entities" dense>
        <DataTable
          rows={children}
          emptyTitle="No subsidiary entities"
          emptyDescription="This entity has no recorded children."
          columns={[
            { key: "name", header: "Entity", render: (o) => o.name },
            { key: "kind", header: "Type", render: (o) => o.kind, secondary: true },
            { key: "status", header: "Status", render: (o) => <StatusPill map={ENTITY_STATUS} value={o.status} /> },
          ]}
        />
      </Panel>

      <div className="grid gap-3 xl:grid-cols-2">
        <Panel title="Business units" dense>
          <DataTable
            rows={units}
            emptyTitle="No business units"
            columns={[
              { key: "name", header: "Unit", render: (u) => u.name },
              { key: "fn", header: "Function", render: (u) => u.function, secondary: true },
              { key: "hc", header: "Headcount plan", render: (u) => <span className="num">{u.headcount_plan}</span> },
            ]}
          />
        </Panel>
        <Panel title="Owned products" dense>
          <DataTable
            rows={products}
            emptyTitle="No products owned by this entity"
            columns={[
              { key: "name", header: "Product", render: (p) => p.name },
              { key: "lifecycle", header: "Lifecycle", render: (p) => <StatusPill map={LIFECYCLE} value={p.lifecycle} /> },
              { key: "health", header: "Health", render: (p) => <StatusPill map={HEALTH} value={p.health} /> },
            ]}
          />
        </Panel>
      </div>

      <Panel title="Records" dense>
        <DataTable
          rows={docs}
          emptyTitle="No documents recorded"
          columns={[
            { key: "title", header: "Document", render: (d) => d.title },
            { key: "type", header: "Type", render: (d) => d.doc_type.replace(/_/g, " "), secondary: true },
            { key: "v", header: "Version", render: (d) => <span className="tech">v{d.version}</span> },
          ]}
        />
      </Panel>
    </div>
  );
}