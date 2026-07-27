import type { ReactNode } from 'react'
import { Sidebar } from '../components/Sidebar'

interface HeadquartersLayoutProps {
  children: ReactNode
}

export function HeadquartersLayout({
  children,
}: HeadquartersLayoutProps) {
  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">Bell Cap Group LLC</p>
            <h1>Executive Headquarters</h1>
          </div>

          <div className="topbar-actions">
            <span className="environment-badge">Foundation</span>
            <button type="button" className="founder-button">
              Founder Control
            </button>
          </div>
        </header>

        {children}
      </main>
    </div>
  )
}
