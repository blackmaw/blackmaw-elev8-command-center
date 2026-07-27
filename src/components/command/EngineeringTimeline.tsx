import { Link } from "@tanstack/react-router";
import { Label, Mono } from "@/components/primitives";
import { listActivity, productName } from "@/data/selectors";
import { TONE_DOT } from "@/domain/status";
import type { Tone } from "@/domain/status";

const KIND_TONE: Record<string, Tone> = {
  checkpoint_recorded: "teal",
  snapshot_registered: "info",
  stage_review: "warning",
  risk_escalated: "critical",
  approval_recorded: "success",
  freeze_recorded: "info",
  decision_recorded: "teal",
  document_superseded: "muted",
};

/** Compact engineering event rail derived from the recorded activity ledger. */
export function EngineeringTimeline({ limit = 7 }: { limit?: number }) {
  const events = listActivity({ limit });
  return (
    <ol className="relative space-y-3 px-4 py-3">
      <span className="absolute top-3 bottom-3 left-[1.32rem] w-px bg-border" aria-hidden />
      {events.map((e) => (
        <li key={e.id} className="relative flex min-w-0 gap-3 pl-0">
          <span className={`relative z-10 mt-1.5 size-1.5 shrink-0 rounded-full ${TONE_DOT[KIND_TONE[e.kind] ?? "neutral"]}`} aria-hidden />
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-baseline justify-between gap-2">
              <span className="truncate text-[0.75rem] font-medium">{e.summary}</span>
              <Mono className="shrink-0 text-[0.6875rem] text-muted-foreground">
                {new Date(e.occurred_at).toLocaleDateString(undefined, { month: "short", day: "2-digit" })}
              </Mono>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Label>{e.kind.replace(/_/g, " ")}</Label>
              {e.product_id && <span className="text-[0.6875rem] text-muted-foreground">{productName(e.product_id)}</span>}
            </div>
          </div>
        </li>
      ))}
      <li className="pl-[1.4rem]">
        <Link to="/activity" className="text-[0.75rem] text-teal-bright hover:underline">
          View full timeline
        </Link>
      </li>
    </ol>
  );
}