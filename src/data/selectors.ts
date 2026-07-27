/**
 * Data access layer. UI modules import from here — never from demo.ts —
 * so the demonstration source can be swapped for a server-backed adapter
 * (Lovable Cloud / server functions) without touching presentation code.
 */
import * as demo from "./demo";
import type {
  ActivityEvent,
  ID,
  Product,
  SearchEntity,
  SearchResult,
  WorkspaceKey,
} from "@/domain/types";

export const db = demo;

export const getUser = (id: ID | null) => demo.users.find((u) => u.id === id) ?? null;
export const getUserName = (id: ID | null) => getUser(id)?.name ?? "Unassigned";

export const listWorkspaces = () => demo.workspaces;
export const getWorkspace = (id: WorkspaceKey | string | undefined) =>
  demo.workspaces.find((w) => w.id === id) ?? demo.workspaces[0];

export const listOrganizations = () => demo.organizations;
export const getOrganization = (id: ID | null | undefined) =>
  demo.organizations.find((o) => o.id === id) ?? null;
export const listChildOrganizations = (parentId: ID) =>
  demo.organizations.filter((o) => o.parent_id === parentId);
export const listBusinessUnits = (orgId?: ID) =>
  orgId ? demo.businessUnits.filter((b) => b.organization_id === orgId) : demo.businessUnits;

export const listProducts = (filter?: { workspace_id?: string; organization_id?: string }) =>
  demo.products.filter(
    (p) =>
      (!filter?.workspace_id || p.workspace_id === filter.workspace_id) &&
      (!filter?.organization_id || p.owner_org_id === filter.organization_id),
  );
export const getProduct = (id: ID | undefined) =>
  demo.products.find((p) => p.id === id || p.key === id) ?? null;
export const productName = (id: ID | null) => (id ? (getProduct(id)?.name ?? "—") : "—");

export const listProjects = (productId?: ID) =>
  productId ? demo.projects.filter((p) => p.product_id === productId) : demo.projects;
export const getProject = (id: ID | null) => demo.projects.find((p) => p.id === id) ?? null;

export const listStages = (productId?: ID) =>
  (productId ? demo.stages.filter((s) => s.product_id === productId) : demo.stages)
    .slice()
    .sort((a, b) => a.sequence - b.sequence);
export const getStage = (id: ID | null | undefined) => demo.stages.find((s) => s.id === id) ?? null;
export const listStageRequirements = (stageId: ID) =>
  demo.stageRequirements.filter((r) => r.stage_id === stageId);

export const listApprovals = (opts?: { pendingOnly?: boolean }) =>
  demo.approvals.filter((a) => (opts?.pendingOnly ? a.decision === "pending" : true));
export const listApprovalsForSubject = (subjectId: ID) =>
  demo.approvals.filter((a) => a.subject_id === subjectId);

export const listCheckpoints = (productId?: ID) =>
  (productId ? demo.checkpoints.filter((c) => c.product_id === productId) : demo.checkpoints)
    .slice()
    .sort((a, b) => b.recorded_at.localeCompare(a.recorded_at));
export const listEngineeringSessions = () => demo.engineeringSessions;

export const listRepositories = (productId?: ID) =>
  productId ? demo.repositories.filter((r) => r.product_id === productId) : demo.repositories;
export const getRepository = (id: ID | null | undefined) =>
  demo.repositories.find((r) => r.id === id || r.name === id) ?? null;

export const listReleases = (productId?: ID) =>
  productId ? demo.releases.filter((r) => r.product_id === productId) : demo.releases;
export const getRelease = (id: ID | undefined) => demo.releases.find((r) => r.id === id) ?? null;

export const listSnapshots = (productId?: ID) =>
  (productId ? demo.snapshots.filter((s) => s.product_id === productId) : demo.snapshots)
    .slice()
    .sort((a, b) => b.taken_on.localeCompare(a.taken_on));

export const listDocuments = (filter?: { productId?: ID; workspaceId?: string; type?: string }) =>
  demo.documents.filter(
    (d) =>
      (!filter?.productId || d.product_id === filter.productId) &&
      (!filter?.workspaceId || d.workspace_id === filter.workspaceId) &&
      (!filter?.type || d.doc_type === filter.type),
  );
export const listDocumentVersions = (docId: ID) =>
  demo.documentVersions.filter((v) => v.document_id === docId);

export const listAssets = (category?: string) =>
  category ? demo.assets.filter((a) => a.category === category) : demo.assets;
