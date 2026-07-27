import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {} from "lucide-react";
import { Elev8Mark } from "@/components/shell/BrandMark";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useAppState } from "@/app/app-state";
import { AI_RESPONSES, AI_SUGGESTED_PROMPTS, DEFAULT_AI_RESPONSE } from "@/data/demo";
import { DemoBanner, Label } from "@/components/primitives";

interface Turn {
  id: number;
  question: string;
  answer: string;
  citations: { label: string; route: string }[];
}

/**
 * Elev8 Intelligence — demonstration interface shell. Responses are authored
 * static content; no model call and no system access occurs.
 */
export function IntelligenceDrawer() {
  const { intelOpen, setIntelOpen } = useAppState();
  const [turns, setTurns] = useState<Turn[]>([]);
  const [draft, setDraft] = useState("");

  const ask = (question: string) => {
    const match = AI_RESPONSES[question] ?? DEFAULT_AI_RESPONSE;
    setTurns((prev) => [...prev, { id: prev.length + 1, question, ...match }]);
    setDraft("");
  };

  return (
    <Sheet open={intelOpen} onOpenChange={setIntelOpen}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 bg-canvas-2 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border p-4">
          <SheetTitle className="flex items-center gap-2 text-[0.875rem]">
            <Elev8Mark className="size-4 text-teal-bright" aria-hidden />
            Elev8 Intelligence
          </SheetTitle>
          <SheetDescription className="text-xs">
            Contextual briefing and record lookup across the command center.
          </SheetDescription>
          <DemoBanner text="Demonstration mode — no live system access" className="mt-2" />
        </SheetHeader>

        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {turns.length === 0 && (
            <div className="space-y-2">
              <Label>Suggested questions</Label>
              {AI_SUGGESTED_PROMPTS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => ask(p)}
                  className="block w-full rounded-xs border border-border bg-panel px-3 py-2 text-left text-[0.8125rem] transition-colors hover:border-border-strong hover:bg-panel-elevated"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {turns.map((t) => (
            <div key={t.id} className="space-y-2">
              <div className="rounded-xs border border-border-strong bg-panel-elevated px-3 py-2 text-[0.8125rem]">
                {t.question}
              </div>
              <div className="rounded-xs border border-teal/30 bg-teal/8 px-3 py-2 text-[0.8125rem] leading-relaxed">
                {t.answer}
                <div className="mt-2 space-y-1 border-t border-border pt-2">
                  <Label>Referenced records</Label>
                  {t.citations.map((c) => (
                    <Link
                      key={c.label}
                      to={c.route}
                      onClick={() => setIntelOpen(false)}
                      className="block text-[0.75rem] text-teal-bright hover:underline"
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <form
          className="border-t border-border p-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (draft.trim()) ask(draft.trim());
          }}
        >
          <label htmlFor="intel-input" className="sr-only">
            Ask Elev8 Intelligence
          </label>
          <div className="flex gap-2">
            <input
              id="intel-input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask about state, blockers, or records…"
              className="flex-1 rounded-xs border border-border bg-canvas px-2.5 py-2 text-[0.8125rem] outline-none focus:border-teal"
            />
            <button
              type="submit"
              className="rounded-xs border border-teal/50 bg-teal/15 px-3 text-[0.75rem] text-teal-bright hover:bg-teal/25"
            >
              Ask
            </button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
