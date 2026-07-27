/**
 * RESUME ENGINE
 * -------------
 * Answers "where did we leave off?" from the centralized record set and
 * produces a single navigable destination for the Resume Work control.
 */
import { db } from "@/data/selectors";
import type { ResumeContext } from "@/domain/types";

export function getResumeContext(): ResumeContext {
  const priority = db.CURRENT_PRIORITY;
  const product = db.products.find((p) => p.id === priority.product_id) ?? null;
  const stage = db.stages.find((s) => s.id === priority.resume.stage_id) ?? null;
  const repository =
    db.repositories.find((r) => r.id === stage?.repository_id) ??
    db.repositories.find((r) => r.product_id === product?.id) ??
    null;
  const checkpoints = db.checkpoints
    .filter((c) => c.product_id === product?.id)
    .sort((a, b) => b.recorded_at.localeCompare(a.recorded_at));
  const sessions = db.engineeringSessions
    .filter((s) => s.product_id === product?.id)
    .sort((a, b) => b.started_at.localeCompare(a.started_at));
  const openBlockers = db.risks.filter(
    (r) => r.product_id === product?.id && (r.state === "open" || r.state === "mitigating"),
  );

  return {
    product,
    stage,
    repository,
    branch: priority.resume.branch,
    lastCompletedAction: priority.resume.last_completed_action,
    lastSession: sessions[0] ?? null,
    lastCheckpoint: checkpoints[0] ?? null,
    nextRecommendedAction: priority.resume.next_required_action,
    priority: openBlockers.some((r) => r.severity === "critical") ? "critical" : "high",
    owner: db.users.find((u) => u.id === priority.resume.owner_id) ?? null,
    status: stage ? stage.state.replace(/_/g, " ") : "unknown",
    route: resumeRoute(),
    provenance: "manually_recorded",
  };
}

/** Deterministic destination for the Resume Work control. */
export function resumeRoute(): string {
  const ctx = db.CURRENT_PRIORITY;
  const product = db.products.find((p) => p.id === ctx.product_id);
  return product ? `/products/${product.key}` : "/engineering/stages";
}