export const getAsset = (id: ID | null | undefined) => demo.assets.find((a) => a.id === id) ?? null;
export const listNodes = () => demo.infrastructureNodes;
export const listConnections = () => demo.infrastructureConnections;
export const getNode = (id: ID | null) => demo.infrastructureNodes.find((n) => n.id === id) ?? null;

export const listTasks = (filter?: { productId?: ID; workspaceId?: string }) =>
  demo.tasks.filter(
    (t) =>
      (!filter?.productId || t.product_id === filter.productId) &&
      (!filter?.workspaceId || t.workspace_id === filter.workspaceId),
  );
export const listMilestones = () =>
  demo.milestones.slice().sort((a, b) => a.due_on.localeCompare(b.due_on));
export const listRoadmaps = () => demo.roadmaps;

export const listDecisions = (productId?: ID) =>
  productId ? demo.decisions.filter((d) => d.product_id === productId) : demo.decisions;
export const getDecision = (id: ID) => demo.decisions.find((d) => d.id === id) ?? null;

export const listRisks = (filter?: { productId?: ID; workspaceId?: string }) =>
  demo.risks.filter(
    (r) =>
      (!filter?.productId || r.product_id === filter.productId) &&
      (!filter?.workspaceId || r.workspace_id === filter.workspaceId),
  );

export const listNotifications = () =>
  demo.notifications.slice().sort((a, b) => b.occurred_at.localeCompare(a.occurred_at));

export const listActivity = (filter?: {
  workspaceId?: WorkspaceKey;
  productId?: ID;
  limit?: number;
}) => {
  let rows: ActivityEvent[] = demo.activityEvents
    .slice()
    .sort((a, b) => b.occurred_at.localeCompare(a.occurred_at));
  if (filter?.workspaceId) rows = rows.filter((r) => r.workspace_id === filter.workspaceId);
  if (filter?.productId) rows = rows.filter((r) => r.product_id === filter.productId);
  return filter?.limit ? rows.slice(0, filter.limit) : rows;
};

export const listJournal = (filter?: { productId?: ID; repositoryId?: ID; tag?: string }) =>
  demo.builderJournal
    .filter(
      (j) =>
        (!filter?.productId || j.product_id === filter.productId) &&
        (!filter?.repositoryId || j.repository_id === filter.repositoryId) &&
        (!filter?.tag || j.tags.includes(filter.tag)),
    )
    .slice()
    .sort((a, b) => b.entry_date.localeCompare(a.entry_date));
export const getJournalEntry = (id: ID) => demo.builderJournal.find((j) => j.id === id) ?? null;

export const listBriefings = (workspaceId?: WorkspaceKey) =>
  workspaceId ? demo.aiBriefings.filter((b) => b.workspace_id === workspaceId) : demo.aiBriefings;

export const listIntegrations = () => demo.integrations;
export const listSettings = (group?: string) =>
  group ? demo.systemSettings.filter((s) => s.group === group) : demo.systemSettings;

/* ------------------------------------------------------------- aggregates */

export function portfolioMetrics() {
  const openBlockers = demo.risks.filter(
    (r) => r.state === "open" || r.state === "mitigating",
  ).length;
  const docsWithApproval = demo.documents.filter((d) => d.approval_state === "passed").length;
  return {
    activeOrganizations: demo.organizations.filter((o) => o.status === "active").length,
    activeProducts: demo.products.filter((p) => p.lifecycle !== "sunset").length,
    activeProjects: demo.projects.filter((p) => p.status !== "done").length,
    openBlockers,
    pendingApprovals: demo.approvals.filter((a) => a.decision === "pending").length,
    infrastructureAssets: demo.assets.length,
    documentationCoverage: Math.round((docsWithApproval / demo.documents.length) * 100),
    latestSnapshot: listSnapshots()[0],
  };
}

export function currentPriority() {
  const product = getProduct(demo.CURRENT_PRIORITY.product_id) as Product;
  return { ...demo.CURRENT_PRIORITY, product };
}

/* ---------------------------------------------------------------- search */

