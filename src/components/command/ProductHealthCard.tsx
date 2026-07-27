import { Link } from "@tanstack/react-router";
import { Boxes, Cloud, Cpu, GraduationCap } from "lucide-react";
import { RadialProgress, StatusPill, Label } from "@/components/primitives";
import { HEALTH, LIFECYCLE, GATE_STATE } from "@/domain/status";
import type { Product } from "@/domain/types";
import { cn } from "@/lib/utils";

/** Abstract technical emblem per product key — never a live logo. */
const EMBLEM: Record<string, typeof Cpu> = {
  "elev8-os": Cpu,
  "elev8-cloud": Cloud,
  "elev8-ai-creator-studio": Boxes,
  "elev8-driving-academy": GraduationCap,
};

const RING_TONE: Record<string, "success" | "warning" | "critical" | "info" | "teal"> = {
  nominal: "success",
  watch: "warning",
  at_risk: "warning",
  blocked: "critical",
  paused: "info",
};

export function ProductHealthCard({ product, className }: { product: Product; className?: string }) {
  const Emblem = EMBLEM[product.key] ?? Cpu;
  return (
    <Link
      to="/products/$productKey"
      params={{ productKey: product.key }}
      className={cn(
        "panel-lift group flex min-w-0 flex-col gap-3 p-3 transition-colors hover:border-border-active",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <div className="grid size-8 shrink-0 place-items-center rounded-xs border border-border-strong bg-canvas-2">
          <Emblem className="size-4 text-teal-bright" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[0.8125rem] font-semibold">{product.name}</div>
          <div className="truncate text-[0.6875rem] text-muted-foreground">{product.type}</div>
        </div>
        <RadialProgress
          value={product.progress}
          size={48}
          tone={RING_TONE[product.health] ?? "teal"}
          label={`${product.name} completion`}
        />
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <StatusPill map={LIFECYCLE} value={product.lifecycle} />
        <StatusPill map={HEALTH} value={product.health} />
      </div>

      <div className="min-w-0 space-y-1.5 border-t border-border pt-2">
        <Row label="Phase" value={product.current_phase} />
        <Row label="Release" value={product.release_state} />
        <div className="flex items-center justify-between gap-2">
          <Label>Security</Label>
          <StatusPill map={GATE_STATE} value={product.security_state} dot={false} />
        </div>
        <div className="flex items-center justify-between gap-2">
          <Label>Validation</Label>
          <StatusPill map={GATE_STATE} value={product.validation_state} dot={false} />
        </div>
        <div className="min-w-0">
          <Label>Next gate</Label>
          <div className="mt-0.5 line-clamp-2 text-[0.75rem] text-foreground">{product.next_gate}</div>
        </div>
      </div>
    </Link>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-2">
      <Label>{label}</Label>
      <span className="truncate text-[0.75rem]">{value}</span>
    </div>
  );
}