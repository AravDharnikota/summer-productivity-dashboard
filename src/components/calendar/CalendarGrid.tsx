import { isOffDay, getHackathon } from '../../lib/dates'
import { START_DATE, END_DATE } from '../../lib/constants'

interface Props {
  year: number
  month: number   // 0-indexed (0=Jan, 4=May, 5=Jun, etc.)
}

function pad2(n: number) { return String(n).padStart(2, '0') }

export default function CalendarGrid({ year, month }: Props) {
  const firstDow = new Date(year, month, 1).getDay()       // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const monthName = new Date(year, month, 1).toLocaleString('en-US', { month: 'long', year: 'numeric' })

  // Build flat array: nulls for leading empty days, then day numbers
  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  // Pad to complete the last row
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <>
      <div className="cal-month-label">{monthName}</div>
      <div className="cal-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="cal-head">{d}</div>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <div key={i} className="cal-cell empty" />

          const dateStr = `${year}-${pad2(month + 1)}-${pad2(day)}`
          const inRange = dateStr >= START_DATE && dateStr <= END_DATE
          const isStart = dateStr === START_DATE
          const isEnd = dateStr === END_DATE
          const off = inRange && isOffDay(dateStr)
          const hack = inRange ? getHackathon(dateStr) : null

          let cls = 'cal-cell'
          if (isStart) cls += ' start'
          else if (isEnd) cls += ' end'
          else if (hack) cls += ' hack'
          else if (off) cls += ' off'
          else if (!inRange) cls += ' outside'

          return (
            <div key={i} className={cls}>
              <div className="cal-num">{day}</div>
              {isStart && <div className="cal-tag">Day 1 🚀</div>}
              {isEnd   && <div className="cal-tag">Day 77 🏁</div>}
              {off && !isStart && !isEnd && <div className="cal-tag">OFF</div>}
              {hack && <div className="cal-tag">{hack}</div>}
            </div>
          )
        })}
      </div>
    </>
  )
}
