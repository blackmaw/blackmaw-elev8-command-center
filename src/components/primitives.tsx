import { cn } from "@/lib/utils";
import {
  statusMeta,
  TONE_CLASS,
  TONE_DOT,
  PROVENANCE,
  type StatusMeta,
  type Tone,
} from "@/domain/status";
import type { Provenance } from "@/domain/types";
import type { ComponentType, ReactNode } from "react";

/* ------------------------------------------------------------------ panel */

export function Panel({
  title,
  subtitle,
  actions,
  children,
  className,
  bodyClassName,
  dense,
}: {
  title?: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  dense?: boolean;
}) {
  return (
    <section className={cn("panel flex min-w-0 flex-col", className)}>
      {(title || actions) && (
        <header className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
          <div className="min-w-0">
            {typeof title === "string" ? (
              <h2 className="truncate text-[0.8125rem] font-semibold tracking-tight">{title}</h2>
            ) : (
              title
            )}
            {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className={cn(dense ? "p-0" : "p-4", "min-w-0 flex-1", bodyClassName)}>{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------------ badge */

export function StatusPill({
  map,
  value,
  dot = true,
  className,
}: {
  map: Record<string, StatusMeta>;
  value: string | null | undefined;
  dot?: boolean;
  className?: string;
}) {
  const meta = statusMeta(map, value);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-xs border px-1.5 py-0.5 text-[0.6875rem] leading-4 font-medium whitespace-nowrap",
        TONE_CLASS[meta.tone],
        className,
      )}
    >
      {dot && <span className={cn("size-1.5 rounded-full", TONE_DOT[meta.tone])} aria-hidden />}
      {meta.label}
    </span>
  );
}

export function Tag({
  tone = "neutral",
  children,
  className,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-xs border px-1.5 py-0.5 text-[0.6875rem] leading-4",
        TONE_CLASS[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Provenance label — mandatory on any value that could look like live data. */
export function ProvenanceTag({ value, className }: { value: Provenance; className?: string }) {
  return <StatusPill map={PROVENANCE} value={value} className={className} />;
}

export function DemoBanner({ text, className }: { text?: string; className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-xs border border-warning/35 bg-warning/8 px-3 py-1.5 text-[0.6875rem] tracking-[0.08em] text-warning uppercase",
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-warning" aria-hidden />
      {text ?? "Demonstration data — live integration not connected"}
    </div>
  );
}

/* ------------------------------------------------------------- typography */

export function Label({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("label-caps", className)}>{children}</div>;
}

export function Mono({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("tech text-[0.75rem]", className)}>{children}</span>;
}

export function KeyValue({
  label,
  value,
  mono,
  className,
}: {
  label: string;
  value: ReactNode;
  mono?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <Label>{label}</Label>
      <div className={cn("mt-0.5 truncate text-[0.8125rem] text-foreground", mono && "tech")}>
        {value}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- metric */

export function MetricTile({
  label,
  value,
  hint,
  tone = "neutral",
  className,
  icon: Icon,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  tone?: Tone;
  className?: string;
  icon?: ComponentType<{ className?: string }>;
}) {
  return (
    <div
      className={cn(
        "panel-lift flex min-w-0 flex-col justify-between gap-2 px-3 py-2.5 transition-colors hover:border-border-active",
        className,
      )}
    >
      <div className="flex items-center gap-1.5">
        {Icon ? (
          <Icon className="size-3.5 shrink-0 text-muted-foreground" />
        ) : (
          <span className={cn("size-1.5 rounded-full", TONE_DOT[tone])} aria-hidden />
        )}
        <Label className="truncate">{label}</Label>
        {Icon && (
          <span className={cn("ml-auto size-1.5 rounded-full", TONE_DOT[tone])} aria-hidden />
        )}
      </div>
      <div className="num text-2xl leading-7 font-semibold tracking-tight">{value}</div>
      {hint && <div className="truncate text-[0.6875rem] text-muted-foreground">{hint}</div>}
    </div>
  );
}

/* ------------------------------------------------------------ radial ring */

const RING_STROKE: Record<Tone, string> = {
  neutral: "var(--muted-foreground)",
  teal: "var(--teal-bright)",
  success: "var(--success)",
  warning: "var(--warning)",
  critical: "var(--critical)",
  info: "var(--info)",
  muted: "var(--muted-foreground)",
};

/** Compact completion ring. Animates once on mount; respects reduced motion. */
export function RadialProgress({
  value,
  size = 56,
  tone = "teal",
  label,
  className,
}: {
  value: number;
  size?: number;
  tone?: Tone;
  label?: string;
  className?: string;
}) {
  const pct = Math.min(100, Math.max(0, value));
  const r = (size - 6) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className={cn("relative shrink-0", className)} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={label ?? `${pct}% complete`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--border-strong)"
          strokeWidth={3}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={RING_STROKE[tone]}
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * pct) / 100}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset 700ms ease-out" }}
        />
      </svg>
      <span className="num absolute inset-0 grid place-items-center text-[0.75rem] font-semibold">
        {pct}%
      </span>
    </div>
  );
}

/** Compact status ribbon used instead of a large warning block. */
export function StatusRibbon({
  items,
  className,
}: {
  items: { label: string; value: ReactNode; tone?: Tone }[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-4 gap-y-1.5 rounded-xs border border-border bg-canvas-2 px-3 py-1.5",
        className,
      )}
    >
      {items.map((it) => (
        <span
          key={it.label}
          className="flex items-center gap-1.5 text-[0.6875rem] whitespace-nowrap"
        >
          <span
            className={cn("size-1.5 rounded-full", TONE_DOT[it.tone ?? "neutral"])}
            aria-hidden
          />
          <span className="label-caps">{it.label}</span>
          <span className="tech text-foreground">{it.value}</span>
        </span>
      ))}
    </div>
  );
}

export function ProgressBar({
  value,
  tone = "teal",
  className,
}: {
  value: number;
  tone?: Tone;
  className?: string;
}) {
  return (
    <div
      className={cn("h-1.5 w-full overflow-hidden rounded-xs bg-canvas-2", className)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn("h-full transition-all", TONE_DOT[tone])}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

/* ------------------------------------------------------------- UI states */

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xs border border-dashed border-border px-6 py-10 text-center">
      <p className="text-sm font-medium">{title}</p>
      {description && <p className="max-w-sm text-xs text-muted-foreground">{description}</p>}
      {action}
    </div>
  );
}

export function LoadingState({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-2" aria-busy="true" aria-live="polite">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-8 animate-pulse rounded-xs bg-panel-elevated" />
      ))}
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-xs border border-critical/40 bg-critical/8 px-4 py-3 text-xs text-critical">
      {message}
    </div>
  );
}

export function PermissionDenied({ permission }: { permission: string }) {
  return (
    <div className="rounded-xs border border-border-strong bg-canvas-2 px-4 py-3 text-xs text-muted-foreground">
      Access denied. This view requires <span className="tech text-foreground">{permission}</span>{" "}
      within the active workspace scope. Authorization is enforced server-side once authentication
      is connected.
    </div>
  );
}

/* ------------------------------------------------------------ page header */

export function PageHeader({
  title,
  descriptor,
  actions,
  provenance,
  children,
}: {
  title: string;
  descriptor?: string;
  actions?: ReactNode;
  provenance?: Provenance;
  children?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-3 border-b border-border pb-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
          {descriptor && (
            <p className="mt-1 max-w-3xl text-xs text-muted-foreground">{descriptor}</p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {provenance && <ProvenanceTag value={provenance} />}
          {actions}
        </div>
      </div>
      {children}
    </header>
  );
}

export function SectionGrid({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("grid gap-3", className)}>{children}</div>;
}
