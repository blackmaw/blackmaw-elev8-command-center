/**
 * ACTIVITY ENGINE
 * ---------------
 * Single ledger read path. Recent Activity, timelines, notifications, and the
 * founder briefing all derive from these functions — no page filters raw data.
 */
import { db } from "@/data/selectors";
import type { ActivityEvent, ActivityKind, ID, Notification, WorkspaceKey } from "@/domain/types";

export interface ActivityQuery {
  workspaceId?: WorkspaceKey;
  productId?: ID;
  kinds?: ActivityKind[];
  since?: string;
  limit?: number;
}

export function queryActivity(q: ActivityQuery = {}): ActivityEvent[] {
  let rows = db.activityEvents.slice().sort((a, b) => b.occurred_at.localeCompare(a.occurred_at));
  if (q.workspaceId) rows = rows.filter((r) => r.workspace_id === q.workspaceId);
  if (q.productId) rows = rows.filter((r) => r.product_id === q.productId);
  if (q.kinds?.length) rows = rows.filter((r) => q.kinds!.includes(r.kind));
  if (q.since) rows = rows.filter((r) => r.occurred_at >= q.since!);
  return q.limit ? rows.slice(0, q.limit) : rows;
}

/** Changes recorded in the trailing window, used by "what changed today?". */
export function recentChanges(days = 7, workspaceId?: WorkspaceKey) {
  const latest = db.activityEvents.reduce((max, e) => (e.occurred_at > max ? e.occurred_at : max), "");
  const since = new Date(new Date(latest || Date.now()).getTime() - days * 86_400_000).toISOString();
  return queryActivity({ since, workspaceId });
}

/**
 * Activity contract. Every governed mutation must emit one of these events
 * through this factory so the ledger stays the only write path. The current
 * demonstration layer is read-only; the persistence adapter will call this.
 */
export function composeEvent(input: Omit<ActivityEvent, "id" | "provenance"> & { provenance?: ActivityEvent["provenance"] }): ActivityEvent {
  return { id: `act-${input.occurred_at}-${input.kind}`, provenance: input.provenance ?? "manually_recorded", ...input };
}

export function notificationsForWorkspace(workspaceId?: WorkspaceKey): Notification[] {
  const rows = db.notifications.slice().sort((a, b) => b.occurred_at.localeCompare(a.occurred_at));
  return workspaceId ? rows.filter((n) => !n.workspace_id || n.workspace_id === workspaceId) : rows;
}
