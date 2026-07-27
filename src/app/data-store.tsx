/**
 * CENTRALIZED DATA STORE
 * ----------------------
 * One in-memory store for the entire application. No page may keep its own
 * copy of products, repositories, infrastructure, approvals, stages,
 * snapshots, documents, or journal entries — they read this store (directly or
 * through the selector/engine helpers) so every screen updates together.
 *
 * The store is deliberately record-normalized: relationships are resolved by
 * the relationship engine at read time, never duplicated in state. Swapping the
 * demonstration source for Lovable Cloud means replacing `buildSnapshot` with a
 * server-function fetch; consumers stay unchanged.
 */
import { createContext, useContext, useMemo, type ReactNode } from "react";
import { db } from "@/data/selectors";
import { getProductGraph } from "@/services/relationships";
import { generateFounderBriefing } from "@/services/briefing";
import { getResumeContext } from "@/services/resume";
import { healthBoard, productHealth } from "@/services/health";
import { queryActivity } from "@/services/activity";
import { answer as knowledgeAnswer } from "@/services/knowledge";
import type { WorkspaceKey } from "@/domain/types";

function buildSnapshot() {
  return {
    users: db.users,
    organizations: db.organizations,
    businessUnits: db.businessUnits,
    workspaces: db.workspaces,
    products: db.products,
    projects: db.projects,
    repositories: db.repositories,
    stages: db.stages,
    stageRequirements: db.stageRequirements,
    approvals: db.approvals,
    checkpoints: db.checkpoints,
    engineeringSessions: db.engineeringSessions,
    releases: db.releases,
    snapshots: db.snapshots,
    documents: db.documents,
    documentVersions: db.documentVersions,
    assets: db.assets,
    infrastructureNodes: db.infrastructureNodes,
    infrastructureConnections: db.infrastructureConnections,
    tasks: db.tasks,
    milestones: db.milestones,
    roadmaps: db.roadmaps,
    decisions: db.decisions,
    risks: db.risks,
    notifications: db.notifications,
    activityEvents: db.activityEvents,
    builderJournal: db.builderJournal,
    aiBriefings: db.aiBriefings,
    integrations: db.integrations,
    systemSettings: db.systemSettings,
  };
}

export type DataSnapshot = ReturnType<typeof buildSnapshot>;

export interface DataStore {
  records: DataSnapshot;
  source: "demonstration";
  graph: typeof getProductGraph;
  briefing: (workspaceId?: WorkspaceKey) => ReturnType<typeof generateFounderBriefing>;
  resume: typeof getResumeContext;
  health: typeof healthBoard;
  productHealth: typeof productHealth;
  activity: typeof queryActivity;
  ask: typeof knowledgeAnswer;
}

const Ctx = createContext<DataStore | null>(null);

export function DataStoreProvider({ children }: { children: ReactNode }) {
  const value = useMemo<DataStore>(
    () => ({
      records: buildSnapshot(),
      source: "demonstration",
      graph: getProductGraph,
      briefing: (workspaceId: WorkspaceKey = "command") => generateFounderBriefing(workspaceId),
      resume: getResumeContext,
      health: healthBoard,
      productHealth,
      activity: queryActivity,
      ask: knowledgeAnswer,
    }),
    [],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDataStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useDataStore must be used inside DataStoreProvider");
  return ctx;
}

/** Convenience hooks — always read through the shared store. */
export const useRecords = () => useDataStore().records;
export const useProductGraph = (productId: string | undefined) => {
  const { graph } = useDataStore();
  return useMemo(() => graph(productId), [graph, productId]);
};
export const useFounderBriefing = (workspaceId: WorkspaceKey = "command") => {
  const { briefing } = useDataStore();
  return useMemo(() => briefing(workspaceId), [briefing, workspaceId]);
};
export const useResumeContext = () => {
  const { resume } = useDataStore();
  return useMemo(() => resume(), [resume]);
};
export const useHealthBoard = () => {
  const { health } = useDataStore();
  return useMemo(() => health(), [health]);
};
