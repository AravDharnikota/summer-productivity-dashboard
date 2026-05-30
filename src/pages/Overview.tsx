import { useApp } from '../context/AppContext'
import { todayString, getDayNumber } from '../lib/dates'
import {
  getStreak, getSummerProgress, getTotalGymSessions,
  getTotalJournalEntries, getHabitCompletionRate,
} from '../lib/stats'
import RingProgress from '../components/overview/RingProgress'
import HabitHeatmap from '../components/overview/HabitHeatmap'
import EndGoals from '../components/overview/EndGoals'

const CALC_UNITS = [
  'Limits & Continuity',
  'Differentiation: Definitions',
  'Differentiation: Composite & Inverse',
  'Contextual Applications',
  'Analytical Applications',
  'Integration & Accumulation',
  'Differential Equations',
  'Applications of Integration',
]

const PHYSICS_UNITS = [
  'Kinematics',
  'Force and Translational Dynamics',
  'Work, Energy, and Power',
  'Linear Momentum',
  'Torque and Rotational Dynamics',
  'Energy and Momentum of Rotating Systems',
  'Oscillations',
  'Fluids',
]

export default function Overview() {
  const { state, dispatch } = useApp()
  const today = todayString()
  const dayNum = getDayNumber(today) ?? 0

  const summerPct   = getSummerProgress(today)
  const streak      = getStreak(state.logs, today)
  const gymSessions = getTotalGymSessions(state.logs)
  const journalDone = getTotalJournalEntries(state.logs)

  const loggedDays = Object.values(state.logs)
  const habitPct = loggedDays.length
    ? Math.round(
        loggedDays.reduce((sum, l) => sum + getHabitCompletionRate(l.habits), 0)
        / loggedDays.length * 100
      )
    : 0

  const calcDone    = (state.calcUnits ?? []).filter(Boolean).length
  const physicsDone = (state.physicsUnits ?? []).filter(Boolean).length
  const calcPct     = Math.round((calcDone / 8) * 100)
  const physicsPct  = Math.round((physicsDone / 8) * 100)

  const gymPct     = Math.round((gymSessions / 50) * 100)
  const journalPct = Math.round((journalDone / 70) * 100)
  const streakPct  = Math.round((streak / 77) * 100)

  const rings = [
    { pct: summerPct,  label: 'Summer',    value: `${summerPct.toFixed(0)}%`,  color: '#22c55e' },
    { pct: habitPct,   label: 'Habits',    value: `${habitPct}%`,              color: '#3b82f6' },
    { pct: streakPct,  label: 'Streak',    value: `${streak}d`,                color: '#a855f7' },
    { pct: gymPct,     label: 'Gym',       value: `${gymSessions}/50`,         color: '#fb923c' },
    { pct: journalPct, label: 'Journal',   value: `${journalDone}/70`,         color: '#14b8a6' },
    { pct: calcPct,    label: 'AP Calc',   value: `${calcDone}/8`,             color: '#f59e0b' },
    { pct: physicsPct, label: 'AP Physics',value: `${physicsDone}/8`,          color: '#ec4899' },
  ]

  return (
    <div>
      {/* Rings */}
      <div className="card gap-bottom">
        <div className="card-title">Progress</div>
        <div className="card-sub">
          {dayNum ? `Day ${dayNum} of 77 · Monk Mode active` : 'Lock-In begins May 30, 2026'}
        </div>
        <div className="rings-row">
          {rings.map(r => (
            <RingProgress key={r.label} pct={r.pct} label={r.label} value={r.value} color={r.color} />
          ))}
        </div>
      </div>

      {/* AP Unit Trackers */}
      <div className="card gap-bottom unit-tracker-card">
        <div className="unit-cols">
          <div className="unit-col">
            <div className="unit-col-header">
              <span className="unit-col-title">AP Calc AB</span>
              <span className="unit-col-count" style={{ color: '#f59e0b' }}>{calcDone}/8 units</span>
            </div>
            {CALC_UNITS.map((name, i) => (
              <div
                key={i}
                className={`unit-row ${(state.calcUnits ?? [])[i] ? 'done' : ''}`}
                onClick={() => dispatch({ type: 'TOGGLE_CALC_UNIT', unit: i })}
              >
                <div className={`unit-check ${(state.calcUnits ?? [])[i] ? 'done' : ''}`}>
                  {(state.calcUnits ?? [])[i] && '✓'}
                </div>
                <span className="unit-name">Unit {i + 1} — {name}</span>
              </div>
            ))}
          </div>

          <div className="unit-divider" />

          <div className="unit-col">
            <div className="unit-col-header">
              <span className="unit-col-title">AP Physics 1</span>
              <span className="unit-col-count" style={{ color: '#ec4899' }}>{physicsDone}/8 units</span>
            </div>
            {PHYSICS_UNITS.map((name, i) => (
              <div
                key={i}
                className={`unit-row ${(state.physicsUnits ?? [])[i] ? 'done' : ''}`}
                onClick={() => dispatch({ type: 'TOGGLE_PHYSICS_UNIT', unit: i })}
              >
                <div className={`unit-check ${(state.physicsUnits ?? [])[i] ? 'done' : ''}`}>
                  {(state.physicsUnits ?? [])[i] && '✓'}
                </div>
                <span className="unit-name">Unit {i + 1} — {name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <HabitHeatmap />

      {/* End Goals */}
      <EndGoals />
    </div>
  )
}
