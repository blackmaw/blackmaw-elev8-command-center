import { Link, useRouterState } from "@tanstack/react-router";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { PRIMARY_NAV, UTILITY_NAV, WORKSPACE_CONTEXT_NAV, type NavItem } from "@/domain/navigation";
import { useAppState } from "@/app/app-state";
import { BrandMark } from "./BrandMark";
import { WorkspaceSelector } from "./WorkspaceSelector";
import { EnvironmentControl, OperatingModeControl, SystemStatusControl } from "./SystemPanels";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { SYSTEM_STATE } from "@/data/demo";
import { cn } from "@/lib/utils";

function NavLink({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const active = pathname === item.to || pathname.startsWith(`${item.to}/`);
  const Icon = item.icon;

  const link = (
    <Link
      to={item.to}
      className={cn(
        "group flex items-center gap-2.5 rounded-xs border border-transparent px-2 py-1.5 text-[0.8125rem] transition-colors",
        active
          ? "border-border-strong bg-panel-elevated text-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground",
        collapsed && "justify-center px-0",
      )}
      aria-current={active ? "page" : undefined}
    >
      <span className={cn("h-4 w-0.5 rounded-full", active ? "bg-teal-bright" : "bg-transparent")} aria-hidden />
      <Icon className="size-4 shrink-0" aria-hidden />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </Link>
  );

  if (!collapsed) return link;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right">
        <span className="font-medium">{item.label}</span>
        <span className="block text-[0.6875rem] text-muted-foreground">{item.description}</span>
      </TooltipContent>
    </Tooltip>
  );
}

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, workspaceId } = useAppState();
  const contextNav = WORKSPACE_CONTEXT_NAV[workspaceId] ?? [];

  return (
    <nav
      aria-label="Primary"
      className={cn(
        "hidden h-full shrink-0 flex-col border-r border-border bg-sidebar transition-[width] duration-150 md:flex",
        sidebarCollapsed ? "w-14" : "w-60",
      )}
    >
      <div className={cn("flex items-center gap-2 border-b border-border px-3 py-3", sidebarCollapsed && "justify-center px-0")}>
        <BrandMark collapsed={sidebarCollapsed} />
      </div>

      {!sidebarCollapsed && (
        <div className="space-y-2 border-b border-border px-3 py-3">
          <EnvironmentControl />
          <WorkspaceSelector />
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-2 py-3">
        {!sidebarCollapsed && <div className="label-caps px-2 pb-1.5">Operations</div>}
        <ul className="space-y-0.5">
          {PRIMARY_NAV.map((item) => (
            <li key={item.id}>
              <NavLink item={item} collapsed={sidebarCollapsed} />
            </li>
          ))}
        </ul>

        {contextNav.length > 0 && (
          <div className="mt-4 border-t border-border pt-3">
            {!sidebarCollapsed && <div className="label-caps px-2 pb-1.5">Workspace context</div>}
            <ul className="space-y-0.5">
              {contextNav.map((item) => (
                <li key={item.id}>
                  <NavLink item={item} collapsed={sidebarCollapsed} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="border-t border-border px-2 py-2">
        {!sidebarCollapsed && <div className="label-caps px-2 pb-1.5">System</div>}
        <ul className="space-y-0.5">
          {UTILITY_NAV.map((item) => (
            <li key={item.id}>
              <NavLink item={item} collapsed={sidebarCollapsed} />
            </li>
          ))}
        </ul>

        {!sidebarCollapsed && (
          <div className="mt-2 space-y-1 rounded-xs border border-border bg-canvas px-2 py-1.5">
            <div className="flex items-center justify-between text-[0.6875rem] text-muted-foreground">
              <span className="label-caps">System</span>
              <span className="w-auto"><SystemStatusControl /></span>
            </div>
            <div className="flex items-center justify-between text-[0.6875rem] text-muted-foreground">
              <span className="label-caps">Mode</span>
              <span className="min-w-0"><OperatingModeControl /></span>
            </div>
          </div>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={toggleSidebar}
              className={cn(
                "mt-2 flex w-full items-center gap-2.5 rounded-xs px-2 py-1.5 text-[0.75rem] text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground",
                sidebarCollapsed && "justify-center px-0",
              )}
              aria-label={sidebarCollapsed ? "Expand navigation" : "Collapse navigation"}
            >
              {sidebarCollapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
              {!sidebarCollapsed && <span>Collapse</span>}
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">
            {sidebarCollapsed ? "Expand navigation — preference is saved" : "Collapse navigation — preference is saved"}
          </TooltipContent>
        </Tooltip>

        {!sidebarCollapsed && (
          <div className="tech mt-1.5 truncate px-2 text-[0.625rem] text-muted-foreground">{SYSTEM_STATE.build}</div>
        )}
      </div>
    </nav>
  );
}
