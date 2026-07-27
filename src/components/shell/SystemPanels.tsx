import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { KeyValue, Label, StatusPill, Tag } from "@/components/primitives";
import { SYSTEM_STATE, currentUser } from "@/data/demo";
import { listIntegrations, portfolioMetrics } from "@/data/selectors";
import { INTEGRATION_STATE } from "@/domain/status";
import { ROLES } from "@/domain/roles";
import { cn } from "@/lib/utils";

function Trigger({
  children,
  className,
  label,
}: {
  children: ReactNode;
  className?: string;
  label: string;
}) {
  return (
    <DialogTrigger
      aria-label={label}
      className={cn(
        "flex w-full items-center gap-1.5 rounded-xs px-1 py-0.5 text-left transition-colors hover:bg-sidebar-accent hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none",
        className,
      )}
    >
      {children}
    </DialogTrigger>
  );
}

/** Environment chip — opens the development preview details panel. */
export function EnvironmentControl() {
  return (
    <Dialog>
      <Trigger label="Open environment details" className="text-[0.6875rem] text-muted-foreground">
        <span className="size-1.5 rounded-full bg-warning" aria-hidden />
        <span className="tech tracking-tight">{SYSTEM_STATE.environment}</span>
      </Trigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-[0.9375rem]">Development Preview</DialogTitle>
          <DialogDescription className="text-xs">
            This environment runs on a demonstration record set. No production system, repository,
            or financial account is connected.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          <KeyValue label="Environment" value={SYSTEM_STATE.environment} />
          <KeyValue label="Build" value={SYSTEM_STATE.build} mono />
          <KeyValue label="Authentication" value={<Tag tone="warning">Not connected</Tag>} />
          <KeyValue label="Persistence" value={<Tag tone="muted">In-memory record set</Tag>} />
          <KeyValue
            label="Last sync"
            value={new Date(SYSTEM_STATE.last_sync_at).toLocaleString()}
          />
          <KeyValue label="Data provenance" value={<Tag tone="warning">Demonstration</Tag>} />
        </div>
        <Link to="/settings" className="text-[0.75rem] text-teal-bright hover:underline">
          Open system settings
        </Link>
      </DialogContent>
    </Dialog>
  );
}

/** System status indicator — opens the status panel. */
export function SystemStatusControl() {
  const integrations = listIntegrations();
  const metrics = portfolioMetrics();

  return (
    <Dialog>
      <Trigger
        label="Open system status"
        className="justify-end text-[0.6875rem] text-muted-foreground"
      >
        <span className="size-1.5 rounded-full bg-success" aria-hidden />
        {SYSTEM_STATE.system_status}
      </Trigger>
      <DialogContent className="max-h-[80vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[0.9375rem]">
            System status — {SYSTEM_STATE.system_status}
          </DialogTitle>
          <DialogDescription className="text-xs">
            Shell health is derived from the recorded register. No live probe or telemetry agent is
            running.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          <KeyValue label="Shell" value={<Tag tone="success">Operational</Tag>} />
          <KeyValue label="Record set" value={<Tag tone="success">Loaded</Tag>} />
          <KeyValue
            label="Pending approvals"
            value={<span className="num">{metrics.pendingApprovals}</span>}
          />
          <KeyValue
            label="Open blockers"
            value={<span className="num">{metrics.openBlockers}</span>}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Integration surface</Label>
          {integrations.map((i) => (
            <div
              key={i.id}
              className="flex items-center justify-between gap-3 border-b border-border/60 pb-1 text-[0.8125rem] last:border-0"
            >
              <span className="min-w-0 truncate">{i.name}</span>
              <StatusPill map={INTEGRATION_STATE} value={i.state} dot={false} />
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** Operating mode indicator — opens the mode detail panel. */
export function OperatingModeControl() {
  const role = ROLES[currentUser.role];

  return (
    <Dialog>
      <Trigger
        label="Open operating mode details"
        className="justify-end truncate text-[0.6875rem] text-muted-foreground"
      >
        <span className="truncate">{SYSTEM_STATE.operational_mode}</span>
      </Trigger>
      <DialogContent className="max-h-[80vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[0.9375rem]">{SYSTEM_STATE.operational_mode}</DialogTitle>
          <DialogDescription className="text-xs">
            The operating mode follows the signed-in role register. Mode selection is governed and
            fixed while authentication is not connected.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          <KeyValue label="Operator" value={currentUser.name} />
          <KeyValue label="Role" value={role.name} />
          <KeyValue label="Mode" value={<Tag tone="teal">{SYSTEM_STATE.operational_mode}</Tag>} />
          <KeyValue
            label="Mode changes"
            value={<Tag tone="muted">Requires connected authentication</Tag>}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Available modes</Label>
          {Object.values(ROLES).map((r) => (
            <div
              key={r.key}
              className="flex items-start justify-between gap-3 border-b border-border/60 pb-1 text-[0.8125rem] last:border-0"
            >
              <span className="min-w-0">
                <span className="block">{r.name}</span>
                <span className="block text-xs text-muted-foreground">{r.description}</span>
              </span>
              <Tag tone={r.key === currentUser.role ? "teal" : "muted"}>
                {r.key === currentUser.role ? "Active" : "Unavailable"}
              </Tag>
            </div>
          ))}
        </div>
        <Link to="/settings" className="text-[0.75rem] text-teal-bright hover:underline">
          Open system settings
        </Link>
      </DialogContent>
    </Dialog>
  );
}
