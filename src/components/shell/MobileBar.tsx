import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, LayoutDashboard, Gauge, Search } from "lucide-react";
import { Elev8Mark } from "@/components/shell/BrandMark";
import { useAppState } from "@/app/app-state";
import { cn } from "@/lib/utils";

/** Mobile bottom navigation: status review and lightweight actions only. */
export function MobileBar() {
  const { setPaletteOpen, setIntelOpen, setNotificationsOpen } = useAppState();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const cls = (to: string) =>
    cn(
      "flex flex-1 flex-col items-center gap-0.5 py-2 text-[0.625rem]",
      pathname.startsWith(to) ? "text-teal-bright" : "text-muted-foreground",
    );

  return (
    <nav aria-label="Mobile" className="flex shrink-0 items-stretch border-t border-border bg-canvas-2 md:hidden">
      <Link to="/command" className={cls("/command")}>
        <LayoutDashboard className="size-4" aria-hidden />
        Command
      </Link>
      <Link to="/products" className={cls("/products")}>
        <Gauge className="size-4" aria-hidden />
        Products
      </Link>
      <button type="button" onClick={() => setPaletteOpen(true)} className="flex flex-1 flex-col items-center gap-0.5 py-2 text-[0.625rem] text-muted-foreground">
        <Search className="size-4" aria-hidden />
        Search
      </button>
      <button type="button" onClick={() => setNotificationsOpen(true)} className="flex flex-1 flex-col items-center gap-0.5 py-2 text-[0.625rem] text-muted-foreground">
        <Bell className="size-4" aria-hidden />
        Alerts
      </button>
      <button type="button" onClick={() => setIntelOpen(true)} className="flex flex-1 flex-col items-center gap-0.5 py-2 text-[0.625rem] text-muted-foreground">
        <Elev8Mark className="size-4" aria-hidden />
        AI
      </button>
    </nav>
  );
}