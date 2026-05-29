import { useApp } from '../../context/AppContext'
import { todayString, getDayNumber } from '../../lib/dates'
import { getStreak, getSummerProgress, getHabitsCompletedToday } from '../../lib/stats'

export default function StatRow() {
  const { state } = useApp()
  const today = todayString()
  const streak = getStreak(state.logs, today)
  const progress = getSummerProgress(today)
  const habitsToday = getHabitsCompletedToday(state.logs[today])
  const dayNum = getDayNumber(today)

  return (
    <div className="stat-grid gap-bottom">
      <div className="stat-card">
        <div className="stat-label">Day Streak</div>
        <div className={`stat-value ${streak > 0 ? 'green' : ''}`}>{streak}</div>
        <div className="stat-delta">{streak === 0 ? '— starting today' : `${streak} day${streak !== 1 ? 's' : ''} strong`}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Summer Progress</div>
        <div className="stat-value">{progress}%</div>
        <div className="stat-delta">Day {dayNum ?? 0} of 77</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Habits Today</div>
        <div className={`stat-value ${habitsToday === 8 ? 'green' : ''}`}>
          {habitsToday}<span style={{ fontSize: 16, color: 'var(--text-dim)', fontWeight: 400 }}> / 8</span>
        </div>
        <div className="stat-delta">{habitsToday === 8 ? '✓ all done' : `${8 - habitsToday} remaining`}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Build Hours Target</div>
        <div className="stat-value green">6h</div>
        <div className="stat-delta up">↑ daily goal</div>
      </div>
    </div>
  )
}
