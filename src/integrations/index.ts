import { integrationRegistry } from "./core";
import { githubPlugin } from "./github";

if (!integrationRegistry.has(githubPlugin.id)) {
  integrationRegistry.register(githubPlugin);
}

export * from "./core";
export * from "./github";

export { integrationRegistry };
