import { Boxes, Cloud, Database, Github, Server, Sparkles } from "lucide-react";

import { Label, Mono, Tag } from "@/components/primitives";
import type { GitHubHealthResponse } from "@/integrations/github";

interface ProviderHealthPanelProps {
  githubHealth: GitHubHealthResponse;
}

interface ProviderRow {
  id: string;
  name: string;
  category: string;
  status: "connected" | "degraded" | "disconnected" | "error" | "unknown";
  message: string;
  latencyMs: number | null;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
}

const STATUS_TONE: Record<ProviderRow["status"], "success" | "warning" | "critical" | "muted"> = {
  connected: "success",
  degraded: "warning",
  disconnected: "critical",
  error: "critical",
  unknown: "muted",
};

export function ProviderHealthPanel({ githubHealth }: ProviderHealthPanelProps) {
  const providers: ProviderRow[] = [
    {
      id: "github",
      name: "GitHub",
      category: "Source control",
      status: githubHealth.status,
      message: githubHealth.message ?? "Live repository intelligence",
      latencyMs: githubHealth.latencyMs,
      icon: Github,
    },
    {
      id: "docker",
      name: "Docker",
      category: "Infrastructure",
      status: "unknown",
      message: "Provider not configured",
      latencyMs: null,
      icon: Boxes,
    },
    {
      id: "postgresql",
      name: "PostgreSQL",
      category: "Database",
      status: "unknown",
      message: "Provider not configured",
      latencyMs: null,
      icon: Database,
    },
    {
      id: "cloudflare",
      name: "Cloudflare",
      category: "Cloud",
      status: "unknown",
      message: "Provider not configured",
      latencyMs: null,
      icon: Cloud,
    },
    {
      id: "kubernetes",
      name: "Kubernetes",
      category: "Infrastructure",
      status: "unknown",
      message: "Provider not configured",
      latencyMs: null,
      icon: Server,
    },
    {
      id: "ai-engine",
      name: "AI Engine",
      category: "AI",
      status: "unknown",
      message: "Provider not configured",
      latencyMs: null,
      icon: Sparkles,
    },
  ];

  const connectedCount = providers.filter((provider) => provider.status === "connected").length;

  return (
    <section className="panel-lift min-w-0 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[0.8125rem] font-semibold">Provider Health</div>
          <div className="text-[0.6875rem] text-muted-foreground">
            Live integration status across the command center
          </div>
        </div>

        <Tag tone={connectedCount > 0 ? "success" : "muted"}>
          {connectedCount}/{providers.length} connected
        </Tag>
      </div>

      <div className="mt-3 grid gap-2 border-t border-border pt-3 md:grid-cols-2 xl:grid-cols-3">
        {providers.map((provider) => {
          const Icon = provider.icon;

          return (
            <div
              key={provider.id}
              className="min-w-0 rounded-md border border-border bg-background/40 p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-2">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-md border border-border bg-muted/30">
                    <Icon className="size-3.5 text-muted-foreground" aria-hidden />
                  </div>

                  <div className="min-w-0">
                    <div className="truncate text-[0.75rem] font-medium">{provider.name}</div>
                    <div className="truncate text-[0.625rem] text-muted-foreground">
                      {provider.category}
                    </div>
                  </div>
                </div>

                <Tag tone={STATUS_TONE[provider.status]}>
                  {provider.status === "unknown"
                    ? "not configured"
                    : provider.status.replace(/_/g, " ")}
                </Tag>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3 border-t border-border pt-3">
                <div className="min-w-0">
                  <Label>Status</Label>
                  <div className="mt-0.5 truncate text-[0.75rem]">{provider.message}</div>
                </div>

                <div className="min-w-0">
                  <Label>Latency</Label>
                  <div className="mt-0.5 truncate text-[0.75rem]">
                    {provider.latencyMs !== null ? (
                      <Mono>{provider.latencyMs} ms</Mono>
                    ) : (
                      "Unavailable"
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
