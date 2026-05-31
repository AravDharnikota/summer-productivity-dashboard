import React from 'react'
import { useApp } from '../../context/AppContext'
import { todayString, getDatesInRange } from '../../lib/dates'
import { START_DATE, END_DATE, HABITS } from '../../lib/constants'

const ALL_DAYS = getDatesInRange(START_DATE, END_DATE) // 77 dates

function cellStyle(done: boolean | undefined, isFuture: boolean): React.CSSProperties {
  if (isFuture)       return { background: '#0f0f0f', border: '1px dashed #1c1c1c' }
  if (done === true)  return { background: '#16a34a' }
  if (done === false) return { background: '#7f1d1d' }
  return { background: '#1a1a1a' }
}

export default function HabitHeatmap() {
  const { state } = useApp()
  const today = todayString()

  // Week labels: day 1, 8, 15, 22, 29, 36, 43, 50, 57, 64, 71
  const weekLabels = ALL_DAYS.map((_, i) => (i % 7 === 0 ? String(i + 1) : ''))

  return (
    <div className="card gap-bottom">
      <div className="card-title">77-Day Habit Heatmap</div>
      <div className="card-sub">Every day of the lock-in · rows = habits · columns = days 1–77</div>

      <div className="hm-scroll">
        <div className="hm-table">
          {/* Day number header */}
          <div className="hm-row hm-header-row">
            <div className="hm-habit-label" />
            {ALL_DAYS.map((_, i) => (
              <div key={i} className="hm-cell hm-day-num">
                {weekLabels[i] || ''}
              </div>
            ))}
          </div>

          {/* One row per habit */}
          {HABITS.map(habit => (
            <div key={habit.id} className="hm-row">
              <div className="hm-habit-label">{habit.label.split('(')[0].trim()}</div>
              {ALL_DAYS.map(dateStr => {
                const isFuture = dateStr > today
                const log = state.logs[dateStr]
                const done = log?.habits[habit.id as keyof typeof log.habits]
                return (
                  <div
                    key={dateStr}
                    className="hm-cell"
                    style={cellStyle(done, isFuture)}
                    title={`${habit.label} · ${dateStr}`}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="hm-legend">
        <span><span className="hm-swatch" style={{ background: '#16a34a' }} /> Done</span>
        <span><span className="hm-swatch" style={{ background: '#7f1d1d' }} /> Missed</span>
        <span><span className="hm-swatch" style={{ background: '#1a1a1a' }} /> Not logged</span>
        <span><span className="hm-swatch" style={{ background: '#0f0f0f', border: '1px dashed #1c1c1c' }} /> Future</span>
      </div>
    </div>
  )
}
