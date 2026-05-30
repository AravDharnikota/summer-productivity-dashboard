import { useParams, useNavigate } from 'react-router-dom'
import { todayString, getDayNumber, isOffDay, getHackathon } from '../lib/dates'
import { START_DATE, END_DATE } from '../lib/constants'
import Today from './Today'

function offsetDate(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + days)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function DayPage() {
  const { date = todayString() } = useParams<{ date: string }>()
  const navigate = useNavigate()

  const dayNum   = getDayNumber(date)
  const off      = isOffDay(date)
  const hackathon = getHackathon(date)
  const isToday  = date === todayString()
  const prevDate = offsetDate(date, -1)
  const nextDate = offsetDate(date, +1)
  const canPrev  = prevDate >= START_DATE
  const canNext  = nextDate <= END_DATE

  const dateLabel = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })

  return (
    <div>
      <div className="day-nav">
        <button
          className="day-nav-btn"
          onClick={() => canPrev && navigate(`/day/${prevDate}`)}
          disabled={!canPrev}
        >
          ←
        </button>

        <div className="day-nav-center">
          <div className="day-nav-date">{dateLabel}</div>
          <div className="day-nav-badges">
            {dayNum && <span className="day-nav-badge monk">Day {dayNum} / 77</span>}
            {hackathon && <span className="day-nav-badge hack">🚀 {hackathon}</span>}
            {off && !hackathon && <span className="day-nav-badge off">🌅 Off Day</span>}
            {isToday && <span className="day-nav-badge today">Today</span>}
          </div>
        </div>

        <button
          className="day-nav-btn"
          onClick={() => canNext && navigate(`/day/${nextDate}`)}
          disabled={!canNext}
        >
          →
        </button>
      </div>

      {!isToday && (
        <div className="day-nav-jump">
          <button className="day-jump-btn" onClick={() => navigate('/')}>
            ↩ Back to Today
          </button>
        </div>
      )}

      <Today date={date} />
    </div>
  )
}
