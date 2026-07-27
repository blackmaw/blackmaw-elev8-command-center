import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {} from "lucide-react";
import { Elev8Mark } from "@/components/shell/BrandMark";
import { DemoBanner, Label, PageHeader, Panel } from "@/components/primitives";
import {
  AI_RESPONSES,
  AI_SUGGESTED_PROMPTS,
  DEFAULT_AI_RESPONSE,
  INTELLIGENCE_BRIEFING,
} from "@/data/demo";

export const Route = createFileRoute("/ai")({
  head: () => ({
    meta: [
      { title: "Elev8 Intelligence — Command Center" },
      {
        name: "description",
        content:
          "Demonstration intelligence interface: authored briefings and record citations, no live model access.",
      },
      { property: "og:title", content: "Elev8 Intelligence — Command Center" },
      {
        property: "og:description",
        content: "Founder briefing interface over the recorded register.",
      },
    ],
  }),
  component: AiPage,
});

interface Turn {
  id: number;
  question: string;
  answer: string;
  citations: { label: string; route: string }[];
}

function AiPage() {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [draft, setDraft] = useState("");

  const ask = (question: string) => {
    if (!question.trim()) return;
    const match = AI_RESPONSES[question] ?? DEFAULT_AI_RESPONSE;
    setTurns((prev) => [...prev, { id: prev.length + 1, question, ...match }]);
    setDraft("");
  };

  return (
    <div className="mx-auto max-w-[1600px] space-y-4 p-4 lg:p-6">
      <PageHeader
        title="Elev8 Intelligence"
        descriptor="A demonstration interface. Answers are authored from the recorded register — no repository, infrastructure, or financial system is queried."
        provenance="demonstration"
      >
        <DemoBanner text="Demonstration mode — no live system access" />
      </PageHeader>

      <div className="grid gap-3 xl:grid-cols-[1.6fr_1fr]">
        <Panel title="Conversation" bodyClassName="flex flex-col gap-3">
          {turns.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              Ask a question about the current portfolio state, or choose a suggested question.
            </p>
          ) : (
            turns.map((t) => (
              <div key={t.id} className="space-y-2">
                <div className="rounded-xs border border-border bg-canvas px-3 py-2 text-[0.8125rem]">
                  {t.question}
                </div>
                <div className="rounded-xs border border-border-strong bg-panel-elevated px-3 py-2">
                  <div className="flex items-center gap-1.5">
                    <Elev8Mark className="size-3.5 text-teal-bright" aria-hidden />
                    <Label>Elev8 Intelligence</Label>
                  </div>
                  <p className="mt-1.5 text-[0.8125rem]">{t.answer}</p>
                  {t.citations.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {t.citations.map((c) => (
                        <Link
                          key={c.label}
                          to={c.route}
                          className="rounded-xs border border-border px-2 py-0.5 text-[0.6875rem] text-teal-bright hover:border-border-strong"
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

          <form
            className="mt-auto flex gap-2 pt-2"
            onSubmit={(e) => {
              e.preventDefault();
              ask(draft);
            }}
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask about products, stages, releases, or infrastructure…"
              aria-label="Ask Elev8 Intelligence"
              className="w-full rounded-xs border border-border bg-canvas px-2 py-2 text-[0.8125rem] outline-none focus:border-border-strong"
            />
            <button
              type="submit"
              className="rounded-xs border border-border-strong bg-panel-elevated px-3 text-[0.75rem] hover:border-border-active"
            >
              Ask
            </button>
          </form>
        </Panel>

        <div className="space-y-3">
          <Panel title="Current briefing">
            <p className="text-[0.8125rem]">{INTELLIGENCE_BRIEFING.headline}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {INTELLIGENCE_BRIEFING.citations.map((c) => (
                <Link
                  key={c.label}
                  to={c.route}
                  className="rounded-xs border border-border px-2 py-0.5 text-[0.6875rem] text-teal-bright hover:border-border-strong"
                >
                  {c.label}
                </Link>
              ))}
            </div>
          </Panel>

          <Panel title="Suggested questions" bodyClassName="space-y-1.5 p-3">
            {AI_SUGGESTED_PROMPTS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => ask(p)}
                className="block w-full rounded-xs border border-border px-2 py-1.5 text-left text-[0.75rem] text-muted-foreground hover:border-border-strong hover:text-foreground"
              >
                {p}
              </button>
            ))}
          </Panel>
        </div>
      </div>
    </div>
  );
}
