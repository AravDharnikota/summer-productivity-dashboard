import { useLocation } from 'react-router-dom'
import { todayString, getDayNumber, isOffDay, getHackathon } from '../../lib/dates'

const PAGE_TITLES: Record<string, string> = {
  '/': 'Today',
  '/overview': 'Overview',
  '/calendar': 'Calendar',
}

export default function Topbar() {
  const { pathname } = useLocation()
  const today = todayString()
  const hackathon = getHackathon(today)
  const off = isOffDay(today)
  const dayNum = getDayNumber(today)

  return (
    <div className="topbar">
      <div className="topbar-title">{PAGE_TITLES[pathname] ?? 'Dashboard'}</div>
      <div className="topbar-right">
        <div className="day-chip">
          📅 {new Date(today + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          {dayNum ? ` · Day ${dayNum}` : ''}
        </div>
        {hackathon && <div className="hack-badge">🚀 {hackathon}</div>}
        {off && !hackathon && <div className="off-badge">🌅 Off Day</div>}
        {!off && !hackathon && dayNum && <div className="monk-badge">⚡ Monk Mode</div>}
        {!dayNum && !hackathon && <div className="day-chip">🔒 Lock-In starts tomorrow</div>}
      </div>
    </div>
  )
}
