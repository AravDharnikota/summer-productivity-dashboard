import { useApp } from '../../context/AppContext'
import { todayString } from '../../lib/dates'
import { getLast28DaysCompletion } from '../../lib/stats'

function rateToColor(rate: number): string {
  if (rate === 0) return '#1a1a1a'
  if (rate < 0.5) return '#14532d'
  if (rate < 0.875) return '#166534'
  return '#22c55e'
}

export default function Heatmap() {
  const { state } = useApp()
  const today = todayString()
  const rates = getLast28DaysCompletion(state.logs, today)

  return (
    <div className="card gap-bottom">
      <div className="card-title">Consistency — Last 28 Days</div>
      <div className="card-sub">Daily habit completion rate</div>
      <div className="heatmap-grid">
        {rates.map((rate, i) => (
          <div
            key={i}
            className="heatmap-cell"
            style={{ background: rateToColor(rate) }}
            title={`${Math.round(rate * 100)}%`}
          />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-dim)', fontSize: 11, marginTop: 6 }}>
        <span>28 days ago</span><span>Today</span>
      </div>
    </div>
  )
}
