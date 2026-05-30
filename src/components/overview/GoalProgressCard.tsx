import { useApp } from '../../context/AppContext'
import { todayString, getDayNumber } from '../../lib/dates'
import { TOTAL_DAYS } from '../../lib/constants'
import { getTotalGymSessions, getTotalReadingPages } from '../../lib/stats'

export default function GoalProgressCard() {
  const { state } = useApp()
  const today = todayString()
  const dayNum = (getDayNumber(today) ?? 1) - 1
  const pctTime = Math.min(100, Math.round((dayNum / TOTAL_DAYS) * 100))
  const gymSessions = getTotalGymSessions(state.logs)
  const readingPages = getTotalReadingPages(state.logs)
  const speakingVideos = Object.values(state.logs).filter(l => l.speakingVideo).length

  const goals = [
    { name: 'AI Teacher v1',                 pct: pctTime,                                     color: 'green' },
    { name: 'AP Calculus AB — Units 1–8',    pct: Math.min(100, Math.round((dayNum / 55) * 100)), color: 'blue' },
    { name: 'AP Physics 1 — Units 1–8',      pct: Math.min(100, Math.round((dayNum / 55) * 100)), color: 'blue' },
    { name: 'Spanish 3 — Conversational',    pct: Math.min(100, Math.round((dayNum / 55) * 100)), color: 'orange' },
    { name: 'Body — 50 gym sessions',         pct: Math.min(100, Math.round((gymSessions / 50) * 100)),    color: 'orange' },
    { name: 'Mind — 2 books',                 pct: Math.min(100, Math.round((readingPages / 560) * 100)),  color: 'purple' },
    { name: 'Speaking — 10 videos',           pct: Math.min(100, Math.round((speakingVideos / 10) * 100)), color: 'teal' },
  ]

  return (
    <div className="card">
      <div className="card-title">Summer Goal Progress</div>
      <div className="card-sub">All areas · as of today</div>
      {goals.map(g => (
        <div key={g.name} className="pipeline-item">
          <div style={{ minWidth: 200 }}><div className="pipeline-name">{g.name}</div></div>
          <div className="pipeline-bar-wrap">
            <div className="prog-bar">
              <div className={`prog-fill ${g.color}`} style={{ width: `${g.pct}%`, height: 5, borderRadius: 3 }} />
            </div>
          </div>
          <div className="pipeline-pct">{g.pct}%</div>
        </div>
      ))}
    </div>
  )
}
