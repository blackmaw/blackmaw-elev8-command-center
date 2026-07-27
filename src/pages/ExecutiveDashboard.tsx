import { products, repositories } from '../data/headquarters'

function statusClass(status: string) {
  return status.toLowerCase().replaceAll(' ', '-')
}

export function ExecutiveDashboard() {
  return (
    <div className="dashboard">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Institutional Operating System</p>
          <h2>One headquarters for every Elev8 company and product.</h2>
          <p className="hero-copy">
            Strategy, engineering, governance, products, repositories,
            decisions, and operational intelligence in one command layer.
          </p>
        </div>

        <div className="hero-status">
          <span>Current mission</span>
          <strong>Headquarters Foundation</strong>
          <p>Phase 0 · Sprint 1</p>
        </div>
      </section>

      <section className="metric-grid" aria-label="Executive metrics">
        <article className="metric-card">
          <span>Products</span>
          <strong>{products.length}</strong>
          <p>Registered initiatives</p>
        </article>

        <article className="metric-card">
          <span>Repositories</span>
          <strong>{repositories.length}</strong>
          <p>Connected systems</p>
        </article>

        <article className="metric-card">
          <span>Active phase</span>
          <strong>0</strong>
          <p>Headquarters foundation</p>
        </article>

        <article className="metric-card">
          <span>System health</span>
          <strong>100%</strong>
          <p>Build and lint passing</p>
        </article>
      </section>

      <div className="dashboard-grid">
        <section className="panel products-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Portfolio</p>
              <h3>Active Products</h3>
            </div>

            <button type="button" className="text-button">
              View registry
            </button>
          </div>

          <div className="product-list">
            {products.map((product) => (
              <article className="product-card" key={product.name}>
                <div className="product-card-heading">
                  <div>
                    <h4>{product.name}</h4>
                    <p>{product.organization}</p>
                  </div>

                  <span
                    className={`status-badge ${statusClass(product.status)}`}
                  >
                    {product.status}
                  </span>
                </div>

                <p className="product-description">
                  {product.description}
                </p>

                <div className="product-footer">
                  <span>Current phase</span>
                  <strong>{product.phase}</strong>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="right-column">
          <section className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Engineering</p>
                <h3>Repository Health</h3>
              </div>
            </div>

            <div className="repository-list">
              {repositories.map((repository) => (
                <article className="repository-card" key={repository.name}>
                  <div className="repository-status-row">
                    <span className="system-dot" />
                    <span>{repository.status}</span>
                  </div>

                  <h4>{repository.name}</h4>
                  <p>{repository.description}</p>
                  <code>{repository.branch}</code>
                </article>
              ))}
            </div>
          </section>

          <section className="panel priority-panel">
            <p className="eyebrow">Founder Priority</p>
            <h3>Build Mission Control</h3>
            <p>
              Establish the executive shell, portfolio visibility, and
              institutional navigation before introducing external
              integrations.
            </p>

            <div className="progress-track">
              <div className="progress-value" />
            </div>

            <div className="progress-label">
              <span>Sprint progress</span>
              <strong>35%</strong>
            </div>
          </section>

          <section className="panel decision-panel">
            <p className="eyebrow">Latest Decision</p>
            <h3>ADR-0001</h3>
            <p>
              Command Center operates as an independent repository and does
              not absorb product source code.
            </p>
          </section>
        </aside>
      </div>
    </div>
  )
}
