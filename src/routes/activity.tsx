import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { DemoBanner, Mono, PageHeader, Panel, Tag } from "@/components/primitives";
import { getUserName, listActivity, productName } from "@/data/selectors";
import { TONE_DOT } from "@/domain/status";
import type { Tone } from "@/domain/status";

export const Route = createFileRoute("/activity")({
  head: () => ({
    meta: [
      { title: "Activity Ledger — Elev8 Command Center" },
      { name: "description", content: "Append-oriented institutional ledger of every recorded event across the group." },
      { property: "og:title", content: "Activity Ledger — Elev8 Command Center" },
      { property: "og:description", content: "Institutional event ledger." },
    ],
  }),
  component: ActivityPage,
});

const KIND_TONE: Record<string, Tone> = {
  checkpoint_recorded: "teal",
  snapshot_registered: "info",
  stage_review: "warning",
  risk_escalated: "critical",
  freeze_approved: "info",
  decision_approved: "success",
  document_superseded: "muted",
  asset_purchased: "neutral",
  repository_verified: "teal",
  validation_completed: "success",
  product_created: "neutral",
};

function isInternal(link: string | null): link is string {
  return typeof link === "string" && link.startsWith("/");
}

function ActivityPage() {
  const all = listActivity();
  const [kind, setKind] = useState("all");
  const kinds = ["all", ...Array.from(new Set(all.map((e) => e.kind)))];
  const events = kind === "all" ? all : all.filter((e) => e.kind === kind);

  return (
    <div className="mx-auto max-w-[1600px] space-y-4 p-4 lg:p-6">
      <PageHeader
        title="Activity Ledger"
        descriptor="Every recorded institutional event, newest first. Entries are written by people, not inferred by the system."
        provenance="manually_recorded"
      >
        <DemoBanner />
      </PageHeader>

      <div className="flex flex-wrap gap-1.5">
        {kinds.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setKind(k)}
            className={`rounded-xs border px-2 py-1 text-[0.75rem] transition-colors ${
              k === kind ? "border-border-strong bg-panel-elevated text-foreground" : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {k.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      <Panel dense bodyClassName="p-0">
        <ol className="divide-y divide-border">
          {events.map((e) => (
            <li key={e.id} className="flex min-w-0 gap-3 px-4 py-3">
              <span className={`mt-1.5 size-1.5 shrink-0 rounded-full ${TONE_DOT[KIND_TONE[e.kind] ?? "neutral"]}`} aria-hidden />
              <div className="min-w-0 flex-1">
                <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-2">
                  <span className="text-[0.8125rem] font-medium">{e.summary}</span>
                  <Mono className="text-[0.6875rem] text-muted-foreground">{new Date(e.occurred_at).toLocaleString()}</Mono>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{e.detail}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  <Tag>{e.kind.replace(/_/g, " ")}</Tag>
                  <Tag tone="muted">{getUserName(e.actor_id)}</Tag>
                  <Tag tone="muted">{productName(e.product_id)}</Tag>
                  {isInternal(e.link) && (
                    <Link to={e.link} className="text-[0.6875rem] text-teal-bright hover:underline">
                      Open record
                    </Link>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </Panel>
    </div>
  );
}