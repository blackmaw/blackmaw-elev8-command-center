import { SYSTEM_STATE } from "@/data/demo";
import { portfolioMetrics } from "@/data/selectors";
import { useAppState } from "@/app/app-state";
import { getWorkspace } from "@/data/selectors";

/** Desktop-only bottom system strip. */
export function StatusStrip() {
  const { workspaceId } = useAppState();
  const workspace = getWorkspace(workspaceId);
  const metrics = portfolioMetrics();

  return (
    <footer className="hidden h-7 shrink-0 items-center gap-4 border-t border-border bg-canvas-2 px-3 text-[0.6875rem] text-muted-foreground lg:flex">
      <span className="flex items-center gap-1.5">
        <span className="size-1.5 rounded-full bg-success" aria-hidden />
        System {SYSTEM_STATE.system_status}
      </span>
      <span className="tech">ENV {SYSTEM_STATE.environment}</span>
      <span className="tech">WS {workspace.short_name}</span>
      <span className="num">Approvals {metrics.pendingApprovals}</span>
      <span className="num">Blockers {metrics.openBlockers}</span>
      <span className="num">Assets {metrics.infrastructureAssets}</span>
      <span className="ml-auto tech">{SYSTEM_STATE.build}</span>
      <span className="tech">Last sync {new Date(SYSTEM_STATE.last_sync_at).toLocaleString()}</span>
    </footer>
  );
}
