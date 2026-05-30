import { todayString, getDayNumber, isOffDay, getHackathon } from '../../lib/dates'
import { getSummerProgress } from '../../lib/stats'

export default function MonkModeCard() {
  const today = todayString()
  const progress = getSummerProgress(today)
  const off = isOffDay(today)
  const hack = getHackathon(today)
  const dayNum = getDayNumber(today)

  const status = hack ?? (off ? 'Off Day' : `Active — Day ${dayNum ?? '—'}`)
  const statusColor = hack ? 'var(--indigo)' : off ? 'var(--red)' : 'var(--green)'

  return (
    <div className="card">
      <div className="card-title">Monk Mode</div>
      <div className="card-sub">May 30 → Aug 14 · 77 days</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: statusColor }}>{status}</div>
        <div className="monk-badge">On Track</div>
      </div>
      <div className="prog-bar" style={{ marginBottom: 6 }}>
        <div className="prog-fill green" style={{ width: `${progress}%` }} />
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>
        Off days: Jun 6, 7, 16 · Jul 11, 19
      </div>
    </div>
  )
}
