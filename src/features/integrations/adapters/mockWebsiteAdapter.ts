import type {
  HealthResult,
  Integration,
  IntegrationAction,
  IntegrationMetric,
} from '../types'

interface MockWebsiteAdapterOptions {
  id: string
  name: string
  description: string
  environment: 'development' | 'staging' | 'production'
  url: string
}

export function createMockWebsiteAdapter(
  options: MockWebsiteAdapterOptions,
): Integration {
  return {
    id: options.id,
    name: options.name,
    kind: 'website',
    description: options.description,
    environment: options.environment,

    async health(): Promise<HealthResult> {
      return {
        state: 'healthy',
        checkedAt: new Date().toISOString(),
        responseTimeMs: 42,
        message: `${options.url} responded successfully`,
      }
    },

    async metrics(): Promise<IntegrationMetric[]> {
      return [
        {
          key: 'uptime',
          label: 'Uptime',
          value: 99.98,
          unit: '%',
        },
        {
          key: 'latency',
          label: 'Latency',
          value: 42,
          unit: 'ms',
        },
        {
          key: 'ssl',
          label: 'SSL',
          value: 'Valid',
        },
      ]
    },

    async actions(): Promise<IntegrationAction[]> {
      return [
        {
          id: 'open',
          label: 'Open website',
          description: options.url,
        },
        {
          id: 'check',
          label: 'Run health check',
        },
      ]
    },
  }
}
