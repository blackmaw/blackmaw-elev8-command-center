import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Cpu, Globe, HardDrive, Network, Router, Server, CircleDashed } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { DemoBanner, KeyValue, Label, Mono, StatusPill } from "@/components/primitives";
import { getAsset, listConnections, listNodes } from "@/data/selectors";
import { ASSET_LIFECYCLE } from "@/domain/status";
import type { InfrastructureNode } from "@/domain/types";
import { cn } from "@/lib/utils";

const KIND_ICON: Record<string, typeof Server> = {
  external: Globe,
  edge: Router,
  network: Network,
  compute: Server,
  storage: HardDrive,
  planned: CircleDashed,
};

const NODE_STATE: Record<string, string> = {
  in_service: "in_service",
  planned: "planned",
  unknown: "planned",
};

/**
 * Read-only topology of the recorded infrastructure register.
 * No live telemetry is polled — every state shown is a manually recorded value.
 */
export function InfraTopology() {
  const nodes = listNodes();
  const connections = listConnections();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = nodes.find((n) => n.id === selectedId) ?? null;
  const asset = selected ? getAsset(selected.asset_id) : null;

  const tiers = useMemo(() => {
    const map = new Map<number, InfrastructureNode[]>();
    nodes.forEach((n) => map.set(n.tier, [...(map.get(n.tier) ?? []), n]));
    return [...map.entries()].sort((a, b) => a[0] - b[0]);
  }, [nodes]);

  const linkFor = (node: InfrastructureNode) =>
    connections.filter((c) => c.from_node_id === node.id || c.to_node_id === node.id);

  return (
    <div className="space-y-2 p-3">
      <DemoBanner text="Manually recorded topology — no live device polling" />
      <div className="space-y-1">
        {tiers.map(([tier, group], idx) => (
          <div key={tier}>
            <div
              className={cn(
                "grid gap-2",
                group.length === 1 ? "grid-cols-1" : group.length === 2 ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-3",
              )}
            >
              {group
                .slice()
                .sort((a, b) => a.column - b.column)
                .map((node) => {
                  const Icon = KIND_ICON[node.kind] ?? Server;
                  const active = selectedId === node.id;
                  return (
                    <button
                      key={node.id}
                      type="button"
                      onClick={() => setSelectedId(node.id)}
                      className={cn(
                        "flex min-w-0 items-center gap-2 rounded-xs border bg-canvas-2 px-2.5 py-2 text-left transition-colors",
                        active ? "border-border-active bg-panel-elevated" : "border-border hover:border-border-active",
                      )}
                    >
                      <Icon className={cn("size-4 shrink-0", node.state === "in_service" ? "text-teal-bright" : "text-muted-foreground")} aria-hidden />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[0.75rem] font-medium">{node.label}</span>
                        <span className="block truncate text-[0.6875rem] text-muted-foreground">{node.sublabel}</span>
                      </span>
                      <StatusPill map={ASSET_LIFECYCLE} value={NODE_STATE[node.state] ?? node.state} dot={false} />
                    </button>
                  );
                })}
            </div>
            {idx < tiers.length - 1 && (
              <div className="flex justify-center" aria-hidden>
                <span className="h-3 w-px bg-teal/40" />
              </div>
            )}
          </div>
        ))}
      </div>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelectedId(null)}>
        <SheetContent side="right" className="w-full bg-canvas-2 sm:max-w-md">
          <SheetHeader className="border-b border-border">
            <SheetTitle className="text-[0.875rem]">{selected?.label}</SheetTitle>
            <SheetDescription className="text-xs">{selected?.sublabel}</SheetDescription>
          </SheetHeader>
          {selected && (
            <div className="space-y-4 p-4">
              <div className="grid grid-cols-2 gap-3">
                <KeyValue label="Node role" value={selected.kind} />
                <KeyValue label="Recorded state" value={<StatusPill map={ASSET_LIFECYCLE} value={NODE_STATE[selected.state] ?? selected.state} />} />
              </div>
              {asset ? (
                <div className="grid grid-cols-2 gap-3 border-t border-border pt-3">
                  <KeyValue label="Asset" value={asset.name} />
                  <KeyValue label="Lifecycle" value={<StatusPill map={ASSET_LIFECYCLE} value={asset.lifecycle} />} />
                  <KeyValue label="Category" value={asset.category} />
                  <KeyValue label="Assigned role" value={asset.role} />
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No asset record is linked to this node.</p>
              )}
              <div className="space-y-1 border-t border-border pt-3">
                <Label>Recorded connections</Label>
                {linkFor(selected).map((c) => (
                  <div key={c.id} className="flex items-center justify-between gap-2 text-[0.75rem]">
                    <Mono>{c.medium}</Mono>
                    <span className="text-muted-foreground">{c.state}</span>
                  </div>
                ))}
              </div>
              <Link to="/infrastructure" className="inline-block text-[0.75rem] text-teal-bright hover:underline">
                Open infrastructure register
              </Link>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}