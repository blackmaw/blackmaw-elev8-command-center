import { useEffect, type ReactNode } from "react";
import { Sidebar } from "@/components/shell/Sidebar";
import { TopBar } from "@/components/shell/TopBar";
import { CommandPalette } from "@/components/shell/CommandPalette";
import { IntelligenceDrawer } from "@/components/shell/IntelligenceDrawer";
import { NotificationsDrawer } from "@/components/shell/NotificationsDrawer";
import { BootSequence } from "@/components/shell/BootSequence";
import { StatusStrip } from "@/components/shell/StatusStrip";
import { MobileBar } from "@/components/shell/MobileBar";
import { CommandRail } from "@/components/shell/CommandRail";
import { useAppState } from "@/app/app-state";
import { TooltipProvider } from "@/components/ui/tooltip";

/**
 * Persistent application frame. Only the main region re-renders on navigation;
 * the rail, command bar, drawers, and status strip remain mounted.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const { setPaletteOpen, setIntelOpen } = useAppState();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
      if (meta && e.key.toLowerCase() === "i") {
        e.preventDefault();
        setIntelOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setPaletteOpen, setIntelOpen]);

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex h-screen w-full overflow-hidden bg-canvas text-foreground">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar />
          <div className="flex min-h-0 flex-1">
            <main id="main" className="min-h-0 min-w-0 flex-1 overflow-y-auto">
              {children}
            </main>
            <CommandRail />
          </div>
          <StatusStrip />
          <MobileBar />
        </div>
        <CommandPalette />
        <IntelligenceDrawer />
        <NotificationsDrawer />
        <BootSequence />
      </div>
    </TooltipProvider>
  );
}
