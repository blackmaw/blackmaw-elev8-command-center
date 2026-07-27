/**
 * RELATIONSHIP ENGINE
 * -------------------
 * Resolves the institutional object graph from the centralized record set.
 * Pages must not re-implement linking logic: ask for the graph instead.
 *
 *   Organization -> Product -> Repository -> Release -> Snapshot
 *                            -> Stage -> Approval
 *                            -> Document -> Version
 *                            -> Task / Risk / Decision / Asset / Journal
 */
import { db } from "@/data/selectors";
import type { ID, ProductGraph } from "@/domain/types";

export function getProductGraph(productId: ID | undefined): ProductGraph | null {
  const product = db.products.find((p) => p.id === productId || p.key === productId);
  if (!product) return null;

  const stages = db.stages.filter((s) => s.product_id === product.id).sort((a, b) => a.sequence - b.sequence);
  const repositories = db.repositories.filter((r) => r.product_id === product.id);
  const stageIds = new Set(stages.map((s) => s.id));
  const releases = db.releases.filter((r) => r.product_id === product.id);
  const documents = db.documents.filter((d) => d.product_id === product.id);
  const assetIds = new Set(db.assets.filter((a) => a.services.some((s) => s.toLowerCase().includes(product.name.toLowerCase()))).map((a) => a.id));

  return {
    product,
    organization: db.organizations.find((o) => o.id === product.owner_org_id) ?? null,
    repositories,
    stages,
    currentStage: stages.find((s) => s.id === product.current_stage_id) ?? null,
    snapshots: db.snapshots.filter((s) => s.product_id === product.id).sort((a, b) => b.taken_on.localeCompare(a.taken_on)),
    releases,
    documents,
    roadmaps: db.roadmaps.filter((r) => r.product_id === product.id || r.lanes.some((l) => l.items.some((i) => i.product_id === product.id))),
    assets: db.assets.filter((a) => assetIds.has(a.id)),
    tasks: db.tasks.filter((t) => t.product_id === product.id),
    risks: db.risks.filter((r) => r.product_id === product.id),
    approvals: db.approvals.filter(
      (a) =>
        (a.subject_type === "stage" && stageIds.has(a.subject_id)) ||
        (a.subject_type === "release" && releases.some((r) => r.id === a.subject_id)) ||
        (a.subject_type === "document" && documents.some((d) => d.id === a.subject_id)),
    ),
    decisions: db.decisions.filter((d) => d.product_id === product.id),
    checkpoints: db.checkpoints.filter((c) => c.product_id === product.id).sort((a, b) => b.recorded_at.localeCompare(a.recorded_at)),
    journal: db.builderJournal.filter((j) => j.product_id === product.id).sort((a, b) => b.entry_date.localeCompare(a.entry_date)),
    activity: db.activityEvents.filter((a) => a.product_id === product.id).sort((a, b) => b.occurred_at.localeCompare(a.occurred_at)),
  };
}

/** Reverse lookups used by detail screens. */
export const productForRepository = (repositoryId: ID) => {
  const repo = db.repositories.find((r) => r.id === repositoryId);
  return repo?.product_id ? (db.products.find((p) => p.id === repo.product_id) ?? null) : null;
};

export const approvalsForSubject = (subjectId: ID) => db.approvals.filter((a) => a.subject_id === subjectId);
export const journalForRepository = (repositoryId: ID) => db.builderJournal.filter((j) => j.repository_id === repositoryId);
export const journalForDocument = (documentId: ID) => db.builderJournal.filter((j) => j.document_ids.includes(documentId));
