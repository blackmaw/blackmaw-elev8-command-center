import { Check, ChevronsUpDown } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppState } from "@/app/app-state";
import { listWorkspaces, getWorkspace } from "@/data/selectors";
import { StatusPill } from "@/components/primitives";
import { ENTITY_STATUS } from "@/domain/status";
import { cn } from "@/lib/utils";
import type { WorkspaceKey } from "@/domain/types";

export function WorkspaceSelector({ compact = false }: { compact?: boolean }) {
  const { workspaceId, setWorkspaceId } = useAppState();
  const navigate = useNavigate();
  const active = getWorkspace(workspaceId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-xs border border-border bg-canvas px-2 py-1.5 text-left transition-colors hover:border-border-strong hover:bg-panel-elevated focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none",
          compact && "w-auto min-w-[13rem]",
        )}
        aria-label="Select workspace"
      >
        <span className="min-w-0">
          <span className="label-caps block">Workspace</span>
          <span className="block truncate text-[0.8125rem] font-medium">{active.short_name}</span>
        </span>
        <ChevronsUpDown className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72">
        <DropdownMenuLabel className="label-caps">Operational context</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {listWorkspaces().map((w) => (
          <DropdownMenuItem
            key={w.id}
            className="flex items-start gap-2 py-2"
            onSelect={() => {
              setWorkspaceId(w.id as WorkspaceKey);
              navigate({ to: w.route });
            }}
          >
            <Check className={cn("mt-0.5 size-3.5", w.id === workspaceId ? "opacity-100 text-teal-bright" : "opacity-0")} />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[0.8125rem] font-medium">{w.name}</span>
              <span className="block truncate text-[0.6875rem] text-muted-foreground">{w.descriptor}</span>
            </span>
            <StatusPill map={ENTITY_STATUS} value={w.status} dot={false} />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
