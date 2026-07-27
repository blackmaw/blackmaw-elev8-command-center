const navigation = [
  'Executive',
  'Products',
  'Repositories',
  'Engineering',
  'Documentation',
  'AI Operations',
  'Roadmap',
  'Settings',
]

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">8</div>

        <div>
          <p className="brand-title">Elev8</p>
          <p className="brand-subtitle">Command Center</p>
        </div>
      </div>

      <nav className="navigation" aria-label="Primary navigation">
        {navigation.map((item, index) => (
          <button
            className={`nav-item ${index === 0 ? 'nav-item-active' : ''}`}
            key={item}
            type="button"
          >
            <span className="nav-index">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span>{item}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span className="system-dot" />
        <div>
          <p>Systems operational</p>
          <span>Headquarters Foundation</span>
        </div>
      </div>
    </aside>
  )
}
