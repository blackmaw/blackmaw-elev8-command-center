import type {
  IntegrationCategory,
  IntegrationHealth,
  IntegrationPlugin,
  IntegrationStatus,
} from "./types";

export interface ProviderHealthSummary {
  id: string;
  name: string;
  version: string;
  category: IntegrationCategory;
  status: IntegrationStatus;
  checkedAt: string;
  message: string | null;
  latencyMs: number | null;
  capabilityCount: number;
}

export async function summarizeProviderHealth(
  plugin: IntegrationPlugin,
): Promise<ProviderHealthSummary> {
  let health: IntegrationHealth;

  try {
    health = await plugin.healthCheck({
      requestId: crypto.randomUUID(),
    });
  } catch (error) {
    return {
      id: plugin.id,
      name: plugin.name,
      version: plugin.version,
      category: plugin.category,
      status: "error",
      checkedAt: new Date().toISOString(),
      message: error instanceof Error ? error.message : "Provider health check failed.",
      latencyMs: null,
      capabilityCount: plugin.capabilities.length,
    };
  }

  return {
    id: plugin.id,
    name: plugin.name,
    version: plugin.version,
    category: plugin.category,
    status: health.status,
    checkedAt: health.checkedAt,
    message: health.message ?? null,
    latencyMs: health.latencyMs ?? null,
    capabilityCount: plugin.capabilities.length,
  };
}
