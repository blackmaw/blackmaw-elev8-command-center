import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, Command, Menu, PanelRight, Search, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppState } from "@/app/app-state";
import { getWorkspace, listNotifications } from "@/data/selectors";
import { ROUTE_LABELS, PRIMARY_NAV, UTILITY_NAV } from "@/domain/navigation";
import { SYSTEM_STATE, currentUser } from "@/data/demo";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WorkspaceSelector } from "./WorkspaceSelector";
import { BrandMark } from "./BrandMark";
import { ROLES } from "@/domain/roles";
import { cn } from "@/lib/utils";

function useClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);
  return now;
}

function Breadcrumbs() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const parts = pathname.split("/").filter(Boolean);
  return (
    <nav aria-label="Breadcrumb" className="hidden min-w-0 items-center gap-1.5 text-[0.75rem] lg:flex">
      <Link to="/command" className="text-muted-foreground hover:text-foreground">
        Command Center
      </Link>
      {parts.map((part, i) => (
        <span key={`${part}-${i}`} className="flex min-w-0 items-center gap-1.5">
          <span className="text-muted-foreground/50" aria-hidden>
            /
          </span>
          <span className={cn("truncate", i === parts.length - 1 ? "text-foreground" : "text-muted-foreground")}>
            {ROUTE_LABELS[part] ?? part.replace(/-/g, " ")}
          </span>
        </span>
      ))}
    </nav>
  );
}

export function TopBar() {
  const { setPaletteOpen, setIntelOpen, setNotificationsOpen, workspaceId } = useAppState();
  const workspace = getWorkspace(workspaceId);
  const unread = listNotifications().filter((n) => !n.read).length;
  const now = useClock();

  return (
    <header className="flex h-12 shrink-0 items-center gap-3 border-b border-border bg-canvas-2 px-3">
      <Sheet>
        <SheetTrigger
          className="rounded-xs p-1.5 text-muted-foreground hover:bg-panel-elevated hover:text-foreground md:hidden"
          aria-label="Open navigation"
        >
          <Menu className="size-4" />
        </SheetTrigger>
        <SheetContent side="left" className="w-72 bg-sidebar p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <div className="border-b border-border p-3">
            <BrandMark />
            <div className="mt-3">
              <WorkspaceSelector />
            </div>
          </div>
          <div className="max-h-[calc(100vh-8rem)] overflow-y-auto p-2">
            {[...PRIMARY_NAV, ...UTILITY_NAV].map((item) => (
              <Link
                key={item.id}
                to={item.to}
                className="flex items-center gap-2.5 rounded-xs px-2 py-2 text-[0.8125rem] text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground"
              >
                <item.icon className="size-4" aria-hidden />
                {item.label}
              </Link>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      <Breadcrumbs />

      <div className="ml-auto flex items-center gap-2">
        <div className="hidden items-center gap-2 xl:flex">
          <span className="label-caps">Workspace</span>
          <span className="text-[0.75rem]">{workspace.short_name}</span>
          <span className="h-3 w-px bg-border-strong" aria-hidden />
          <span className="flex items-center gap-1.5 text-[0.75rem] text-muted-foreground">
            <span className="size-1.5 rounded-full bg-warning" aria-hidden />
            <span className="tech">{SYSTEM_STATE.environment}</span>
          </span>
          <span className="h-3 w-px bg-border-strong" aria-hidden />
          <span className="flex items-center gap-1.5 text-[0.75rem] text-muted-foreground">
            <span className="size-1.5 rounded-full bg-success" aria-hidden />
            <span className="tech">SYS {SYSTEM_STATE.system_status}</span>
          </span>
          <span className="h-3 w-px bg-border-strong" aria-hidden />
          <span className="tech num text-[0.75rem] text-muted-foreground" suppressHydrationWarning>
            {now ? now.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "—"}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setPaletteOpen(true)}
          className="flex items-center gap-2 rounded-xs border border-border bg-canvas px-2 py-1.5 text-[0.75rem] text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
          aria-label="Open command palette"
        >
          <Search className="size-3.5" aria-hidden />
          <span className="hidden sm:inline">Search or run a command</span>
          <kbd className="tech ml-1 hidden items-center gap-0.5 rounded-xs border border-border px-1 py-px text-[0.625rem] sm:inline-flex">
            <Command className="size-2.5" aria-hidden />K
          </kbd>
        </button>

        <button
          type="button"
          onClick={() => setIntelOpen(true)}
          className="rounded-xs border border-border p-1.5 text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
          aria-label="Open intelligence drawer"
        >
          <Sparkles className="size-4" />
        </button>

        <button
          type="button"
          onClick={() => setNotificationsOpen(true)}
          className="relative rounded-xs border border-border p-1.5 text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
          aria-label={`Notifications, ${unread} unread`}
        >
          <Bell className="size-4" />
          {unread > 0 && (
            <span className="num absolute -top-1.5 -right-1.5 grid min-w-4 place-items-center rounded-full bg-critical px-1 text-[0.5625rem] leading-4 text-critical-foreground">
              {unread}
            </span>
          )}
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-xs border border-border px-1.5 py-1 hover:border-border-strong" aria-label="Founder menu">
            <span className="tech grid size-6 place-items-center rounded-xs bg-panel-elevated text-[0.625rem]">{currentUser.initials}</span>
            <span className="hidden text-[0.75rem] sm:inline">{currentUser.name}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>
              <div className="text-[0.8125rem]">{currentUser.name}</div>
              <div className="text-[0.6875rem] font-normal text-muted-foreground">{currentUser.title}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled className="text-[0.75rem]">
              Role — {ROLES[currentUser.role].name}
            </DropdownMenuItem>
            <DropdownMenuItem disabled className="text-[0.75rem]">
              Session — development preview (no auth)
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/settings">Settings</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <button
          type="button"
          onClick={() => setIntelOpen(true)}
          className="hidden rounded-xs border border-border p-1.5 text-muted-foreground hover:border-border-strong hover:text-foreground 2xl:block"
          aria-label="Toggle contextual drawer"
        >
          <PanelRight className="size-4" />
        </button>
      </div>
    </header>
  );
}
