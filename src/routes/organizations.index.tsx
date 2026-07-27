import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DataTable } from "@/components/DataTable";
import { DemoBanner, PageHeader, Panel, StatusPill } from "@/components/primitives";
import { getUserName, listOrganizations } from "@/data/selectors";
import { ENTITY_STATUS } from "@/domain/status";

export const Route = createFileRoute("/organizations/")({
  head: () => ({
    meta: [
      { title: "Organization Registry — Elev8 Command Center" },
      {
        name: "description",
        content: "Legal entities, parent relationships, owners, and formation state.",
      },
      { property: "og:title", content: "Organization Registry — Elev8 Command Center" },
      {
        property: "og:description",
        content: "Bell Cap Group entity registry and formation status.",
      },
    ],
  }),
  component: OrganizationsIndex,
});

function OrganizationsIndex() {
  const navigate = useNavigate();
  const orgs = listOrganizations();

  return (
    <div className="mx-auto max-w-[1600px] space-y-4 p-4 lg:p-6">
      <PageHeader
        title="Organizations"
        descriptor="Every legal entity under Bell Cap Group with its parent relationship, owner, and verification state."
        provenance="manually_recorded"
      >
        <DemoBanner />
      </PageHeader>
      <Panel dense>
        <DataTable
          rows={orgs}
          onRowClick={(o) =>
            navigate({ to: "/organizations/$organizationId", params: { organizationId: o.id } })
          }
          columns={[
            {
              key: "name",
              header: "Organization",
              render: (o) => <span className="font-medium">{o.name}</span>,
            },
            { key: "legal", header: "Legal name", render: (o) => o.legal_name, secondary: true },
            { key: "kind", header: "Entity type", render: (o) => o.kind },
            {
              key: "parent",
              header: "Parent",
              render: (o) => orgs.find((p) => p.id === o.parent_id)?.name ?? "—",
              secondary: true,
            },
            {
              key: "owner",
              header: "Owner",
              render: (o) => getUserName(o.owner_id),
              secondary: true,
            },
            {
              key: "status",
              header: "Formation",
              render: (o) => <StatusPill map={ENTITY_STATUS} value={o.status} />,
            },
            {
              key: "verify",
              header: "Verification",
              render: (o) => <StatusPill map={ENTITY_STATUS} value={o.ein_state} />,
            },
          ]}
        />
      </Panel>
    </div>
  );
}
