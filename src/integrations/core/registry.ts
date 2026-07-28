import type { IntegrationPlugin } from "./types";

export class IntegrationRegistry {
  private readonly plugins = new Map<string, IntegrationPlugin>();

  register(plugin: IntegrationPlugin): void {
    if (this.plugins.has(plugin.id)) {
      throw new Error(`Integration "${plugin.id}" is already registered.`);
    }

    this.plugins.set(plugin.id, plugin);
  }

  get(pluginId: string): IntegrationPlugin | undefined {
    return this.plugins.get(pluginId);
  }

  require(pluginId: string): IntegrationPlugin {
    const plugin = this.get(pluginId);

    if (!plugin) {
      throw new Error(`Integration "${pluginId}" is not registered.`);
    }

    return plugin;
  }

  list(): IntegrationPlugin[] {
    return Array.from(this.plugins.values());
  }

  has(pluginId: string): boolean {
    return this.plugins.has(pluginId);
  }
}

export const integrationRegistry = new IntegrationRegistry();
