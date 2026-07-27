import { Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowUpRight, ShieldCheck } from "lucide-react";
import { useAppState } from "@/app/app-state";
import { DemoBanner, Label, StatusPill, Tag } from "@/components/primitives";
import { AI_SUGGESTED_PROMPTS, INTELLIGENCE_BRIEFING, currentUser } from "@/data/demo";
import { getUserName, listApprovals, listRisks, productName } from "@/data/selectors";
import { SEVERITY, STAGE_STATE } from "@/domain/status";

const RAIL_PROMPTS = AI_SUGGESTED_PROMPTS.slice(0, 5);

/**
 * Persistent right-hand governance rail: Elev8 Intelligence, pending human
 * approvals, and active risks. Rendered only on wide desktop; the same
 * content remains reachable through the drawers on smaller displays.
 */
export function CommandRail() {
  const { setIntelOpen } = useAppState();
  const approvals = listApprovals({ pendingOnly: true });
  const risks = listRisks()
    .filter((r) => r.state !== "closed")
    .slice(0, 4);

  return (
    <aside
      aria-label="Intelligence and governance"
      className="hidden w-[320px] shrink-0 flex-col overflow-y-auto border-l border-border bg-canvas-2 xl:flex"
    >
      <section className="border-b border-border p-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-[0.8125rem] font-semibold tracking-[0.1em]">
              ELEV8 INTELLIGENCE
            </div>
            <div className="label-caps">AI Command Assistant</div>
          </div>
          <Tag tone="warning">Demonstration</Tag>
        </div>

        <div
          className="mt-3 grid h-20 place-items-center overflow-hidden rounded-xs border border-border-strong bg-canvas grid-etch"
          aria-hidden
        >
          <div className="relative grid size-12 place-items-center rounded-full border border-border-active">
            <div className="size-7 rounded-full border border-teal/50" />
            <div className="absolute size-2 rounded-full bg-teal-bright" />
          </div>
        </div>

        <p className="mt-3 text-[0.75rem] leading-relaxed text-muted-foreground">
          Good day, {currentUser.name}. {INTELLIGENCE_BRIEFING.headline}
        </p>

        <div className="mt-3 space-y-1.5">
          <Label>Prompt shortcuts</Label>
          {RAIL_PROMPTS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setIntelOpen(true)}
              className="block w-full truncate rounded-xs border border-border bg-panel px-2.5 py-1.5 text-left text-[0.75rem] transition-colors hover:border-border-active hover:bg-panel-elevated"
            >
              {p}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setIntelOpen(true)}
          className="mt-2.5 inline-flex w-full items-center justify-center gap-1.5 rounded-xs border border-teal/50 bg-teal/12 px-2.5 py-1.5 text-[0.75rem] text-teal-bright hover:bg-teal/20"
        >
          Open full AI interface
          <ArrowUpRight className="size-3.5" aria-hidden />
        </button>
      </section>

      <section className="border-b border-border p-3">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="size-3.5 text-warning" aria-hidden />
          <Label>Pending approvals</Label>
          <span className="num ml-auto text-[0.6875rem] text-muted-foreground">
            {approvals.length}
          </span>
        </div>
        <ul className="mt-2 space-y-1.5">
          {approvals.map((a) => (
            <li key={a.id} className="rounded-xs border border-border bg-panel px-2.5 py-2">
              <div className="text-[0.75rem] leading-snug">{a.title}</div>
              <div className="mt-1.5 flex items-center justify-between gap-2">
                <span className="truncate text-[0.6875rem] text-muted-foreground">
                  {a.subject_type} · {getUserName(a.approver_id)}
                </span>
                <StatusPill map={STAGE_STATE} value="review_required" dot={false} />
              </div>
            </li>
          ))}
        </ul>
        <Link
          to="/decisions"
          className="mt-2 inline-block text-[0.75rem] text-teal-bright hover:underline"
        >
          Open approval register
        </Link>
      </section>

      <section className="p-3">
        <div className="flex items-center gap-1.5">
          <AlertTriangle className="size-3.5 text-critical" aria-hidden />
          <Label>Active risks</Label>
          <span className="num ml-auto text-[0.6875rem] text-muted-foreground">{risks.length}</span>
        </div>
        <ul className="mt-2 space-y-1.5">
          {risks.map((r) => (
            <li key={r.id} className="rounded-xs border border-border bg-panel px-2.5 py-2">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[0.75rem] leading-snug">{r.title}</span>
                <StatusPill map={SEVERITY} value={r.severity} dot={false} />
              </div>
              <div className="mt-1 truncate text-[0.6875rem] text-muted-foreground">
                {productName(r.product_id)} · {r.recommended_response}
              </div>
            </li>
          ))}
        </ul>
        <DemoBanner text="Demonstration records — not live monitoring" className="mt-2" />
      </section>
    </aside>
  );
}
