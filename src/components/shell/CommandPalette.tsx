import { useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAppState } from "@/app/app-state";
import { listWorkspaces, listProducts, listRepositories, searchAll } from "@/data/selectors";
import { toast } from "sonner";
import type { WorkspaceKey } from "@/domain/types";

interface PendingAction {
  title: string;
  description: string;
  confirmLabel: string;
  run: () => void;
}

/**
 * Global command palette (Cmd/Ctrl + K). Any action that records a governed
 * decision or mutates state routes through a confirmation dialog first.
 */
export function CommandPalette() {
  const { paletteOpen, setPaletteOpen, setWorkspaceId, setIntelOpen, addRecentSearch } = useAppState();
  const [query, setQuery] = useState("");
  const [pending, setPending] = useState<PendingAction | null>(null);
  const navigate = useNavigate();

  const results = useMemo(() => (query.length > 1 ? searchAll(query).slice(0, 8) : []), [query]);

  const go = (to: string) => {
    setPaletteOpen(false);
    navigate({ to });
  };

  const confirm = (action: PendingAction) => {
    setPaletteOpen(false);
    setPending(action);
  };

  return (
    <>
      <CommandDialog open={paletteOpen} onOpenChange={setPaletteOpen} title="Command palette" description="Search records and run commands">
        <CommandInput placeholder="Search records or run a command…" value={query} onValueChange={setQuery} />
        <CommandList>
          <CommandEmpty>No matching record or command.</CommandEmpty>

          {results.length > 0 && (
            <CommandGroup heading="Records">
              {results.map((r) => (
                <CommandItem
                  key={`${r.entity}-${r.id}`}
                  value={`${r.title} ${r.subtitle}`}
                  onSelect={() => {
                    addRecentSearch(query);
                    go(r.route);
                  }}
                >
                  <span className="label-caps w-24 shrink-0">{r.entity}</span>
                  <span className="truncate">{r.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          <CommandGroup heading="Navigate">
            <CommandItem onSelect={() => go("/command")}>Open Command Overview</CommandItem>
            <CommandItem onSelect={() => go("/products")}>Open product portfolio</CommandItem>
            <CommandItem onSelect={() => go("/repositories")}>Open repository center</CommandItem>
            <CommandItem onSelect={() => go("/infrastructure/topology")}>Open infrastructure topology</CommandItem>
            <CommandItem onSelect={() => go("/documents")}>Search documents</CommandItem>
            <CommandItem onSelect={() => go("/engineering/stages")}>View pending approvals</CommandItem>
            <CommandItem onSelect={() => go("/releases")}>Start release review</CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Products">
            {listProducts().map((p) => (
              <CommandItem key={p.id} value={`product ${p.name}`} onSelect={() => go(`/products/${p.key}`)}>
                Open product — {p.name}
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading="Repositories">
            {listRepositories().map((r) => (
              <CommandItem key={r.id} value={`repository ${r.name}`} onSelect={() => go(`/repositories/${r.id}`)}>
                Open repository — {r.name}
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading="Switch workspace">
            {listWorkspaces().map((w) => (
              <CommandItem
                key={w.id}
                value={`workspace ${w.name}`}
                onSelect={() => {
                  setWorkspaceId(w.id as WorkspaceKey);
                  go(w.route);
                }}
              >
                Switch to {w.name}
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Actions (confirmation required)">
            <CommandItem
              onSelect={() =>
                confirm({
                  title: "Resume current work",
                  description:
                    "Open Elev8 AI Creator Studio at stage AI-5 (Completion and Validation) on branch release/pre-alpha.",
                  confirmLabel: "Resume",
                  run: () => navigate({ to: "/products/elev8-ai-creator-studio" }),
                })
              }
            >
              Resume current work
            </CommandItem>
            <CommandItem
              onSelect={() =>
                confirm({
                  title: "Record checkpoint",
                  description:
                    "Recording a checkpoint writes an audit entry against the active stage. This foundation build does not persist records.",
                  confirmLabel: "Record checkpoint",
                  run: () => toast.info("Checkpoint capture is not persisted in this foundation build."),
                })
              }
            >
              Record checkpoint
            </CommandItem>
            <CommandItem
              onSelect={() =>
                confirm({
                  title: "Create decision record",
                  description: "Opens a new architecture or business decision record in the decision register.",
                  confirmLabel: "Create draft",
                  run: () => navigate({ to: "/decisions" }),
                })
              }
            >
              Create decision
            </CommandItem>
            <CommandItem
              onSelect={() =>
                confirm({
                  title: "Register infrastructure asset",
                  description: "Adds a new asset to the infrastructure registry. Not persisted in this build.",
                  confirmLabel: "Open registry",
                  run: () => navigate({ to: "/assets" }),
                })
              }
            >
              Register asset
            </CommandItem>
            <CommandItem
              onSelect={() =>
                confirm({
                  title: "Create task",
                  description: "Creates a task in the active workspace. Not persisted in this build.",
                  confirmLabel: "Open work queue",
                  run: () => navigate({ to: "/engineering" }),
                })
              }
            >
              Create task
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setPaletteOpen(false);
                setIntelOpen(true);
              }}
            >
              Ask Elev8 Intelligence
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      <AlertDialog open={pending !== null} onOpenChange={(open) => !open && setPending(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{pending?.title}</AlertDialogTitle>
            <AlertDialogDescription>{pending?.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                pending?.run();
                setPending(null);
              }}
            >
              {pending?.confirmLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}