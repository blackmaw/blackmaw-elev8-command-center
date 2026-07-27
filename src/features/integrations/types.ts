export type IntegrationKind =
  | 'website'
  | 'github'
  | 'application'
  | 'api'
  | 'server'
  | 'database'
  | 'ai-engine'

export type HealthState =
  | 'healthy'
  | 'degraded'
  | 'offline'
  | 'unknown'

export interface HealthResult {
  state: HealthState
  checkedAt: string
  responseTimeMs?: number
  message?: string
}

export interface IntegrationMetric {
  key: string
  label: string
  value: string | number
  unit?: string
}

export interface IntegrationAction {
  id: string
  label: string
  description?: string
  destructive?: boolean
}

export interface Integration {
  id: string
  name: string
  kind: IntegrationKind
  description: string
  environment: 'development' | 'staging' | 'production'

  health(): Promise<HealthResult>
  metrics(): Promise<IntegrationMetric[]>
  actions(): Promise<IntegrationAction[]>
}
