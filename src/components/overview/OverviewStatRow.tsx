import { useApp } from '../../context/AppContext'
import { todayString, getDayNumber } from '../../lib/dates'
import { getStreak, getSummerProgress, getTotalGymSessions, getTotalJournalEntries } from '../../lib/stats'

export default function OverviewStatRow() {
  const { state } = useApp()
  const today = todayString()
  const streak = getStreak(state.logs, today)
  const progress = getSummerProgress(today)
  const gymSessions = getTotalGymSessions(state.logs)
  const journalEntries = getTotalJournalEntries(state.logs)

  return (
    <div className="stat-grid gap-bottom">
      <div className="stat-card">
        <div className="stat-label">Day Streak</div>
        <div className={`stat-value ${streak > 0 ? 'green' : ''}`}>{streak}</div>
        <div className="stat-delta">{streak === 0 ? '— starting today' : `${streak} day${streak !== 1 ? 's' : ''} strong`}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Summer Done</div>
        <div className="stat-value">{progress}%</div>
        <div className="stat-delta">Day {getDayNumber(today) ?? 0} of 77</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Gym Sessions</div>
        <div className={`stat-value ${gymSessions >= 50 ? 'green' : ''}`}>
          {gymSessions}<span style={{ fontSize: 16, color: 'var(--text-dim)', fontWeight: 400 }}> / 50</span>
        </div>
        <div className="stat-delta">target by Aug 14</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Journal Entries</div>
        <div className={`stat-value ${journalEntries >= 70 ? 'green' : ''}`}>
          {journalEntries}<span style={{ fontSize: 16, color: 'var(--text-dim)', fontWeight: 400 }}> / 70</span>
        </div>
        <div className="stat-delta">target by Aug 14</div>
      </div>
    </div>
  )
}
