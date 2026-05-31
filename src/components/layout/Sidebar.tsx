import { NavLink, useLocation } from 'react-router-dom'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: Props) {
  const { pathname } = useLocation()
  const isDayRoute = pathname.startsWith('/day/')

  return (
    <>
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}
      <nav className={`sidebar${isOpen ? ' sidebar--open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">S</div>
          <div className="logo-text">Lock-In</div>
        </div>
        <div className="sidebar-nav">
          <div className="nav-section-label">Dashboards</div>
          <NavLink to="/overview" onClick={onClose} className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
            <span className="nav-icon">⊞</span> Overview
          </NavLink>
          <NavLink to="/" end onClick={onClose} className={({ isActive }) => 'nav-item' + (isActive || isDayRoute ? ' active' : '')}>
            <span className="nav-icon">◎</span> Today
          </NavLink>
          <NavLink to="/calendar" onClick={onClose} className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
            <span className="nav-icon">▦</span> Calendar
          </NavLink>
          <NavLink to="/review" onClick={onClose} className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
            <span className="nav-icon">◉</span> Review
          </NavLink>
        </div>
      </nav>
    </>
  )
}
