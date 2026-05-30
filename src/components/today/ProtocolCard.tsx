import { useApp } from '../../context/AppContext'
import { getGymType } from '../../lib/dates'
import { HABITS } from '../../lib/constants'
import type { HabitId } from '../../types'

export default function ProtocolCard({ date }: { date: string }) {
  const { state, dispatch } = useApp()
  const today = date
  const log = state.logs[today]
  const habits = log?.habits ?? {}
  const gymType = getGymType(today)
  const gymLabel = gymType === 'GYM' ? 'Gym — Push/Pull/Legs' : gymType === 'CARDIO' ? 'Cardio — Run / Bike' : null

  function habitStreak(habitId: HabitId): number {
    let streak = 0
    let current = today
    while (true) {
      const l = state.logs[current]
      if (!l || !l.habits[habitId]) break
      streak++
      const d = new Date(current + 'T00:00:00')
      d.setDate(d.getDate() - 1)
      current = d.toISOString().split('T')[0]
      if (current < '2026-05-30') break
    }
    return streak
  }

  return (
    <div className="card">
      <div className="card-title">Daily Protocol</div>
      <div className="card-sub">Monk Mode — all required</div>
      {HABITS.map(habit => {
        const done = habits[habit.id] ?? false
        const streak = habitStreak(habit.id)
        return (
          <div key={habit.id} className="habit-row">
            <div className="habit-left">
              <div className="habit-icon">{habit.icon}</div>
              <div>
                <div className="habit-name">{habit.label}</div>
                <div className="habit-freq">{habit.freq}</div>
              </div>
            </div>
            <div className="habit-right">
              <span className={`streak-badge ${streak > 0 ? 'active' : 'zero'}`}>{streak}d</span>
              <div
                className={`cb ${done ? 'done' : ''}`}
                onClick={() => dispatch({ type: 'TOGGLE_HABIT', date: today, habit: habit.id })}
              >
                {done ? '✓' : ''}
              </div>
            </div>
          </div>
        )
      })}
      <div className="habit-row">
        <div className="habit-left">
          <div className="habit-icon">💪</div>
          <div>
            <div className="habit-name">50 Push-ups</div>
            <div className="habit-freq">daily · log your max set</div>
          </div>
        </div>
        <div className="habit-right">
          <span className={`streak-badge ${(log?.pushups ?? 0) >= 50 ? 'active' : 'zero'}`}>
            {log?.pushups ?? 0}
          </span>
        </div>
      </div>
      {gymLabel && (
        <div className="habit-row">
          <div className="habit-left">
            <div className="habit-icon">🏋️</div>
            <div>
              <div className="habit-name">{gymLabel}</div>
              <div className="habit-freq">log session · no log = didn't happen</div>
            </div>
          </div>
          <div className="habit-right">
            <div
              className={`cb ${log?.workoutLogged ? 'done' : ''}`}
              onClick={() => dispatch({ type: 'SET_WORKOUT', date: today, logged: !log?.workoutLogged, notes: log?.workoutNotes ?? '' })}
            >
              {log?.workoutLogged ? '✓' : ''}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
