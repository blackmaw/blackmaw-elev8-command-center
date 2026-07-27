import type { ReactNode } from 'react'

interface HeadquartersLayoutProps {
  children: ReactNode
}

export function HeadquartersLayout({
  children,
}: HeadquartersLayoutProps) {
  return (
    <div className="headquarters-shell">
      <aside className="headquarters-sidebar">
        <div className="headquarters-brand">
          <span className="headquarters-mark">8</span>

          <div>
            <strong>Elev8</strong>
            <span>Command Center</span>
          </div>
        </div>

        <nav className="headquarters-navigation">
          <button type="button" className="active">
            Executive
          </button>
          <button type="button">Products</button>
          <button type="button">Repositories</button>
          <button type="button">Integrations</button>
          <button type="button">Monitoring</button>
          <button type="button">Documentation</button>
          <button type="button">Operations</button>
          <button type="button">AI</button>
          <button type="button">Security</button>
          <button type="button">Settings</button>
        </nav>

        <div className="headquarters-system-state">
          <span />
          <div>
            <strong>Foundation online</strong>
            <p>Local control plane</p>
          </div>
        </div>
      </aside>

      <main className="headquarters-main">
        <header className="headquarters-topbar">
          <div>
            <p>Bell Cap Group LLC</p>
            <h1>Executive Headquarters</h1>
          </div>

          <span className="headquarters-phase">Phase 0</span>
        </header>

        <div className="headquarters-content">{children}</div>
      </main>
    </div>
  )
}