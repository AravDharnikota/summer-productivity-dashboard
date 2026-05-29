import { useApp } from '../../context/AppContext'
import { todayString, getGymType } from '../../lib/dates'
import { getTotalGymSessions } from '../../lib/stats'

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const GYM_WEEK  = ['REST', 'GYM', 'CARDIO', 'GYM', 'CARDIO', 'GYM', 'CARDIO'] as const

export default function FitnessCard() {
  const { state, dispatch } = useApp()
  const today = todayString()
  const log = state.logs[today]
  const gymType = getGymType(today)
  const sessions = getTotalGymSessions(state.logs)
  const pct = Math.min(100, Math.round((sessions / 50) * 100))
  const todayDow = new Date(today + 'T00:00:00').getDay()

  const gymLabel =
    gymType === 'GYM' ? 'GYM — Push/Pull/Legs' :
    gymType === 'CARDIO' ? 'Cardio — Run / Bike' : 'Rest Day'

  return (
    <div className="card">
      <div className="card-title">Fitness</div>
      <div className="card-sub">4x gym + 3x cardio per week</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--orange)' }}>Today: {gymLabel}</div>
        <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>{sessions} / 50 sessions</div>
      </div>
      <div className="prog-bar" style={{ marginBottom: 12 }}>
        <div className="prog-fill orange" style={{ width: `${pct}%` }} />
      </div>
      <div className="week-pills">
        {WEEK_DAYS.map((day, i) => {
          const type = GYM_WEEK[i].toLowerCase()
          return (
            <span key={day} className={`week-pill ${type} ${i === todayDow ? 'current' : ''}`}>
              {day} · {GYM_WEEK[i]}
            </span>
          )
        })}
      </div>
      {gymType !== 'REST' && (
        <div style={{ marginTop: 14 }}>
          <div
            className="task-item"
            style={{ cursor: 'pointer' }}
            onClick={() => dispatch({ type: 'SET_WORKOUT', date: today, logged: !log?.workoutLogged, notes: log?.workoutNotes ?? '' })}
          >
            <div className={`cb ${log?.workoutLogged ? 'done' : ''}`}>{log?.workoutLogged ? '✓' : ''}</div>
            Log today's workout
          </div>
          <div
            className="task-item"
            style={{ cursor: 'pointer' }}
            onClick={() => dispatch({ type: 'SET_PROTEIN', date: today, done: !log?.proteinTarget })}
          >
            <div className={`cb ${log?.proteinTarget ? 'done' : ''}`}>{log?.proteinTarget ? '✓' : ''}</div>
            Hit 120g+ protein today
          </div>
        </div>
      )}
    </div>
  )
}
