/**
 * FOUNDER BRIEFING ENGINE
 * -----------------------
 * Regenerated on every dashboard load from the centralized record set.
 * Nothing here is stored; every field is derived.
 */
import { db } from "@/data/selectors";
import { healthBoard } from "./health";
import { recentChanges } from "./activity";
import { getResumeContext } from "./resume";
import type { FounderBriefing, WorkspaceKey } from "@/domain/types";

export function generateFounderBriefing(workspaceId: WorkspaceKey = "command"): FounderBriefing {
  const scoped = <T extends { workspace_id: string | null }>(rows: T[]) =>
    workspaceId === "command"
      ? rows
      : rows.filter((r) => !r.workspace_id || r.workspace_id === workspaceId);

  const resume = getResumeContext();
  const priority = db.CURRENT_PRIORITY;

  const blockers = scoped(db.risks).filter((r) => r.state === "open" || r.state === "mitigating");
  const pendingApprovals = scoped(db.approvals).filter((a) => a.decision === "pending");

  const infrastructureAlerts = db.assets
    .filter((a) => a.lifecycle === "planned" || a.lifecycle === "maintenance")
    .map((a) => ({
      id: a.id,
      label: a.name,
      detail: `${a.role} — lifecycle ${a.lifecycle.replace(/_/g, " ")}`,
      severity: (a.lifecycle === "maintenance" ? "warning" : "info") as
        "info" | "warning" | "critical",
    }))
    .concat(
      db.risks
        .filter((r) => r.workspace_id === "infrastructure" && r.state !== "closed")
        .map((r) => ({
          id: r.id,
          label: r.title,
          detail: r.recommended_response,
          severity: (r.severity === "critical" ? "critical" : "warning") as
            "info" | "warning" | "critical",
        })),
    );

  const upcomingGates = db.milestones
    .filter((m) => m.state !== "approved" && m.state !== "frozen")
    .slice()
    .sort((a, b) => a.due_on.localeCompare(b.due_on));

  const documentationGaps = db.documents
    .filter((d) => d.approval_state !== "passed")
    .map((d) => ({
      id: d.id,
      label: d.title,
      detail: `v${d.version} — approval ${d.approval_state.replace(/_/g, " ")}`,
    }))
    .concat(
      db.repositories
        .filter((r) => r.documentation_state !== "passed")
        .map((r) => ({
          id: r.id,
          label: `${r.name} documentation`,
          detail: `Review state ${r.documentation_state.replace(/_/g, " ")}`,
        })),
    );

  return {
    generated_at: db.SYSTEM_STATE.last_sync_at,
    workspace_id: workspaceId,
    currentPriority: {
      title: `${resume.product?.name ?? "Portfolio"} — ${priority.phase}`,
      detail: priority.next_gate,
      route: resume.route,
    },
    currentProduct: resume.product,
    currentStage: resume.stage,
    blockers,
    pendingApprovals,
    infrastructureAlerts,
    upcomingGates,
    documentationGaps,
    recentChanges: recentChanges(14, workspaceId === "command" ? undefined : workspaceId).slice(
      0,
      8,
    ),
    suggestedNextAction: { label: resume.nextRecommendedAction, route: resume.route },
    health: healthBoard(),
    provenance: "demonstration",
  };
}
