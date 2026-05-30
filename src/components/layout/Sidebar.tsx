import { NavLink, useLocation } from 'react-router-dom'

export default function Sidebar() {
  const { pathname } = useLocation()
  const isDayRoute = pathname.startsWith('/day/')

  return (
    <nav className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">S</div>
        <div className="logo-text">Lock-In</div>
      </div>
      <div className="sidebar-nav">
        <div className="nav-section-label">Dashboards</div>
        <NavLink to="/overview" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="nav-icon">⊞</span> Overview
        </NavLink>
        <NavLink to="/" end className={({ isActive }) => 'nav-item' + (isActive || isDayRoute ? ' active' : '')}>
          <span className="nav-icon">◎</span> Today
        </NavLink>
        <NavLink to="/calendar" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="nav-icon">▦</span> Calendar
        </NavLink>
        <NavLink to="/review" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="nav-icon">◉</span> Review
        </NavLink>
      </div>
    </nav>
  )
}
