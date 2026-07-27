import { useEffect, useState } from 'react'
import { integrationRegistry } from '../registry'
import type {
  HealthResult,
  Integration,
  IntegrationMetric,
} from '../types'

interface IntegrationSnapshot {
  integration: Integration
  health: HealthResult
  metrics: IntegrationMetric[]
}

export function IntegrationHealthPanel() {
  const [snapshots, setSnapshots] = useState<IntegrationSnapshot[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadIntegrations() {
      const results = await Promise.all(
        integrationRegistry.map(async (integration) => ({
          integration,
          health: await integration.health(),
          metrics: await integration.metrics(),
        })),
      )

      if (!cancelled) {
        setSnapshots(results)
        setLoading(false)
      }
    }

    void loadIntegrations()

    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <section className="panel">
        <p className="eyebrow">Integrations</p>
        <h3>Checking connected systems…</h3>
      </section>
    )
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Integration Framework</p>
          <h3>Connected System Health</h3>
        </div>
      </div>

      <div className="integration-list">
        {snapshots.map(({ integration, health, metrics }) => (
          <article className="integration-card" key={integration.id}>
            <div className="integration-card-header">
              <div>
                <h4>{integration.name}</h4>
                <p>{integration.description}</p>
              </div>

              <span className={`status-badge ${health.state}`}>
                {health.state}
              </span>
            </div>

            <div className="integration-metrics">
              {metrics.map((metric) => (
                <div className="integration-metric" key={metric.key}>
                  <span>{metric.label}</span>
                  <strong>
                    {metric.value}
                    {metric.unit ?? ''}
                  </strong>
                </div>
              ))}
            </div>

            <div className="integration-footer">
              <span>{integration.environment}</span>
              <span>
                Checked{' '}
                {new Date(health.checkedAt).toLocaleTimeString()}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
