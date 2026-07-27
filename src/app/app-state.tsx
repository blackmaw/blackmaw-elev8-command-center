import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { currentUser } from "@/data/demo";
import { DataStoreProvider } from "./data-store";
import { getWorkspace } from "@/data/selectors";
import type { RoleKey, WorkspaceKey } from "@/domain/types";
import { can as canDo, type AuthScope } from "@/domain/roles";
import type { PermissionKey } from "@/domain/types";

/**
 * Application-level UI + session state. Session data is a development
 * preview: no authentication provider is connected.
 */

const STORAGE = {
  workspace: "ecc.workspace",
  sidebar: "ecc.sidebar.collapsed",
  boot: "ecc.boot.enabled",
  bootSeen: "ecc.boot.seen",
  recent: "ecc.search.recent",
};

interface AppState {
  workspaceId: WorkspaceKey;
  setWorkspaceId: (id: WorkspaceKey) => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  paletteOpen: boolean;
  setPaletteOpen: (v: boolean) => void;
  intelOpen: boolean;
  setIntelOpen: (v: boolean) => void;
  notificationsOpen: boolean;
  setNotificationsOpen: (v: boolean) => void;
  bootEnabled: boolean;
  setBootEnabled: (v: boolean) => void;
  recentSearches: string[];
  addRecentSearch: (q: string) => void;
  role: RoleKey;
  scope: AuthScope;
  can: (
    permission: PermissionKey,
    target?: { organization_id?: string | null; workspace_id?: string | null },
  ) => boolean;
}

const Ctx = createContext<AppState | null>(null);

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — preferences stay in memory */
  }
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [workspaceId, setWorkspaceIdState] = useState<WorkspaceKey>("command");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [intelOpen, setIntelOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [bootEnabled, setBootEnabledState] = useState(true);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Hydration-safe preference load.
  useEffect(() => {
    setWorkspaceIdState(read<WorkspaceKey>(STORAGE.workspace, "command"));
    setSidebarCollapsed(read<boolean>(STORAGE.sidebar, false));
    setBootEnabledState(read<boolean>(STORAGE.boot, true));
    setRecentSearches(read<string[]>(STORAGE.recent, []));
  }, []);

  const setWorkspaceId = useCallback((id: WorkspaceKey) => {
    setWorkspaceIdState(id);
    write(STORAGE.workspace, id);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => {
      write(STORAGE.sidebar, !prev);
      return !prev;
    });
  }, []);

  const setBootEnabled = useCallback((v: boolean) => {
    setBootEnabledState(v);
    write(STORAGE.boot, v);
  }, []);

  const addRecentSearch = useCallback((q: string) => {
    if (!q.trim()) return;
    setRecentSearches((prev) => {
      const next = [q, ...prev.filter((p) => p !== q)].slice(0, 6);
      write(STORAGE.recent, next);
      return next;
    });
  }, []);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const scope: AuthScope = useMemo(
    () => ({
      role: currentUser.role,
      organization_ids: currentUser.organization_ids,
      workspace_ids: currentUser.workspace_ids,
    }),
    [],
  );

  const value = useMemo<AppState>(
    () => ({
      workspaceId,
      setWorkspaceId,
      sidebarCollapsed,
      toggleSidebar,
      paletteOpen,
      setPaletteOpen,
      intelOpen,
      setIntelOpen,
      notificationsOpen,
      setNotificationsOpen,
      bootEnabled,
      setBootEnabled,
      recentSearches,
      addRecentSearch,
      role: currentUser.role,
      scope,
      can: (permission, target) => canDo(scope, permission, target),
    }),
    [
      workspaceId,
      setWorkspaceId,
      sidebarCollapsed,
      toggleSidebar,
      paletteOpen,
      intelOpen,
      notificationsOpen,
      bootEnabled,
      setBootEnabled,
      recentSearches,
      addRecentSearch,
      scope,
    ],
  );

  return (
    <Ctx.Provider value={value}>
      <DataStoreProvider>{children}</DataStoreProvider>
    </Ctx.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAppState must be used inside AppStateProvider");
  return ctx;
}

export function useWorkspace() {
  const { workspaceId } = useAppState();
  return getWorkspace(workspaceId);
}

export const BOOT_SEEN_KEY = STORAGE.bootSeen;
