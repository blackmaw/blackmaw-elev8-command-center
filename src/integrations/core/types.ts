export type IntegrationCategory =
  | "source-control"
  | "cloud"
  | "database"
  | "infrastructure"
  | "storage"
  | "ai"
  | "observability"
  | "identity";

export type IntegrationStatus = "connected" | "degraded" | "disconnected" | "error" | "unknown";

export interface IntegrationCapability {
  id: string;
  name: string;
  description?: string;
  readOnly?: boolean;
}

export interface IntegrationHealth {
  status: IntegrationStatus;
  checkedAt: string;
  message?: string;
  latencyMs?: number;
  metadata?: Record<string, unknown>;
}

export interface IntegrationContext {
  requestId?: string;
  actorId?: string;
  signal?: AbortSignal;
}

export interface IntegrationPlugin {
  readonly id: string;
  readonly name: string;
  readonly version: string;
  readonly category: IntegrationCategory;
  readonly capabilities: readonly IntegrationCapability[];

  healthCheck(context?: IntegrationContext): Promise<IntegrationHealth>;
}
