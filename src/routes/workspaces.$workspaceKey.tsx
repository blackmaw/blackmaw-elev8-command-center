import { createFileRoute, Link } from "@tanstack/react-router";
import { DataTable } from "@/components/DataTable";
import {
  DemoBanner,
  EmptyState,
  KeyValue,
  MetricTile,
  PageHeader,
  Panel,
  StatusPill,
  Tag,
} from "@/components/primitives";
import { ProductHealthCard } from "@/components/command/ProductHealthCard";
import {
  getUserName,
  getWorkspace,
  listActivity,
  listDocuments,
  listProducts,
  listRisks,
  listTasks,
  listWorkspaces,
  productName,
} from "@/data/selectors";
import { ENTITY_STATUS, SEVERITY, TASK_STATE } from "@/domain/status";
import type { WorkspaceKey } from "@/domain/types";

export const Route = createFileRoute("/workspaces/$workspaceKey")({
  head: () => ({
    meta: [
      { title: "Workspace — Elev8 Command Center" },
      {
        name: "description",
        content:
          "Workspace operating picture: products, work in flight, risks, records, and recent activity.",
      },
      { property: "og:title", content: "Workspace — Elev8 Command Center" },
      { property: "og:description", content: "Scoped workspace operating picture." },
    ],
  }),
  component: WorkspacePage,
});

function WorkspacePage() {
  const { workspaceKey } = Route.useParams();
  const known = listWorkspaces().some((w) => w.id === workspaceKey);

  if (!known) {
    return (
      <div className="mx-auto max-w-[1600px] p-4 lg:p-6">
        <EmptyState
          title="Workspace not found"
          description="No workspace matches this key."
          action={
            <Link to="/command" className="text-[0.75rem] text-teal-bright hover:underline">
              Back to command overview
            </Link>
          }
        />
      </div>
    );
  }

  const workspace = getWorkspace(workspaceKey);
  const products = listProducts({ workspace_id: workspaceKey });
  const tasks = listTasks({ workspaceId: workspaceKey });
  const risks = listRisks({ workspaceId: workspaceKey });
  const docs = listDocuments({ workspaceId: workspaceKey });
  const activity = listActivity({ workspaceId: workspaceKey as WorkspaceKey, limit: 8 });

  return (
    <div className="mx-auto max-w-[1600px] space-y-4 p-4 lg:p-6">
      <PageHeader
        title={workspace.name}
        descriptor={workspace.descriptor}
        provenance="manually_recorded"
      >
        <DemoBanner />
      </PageHeader>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricTile label="Products" value={products.length} />
        <MetricTile label="Open work" value={tasks.filter((t) => t.state !== "done").length} />
        <MetricTile label="Open risks" value={risks.length} />
        <MetricTile label="Records" value={docs.length} />
      </div>

      <Panel title="Workspace record">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <KeyValue label="Owner" value={getUserName(workspace.owner_id)} />
          <KeyValue
            label="Status"
            value={<StatusPill map={ENTITY_STATUS} value={workspace.status} />}
          />
          <KeyValue label="Entity" value={workspace.organization_id ?? "Group-wide"} />
          <KeyValue
            label="Access"
            value={
              <span className="flex flex-wrap gap-1">
                {workspace.access.map((a) => (
                  <Tag key={a}>{a.replace(/_/g, " ")}</Tag>
                ))}
              </span>
            }
          />
        </div>
      </Panel>

      {products.length > 0 && (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {products.map((p) => (
            <ProductHealthCard key={p.id} product={p} />
          ))}
        </div>
      )}

      <div className="grid gap-3 xl:grid-cols-2">
        <Panel title="Work in flight" dense>
          <DataTable
            rows={tasks}
            emptyTitle="No recorded work"
            columns={[
              { key: "title", header: "Task", render: (t) => t.title },
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

        <Panel title="Risks" dense>
          <DataTable
            rows={risks}
            emptyTitle="No open risks"
            columns={[
              { key: "title", header: "Risk", render: (r) => r.title },
              {
                key: "severity",
                header: "Severity",
                render: (r) => <StatusPill map={SEVERITY} value={r.severity} />,
              },
              {
                key: "product",
                header: "Product",
                render: (r) => productName(r.product_id),
                secondary: true,
              },
            ]}
          />
        </Panel>
      </div>

      <div className="grid gap-3 xl:grid-cols-2">
        <Panel title="Records" dense>
          <DataTable
            rows={docs}
            emptyTitle="No records"
            columns={[
              { key: "title", header: "Document", render: (d) => d.title },
              {
                key: "type",
                header: "Type",
                render: (d) => d.doc_type.replace(/_/g, " "),
                secondary: true,
              },
              {
                key: "v",
                header: "Version",
                render: (d) => <span className="tech">v{d.version}</span>,
              },
            ]}
          />
        </Panel>

        <Panel title="Recent activity" dense bodyClassName="p-0">
          <ul className="divide-y divide-border">
            {activity.map((e) => (
              <li key={e.id} className="px-4 py-2.5">
                <div className="text-[0.8125rem] font-medium">{e.summary}</div>
                <div className="text-xs text-muted-foreground">{e.detail}</div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
