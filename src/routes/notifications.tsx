import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { DemoBanner, Mono, PageHeader, Panel, Tag } from "@/components/primitives";
import { getWorkspace, listNotifications } from "@/data/selectors";
import type { Tone } from "@/domain/status";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notification Center — Elev8 Command Center" },
      {
        name: "description",
        content:
          "Approval requests, escalations, and recorded system notices across every workspace.",
      },
      { property: "og:title", content: "Notification Center — Elev8 Command Center" },
      { property: "og:description", content: "Approvals, escalations, and system notices." },
    ],
  }),
  component: NotificationsPage,
});

const SEVERITY_TONE: Record<string, Tone> = {
  info: "info",
  success: "success",
  warning: "warning",
  critical: "critical",
};

function isInternal(link: string | null): link is string {
  return typeof link === "string" && link.startsWith("/");
}

function NotificationsPage() {
  const all = listNotifications();
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const rows = filter === "all" ? all : all.filter((n) => !n.read);

  return (
    <div className="mx-auto max-w-[1600px] space-y-4 p-4 lg:p-6">
      <PageHeader
        title="Notifications"
        descriptor="Every notice recorded across workspaces. Approval requests always require an explicit founder decision."
        provenance="demonstration"
      >
        <DemoBanner />
      </PageHeader>

      <div className="flex gap-1.5">
        {(["all", "unread"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-xs border px-2 py-1 text-[0.75rem] transition-colors ${
              f === filter
                ? "border-border-strong bg-panel-elevated text-foreground"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {f === "all" ? "All" : "Unread"}
          </button>
        ))}
      </div>

      <Panel dense bodyClassName="p-0">
        <ul className="divide-y divide-border">
          {rows.map((n) => (
            <li key={n.id} className="flex min-w-0 gap-3 px-4 py-3">
              <span
                className={`mt-1.5 size-1.5 shrink-0 rounded-full ${n.read ? "bg-muted-foreground" : "bg-teal-bright"}`}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-[0.8125rem] font-medium">{n.title}</span>
                  <Mono className="text-[0.6875rem] text-muted-foreground">
                    {new Date(n.occurred_at).toLocaleString()}
                  </Mono>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{n.body}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  <Tag tone={SEVERITY_TONE[n.severity] ?? "muted"}>{n.severity}</Tag>
                  <Tag tone="muted">{getWorkspace(n.workspace_id ?? undefined).short_name}</Tag>
                  {isInternal(n.link) && (
                    <Link to={n.link} className="text-[0.6875rem] text-teal-bright hover:underline">
                      Open record
                    </Link>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
