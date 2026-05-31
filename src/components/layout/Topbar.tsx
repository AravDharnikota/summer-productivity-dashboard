import { useLocation, useNavigate } from 'react-router-dom'
import { todayString, getDayNumber, isOffDay, getHackathon } from '../../lib/dates'

const PAGE_TITLES: Record<string, string> = {
  '/': 'Today',
  '/overview': 'Overview',
  '/calendar': 'Calendar',
  '/review': 'Weekly Review',
}

interface Props {
  onMenuClick: () => void
}

export default function Topbar({ onMenuClick }: Props) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const today = todayString()
  const hackathon = getHackathon(today)
  const off = isOffDay(today)
  const dayNum = getDayNumber(today)

  const isDayRoute = pathname.startsWith('/day/')
  const pageTitle = isDayRoute ? 'Day View' : (PAGE_TITLES[pathname] ?? 'Dashboard')

  return (
    <div className="topbar">
      <div className="topbar-left">
        <button className="hamburger-btn" onClick={onMenuClick} aria-label="Open menu">☰</button>
        <div className="topbar-title">{pageTitle}</div>
      </div>
      <div className="topbar-right">
        <div
          className="day-chip"
          style={{ cursor: 'pointer' }}
          title="Open calendar"
          onClick={() => navigate('/calendar')}
        >
          📅 {new Date(today + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          {dayNum ? ` · Day ${dayNum}` : ''}
        </div>
        {hackathon && <div className="hack-badge">🚀 {hackathon}</div>}
        {off && !hackathon && <div className="off-badge">🌅 Off Day</div>}
        {!off && !hackathon && dayNum && <div className="monk-badge">⚡ Monk Mode</div>}
        {!dayNum && !hackathon && <div className="day-chip">🔒 Lock-In starts May 31</div>}
      </div>
    </div>
  )
}
