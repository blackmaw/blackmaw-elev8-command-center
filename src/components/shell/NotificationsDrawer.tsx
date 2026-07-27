import { Link } from "@tanstack/react-router";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAppState } from "@/app/app-state";
import { listNotifications } from "@/data/selectors";
import { Label, Tag } from "@/components/primitives";
import { cn } from "@/lib/utils";

const TONE = { info: "info", success: "success", warning: "warning", critical: "critical" } as const;

export function NotificationsDrawer() {
  const { notificationsOpen, setNotificationsOpen } = useAppState();
  const rows = listNotifications();

  return (
    <Sheet open={notificationsOpen} onOpenChange={setNotificationsOpen}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 bg-canvas-2 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border p-4">
          <SheetTitle className="text-[0.875rem]">Notification Center</SheetTitle>
          <SheetDescription className="text-xs">
            Approval requests, registrations, and escalations across all workspaces.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 divide-y divide-border overflow-y-auto">
          {rows.map((n) => (
            <article key={n.id} className={cn("px-4 py-3", !n.read && "bg-panel/60")}>
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-[0.8125rem] font-medium">{n.title}</h3>
                <Tag tone={TONE[n.severity]}>{n.severity}</Tag>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{n.body}</p>
              <div className="mt-2 flex items-center justify-between">
                <Label>{new Date(n.occurred_at).toLocaleString()}</Label>
                {n.link && (
                  <Link to={n.link} onClick={() => setNotificationsOpen(false)} className="text-[0.75rem] text-teal-bright hover:underline">
                    Open record
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}