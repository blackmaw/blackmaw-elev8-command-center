import { useEffect, useState } from "react";
import { BOOT_SEEN_KEY, useAppState } from "@/app/app-state";
import { SYSTEM_STATE } from "@/data/demo";
import { cn } from "@/lib/utils";

const STEPS = [
  "Initializing secure workspace",
  "Loading organization registry",
  "Loading product portfolio",
  "Loading engineering state",
  "Loading infrastructure registry",
  "Loading institutional records",
  "Verifying system status",
];

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Startup sequence. Shown once per browser session when enabled in Settings;
 * never replays on route changes and always offers a skip control.
 */
export function BootSequence() {
  const { bootEnabled } = useAppState();
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!bootEnabled) return;
    if (typeof window === "undefined") return;
    if (window.sessionStorage.getItem(BOOT_SEEN_KEY)) return;
    window.sessionStorage.setItem(BOOT_SEEN_KEY, "1");
    if (prefersReducedMotion()) {
      setActive(true);
      const t = setTimeout(() => setActive(false), 700);
      return () => clearTimeout(t);
    }
    setActive(true);
    const interval = setInterval(() => setStep((s) => s + 1), 180);
    const done = setTimeout(() => setActive(false), 1900);
    return () => {
      clearInterval(interval);
      clearTimeout(done);
    };
  }, [bootEnabled]);

  if (!active) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[100] grid place-items-center bg-canvas grid-etch"
    >
      <div className="w-full max-w-md px-8">
        <div className="chrome-surface mb-6 h-px w-full" aria-hidden />
        <h1 className="text-xl font-semibold tracking-[0.28em]">ELEV8 COMMAND CENTER</h1>
        <p className="label-caps mt-1">Enterprise Operations and Engineering System</p>

        <ul className="tech mt-6 space-y-1 text-[0.75rem]">
          {STEPS.map((s, i) => (
            <li key={s} className={cn("flex items-center gap-2", i <= step ? "text-foreground" : "text-muted-foreground/40")}>
              <span className={cn("size-1.5 rounded-full", i < step ? "bg-success" : i === step ? "bg-teal-bright" : "bg-muted-foreground/30")} aria-hidden />
              {s}
              <span className="ml-auto">{i < step ? "OK" : i === step ? "…" : ""}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex items-center justify-between border-t border-border pt-3">
          <div>
            <div className="tech text-[0.75rem] text-teal-bright">{step >= STEPS.length ? "SYSTEM READY" : "INITIALIZING"}</div>
            <div className="text-[0.6875rem] text-muted-foreground">Welcome, Founder · {SYSTEM_STATE.build}</div>
          </div>
          <button
            type="button"
            onClick={() => setActive(false)}
            className="rounded-xs border border-border px-2.5 py-1 text-[0.75rem] text-muted-foreground hover:border-border-strong hover:text-foreground"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}