export function searchAll(query: string, entities?: SearchEntity[]): SearchResult[] {
  const q = query.trim().toLowerCase();
  const results: SearchResult[] = [];
  const push = (r: SearchResult) => {
    if (!entities || entities.includes(r.entity)) results.push(r);
  };

  demo.organizations.forEach((o) =>
    push({
      id: o.id,
      entity: "organization",
      title: o.name,
      subtitle: o.legal_name,
      meta: o.status,
      route: `/organizations/${o.id}`,
    }),
  );
  demo.workspaces.forEach((w) =>
    push({
      id: w.id,
      entity: "workspace",
      title: w.name,
      subtitle: w.descriptor,
      meta: w.status,
      route: w.route,
    }),
  );
  demo.products.forEach((p) =>
    push({
      id: p.id,
      entity: "product",
      title: p.name,
      subtitle: p.type,
      meta: p.current_phase,
      route: `/products/${p.key}`,
    }),
  );
  demo.projects.forEach((p) =>
    push({
      id: p.id,
      entity: "project",
      title: p.name,
      subtitle: p.objective,
      meta: p.phase,
      route: `/engineering`,
    }),
  );
  demo.repositories.forEach((r) =>
    push({
      id: r.id,
      entity: "repository",
      title: r.name,
      subtitle: r.latest_commit_message,
      meta: r.current_branch,
      route: `/repositories/${r.id}`,
    }),
  );
  demo.stages.forEach((s) =>
    push({
      id: s.id,
      entity: "stage",
      title: `${s.code} — ${s.name}`,
      subtitle: s.objective,
      meta: s.state,
      route: `/engineering/stages`,
    }),
  );
  demo.tasks.forEach((t) =>
    push({
      id: t.id,
      entity: "task",
      title: t.title,
      subtitle: productName(t.product_id),
      meta: t.state,
      route: `/engineering`,
    }),
  );
  demo.documents.forEach((d) =>
    push({
      id: d.id,
      entity: "document",
      title: d.title,
      subtitle: d.doc_type.replace(/_/g, " "),
      meta: `v${d.version}`,
      route: `/documents`,
    }),
  );
  demo.assets.forEach((a) =>
    push({
      id: a.id,
      entity: "asset",
      title: a.name,
      subtitle: a.role,
      meta: a.lifecycle,
      route: `/assets`,
    }),
  );
  demo.decisions.forEach((d) =>
    push({
      id: d.id,
      entity: "decision",
      title: `${d.identifier} — ${d.title}`,
      subtitle: d.decision,
      meta: d.state,
      route: `/decisions`,
    }),
  );
  demo.snapshots.forEach((s) =>
    push({
      id: s.id,
      entity: "snapshot",
      title: `${s.identifier} — ${s.artifact_name}`,
      subtitle: s.commit_ref,
      meta: s.version,
      route: `/engineering/checkpoints`,
    }),
  );
  demo.releases.forEach((r) =>
    push({
      id: r.id,
      entity: "release",
      title: `${r.name} ${r.version}`,
      subtitle: r.notes,
      meta: r.state,
      route: `/releases/${r.id}`,
    }),
  );
  demo.risks.forEach((r) =>
    push({
      id: r.id,
      entity: "risk",
      title: r.title,
      subtitle: r.recommended_response,
      meta: r.severity,
      route: "/command",
    }),
  );
  demo.approvals.forEach((a) =>
    push({
      id: a.id,
      entity: "approval",
      title: a.title,
      subtitle: a.notes,
      meta: a.decision,
      route: "/notifications",
    }),
  );
  demo.milestones.forEach((m) =>
    push({
      id: m.id,
      entity: "milestone",
      title: m.title,
      subtitle: m.gate_type,
      meta: m.due_on,
      route: "/roadmaps",
    }),
  );
  demo.roadmaps.forEach((r) =>
    push({
      id: r.id,
      entity: "roadmap",
      title: r.name,
      subtitle: r.horizon,
      meta: productName(r.product_id),
      route: "/roadmaps",
    }),
  );
  demo.builderJournal.forEach((j) =>
    push({
      id: j.id,
      entity: "journal",
      title: j.title,
      subtitle: j.summary,
      meta: `${j.entry_date} · ${j.tags.join(", ")}`,
      route: "/activity",
    }),
  );
  demo.activityEvents.forEach((a) =>
    push({
      id: a.id,
      entity: "activity",
      title: a.summary,
      subtitle: a.detail,
      meta: a.kind.replace(/_/g, " "),
      route: "/activity",
    }),
  );

  if (!q) return results.slice(0, 40);
  return results.filter((r) => `${r.title} ${r.subtitle} ${r.meta}`.toLowerCase().includes(q));
}

export const SEARCH_ENTITY_LABEL: Record<SearchEntity, string> = {
  organization: "Organizations",
  workspace: "Workspaces",
  product: "Products",
  project: "Projects",
  repository: "Repositories",
  stage: "Stages",
  task: "Tasks",
  document: "Documents",
  asset: "Assets",
  decision: "Decisions",
  snapshot: "Snapshots",
  release: "Releases",
  risk: "Risks",
  approval: "Approvals",
  milestone: "Milestones",
  roadmap: "Roadmaps",
  journal: "Builder Journal",
  activity: "Activity",
};
