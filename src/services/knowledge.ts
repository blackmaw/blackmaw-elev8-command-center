/**
 * AI KNOWLEDGE LAYER
 * ------------------
 * The single question-answering surface behind Elev8 Intelligence. Answers are
 * composed from the centralized records and the derived engines, so the same
 * facts appear in the dashboard, the drawer, and the /ai route.
 * A future model-backed adapter replaces `answer()` only — not the retrieval.
 */
import { db } from "@/data/selectors";
import { generateFounderBriefing } from "./briefing";
import { getResumeContext } from "./resume";
import { recentChanges } from "./activity";
import { healthBoard } from "./health";
import type { WorkspaceKey } from "@/domain/types";

export interface KnowledgeAnswer {
  question: string;
  answer: string;
  citations: { label: string; route: string }[];
  provenance: "demonstration";
}

type Intent =
  | "resume"
  | "changes"
  | "approvals"
  | "next_action"
  | "documentation"
  | "blocked"
  | "health"
  | "unknown";

export function classify(question: string): Intent {
  const q = question.toLowerCase();
  if (/(left off|resume|where were we|continue)/.test(q)) return "resume";
  if (/(changed|change|today|this week|recent)/.test(q)) return "changes";
  if (/(approv|sign.?off|freeze request)/.test(q)) return "approvals";
  if (/(next|work on|priority|should i)/.test(q)) return "next_action";
  if (/(document|missing|gap)/.test(q)) return "documentation";
  if (/(block|stuck|risk)/.test(q)) return "blocked";
  if (/(health|status|ready)/.test(q)) return "health";
  return "unknown";
}

export function answer(question: string, workspaceId: WorkspaceKey = "command"): KnowledgeAnswer {
  const brief = generateFounderBriefing(workspaceId);
  const resume = getResumeContext();
  const base = { question, provenance: "demonstration" as const };

  switch (classify(question)) {
    case "resume":
      return {
        ...base,
        answer: `${resume.product?.name ?? "No active product"} at ${resume.stage?.code ?? "no stage"} on branch ${resume.branch ?? "—"}. Last completed action: ${resume.lastCompletedAction}. Next: ${resume.nextRecommendedAction}.`,
        citations: [
          { label: resume.product?.name ?? "Products", route: resume.route },
          { label: "Checkpoints", route: "/engineering/checkpoints" },
        ],
      };
    case "changes": {
      const rows = recentChanges(7, workspaceId === "command" ? undefined : workspaceId);
      return {
        ...base,
        answer: rows.length
          ? `${rows.length} recorded changes in the trailing window. Most recent: ${rows[0].summary} — ${rows[0].detail}`
          : "No changes recorded in the trailing window.",
        citations: [{ label: "Activity ledger", route: "/activity" }],
      };
    }
    case "approvals":
      return {
        ...base,
        answer: brief.pendingApprovals.length
          ? `${brief.pendingApprovals.length} approvals are pending explicit human decision: ${brief.pendingApprovals.map((a) => a.title).join("; ")}.`
          : "No approvals are pending.",
        citations: [
          { label: "Notifications", route: "/notifications" },
          { label: "Stages", route: "/engineering/stages" },
        ],
      };
    case "next_action":
      return {
        ...base,
        answer: `${brief.suggestedNextAction.label} (${brief.currentPriority.title}).`,
        citations: [{ label: "Resume work", route: brief.suggestedNextAction.route }],
      };
    case "documentation":
      return {
        ...base,
        answer: brief.documentationGaps.length
          ? `${brief.documentationGaps.length} documentation gaps: ${brief.documentationGaps
              .slice(0, 4)
              .map((g) => g.label)
              .join("; ")}.`
          : "The documentation register is fully approved.",
        citations: [{ label: "Documents", route: "/documents" }],
      };
    case "blocked": {
      const blocked = db.products.filter((p) => p.health === "blocked" || p.health === "at_risk");
      return {
        ...base,
        answer: blocked.length
          ? `${blocked.map((p) => `${p.name} (${p.health.replace(/_/g, " ")})`).join(", ")}. Open blockers: ${brief.blockers.length}.`
          : "No products are recorded as blocked.",
        citations: [
          { label: "Products", route: "/products" },
          { label: "Decisions", route: "/decisions" },
        ],
      };
    }
    case "health":
      return {
        ...base,
        answer: healthBoard()
          .map((h) => `${h.label} ${h.score} (${h.band.replace(/_/g, " ")})`)
          .join(" · "),
        citations: [{ label: "Command overview", route: "/command" }],
      };
    default:
      return {
        ...base,
        answer: db.DEFAULT_AI_RESPONSE.answer,
        citations: db.DEFAULT_AI_RESPONSE.citations,
      };
  }
}

export const suggestedQuestions = () => db.AI_SUGGESTED_PROMPTS;
export const briefings = (workspaceId?: WorkspaceKey) =>
  workspaceId ? db.aiBriefings.filter((b) => b.workspace_id === workspaceId) : db.aiBriefings;
