import { todayString, getGymType, isSunday } from '../../lib/dates'

interface Block { time: string; label: string; type: 'build' | 'study' | 'routine' | 'gym' | 'break' }

function getSchedule(date: string): Block[] {
  const gym = getGymType(date)
  const gymLabel = gym === 'GYM' ? 'Gym — Push/Pull/Legs' : gym === 'CARDIO' ? 'Cardio — Run / Bike' : 'Rest Day'
  const sunday = isSunday(date)

  const blocks: Block[] = [
    { time: '6:00 am',  label: 'Morning Protocol — prayer · meditation · cold shower · skincare', type: 'routine' },
    { time: '7:00 am',  label: 'AP Calculus AB — 1 hour', type: 'study' },
    { time: '8:00 am',  label: 'AP Physics 1 — 1 hour',   type: 'study' },
    { time: '9:00 am',  label: 'Spanish 3 — 1 hour',      type: 'study' },
    { time: '10:00 am', label: 'Build — AI Teacher · Block 1 of 6', type: 'build' },
    { time: '11:00 am', label: 'Build — AI Teacher · Block 2 of 6', type: 'build' },
    { time: '12:00 pm', label: '— Lunch / Break —',        type: 'break' },
    { time: '1:00 pm',  label: 'Build — AI Teacher · Block 3 of 6', type: 'build' },
    { time: '2:00 pm',  label: 'Build — AI Teacher · Block 4 of 6', type: 'build' },
    { time: '3:00 pm',  label: 'Build — AI Teacher · Block 5 of 6', type: 'build' },
    { time: '4:00 pm',  label: 'Build — AI Teacher · Block 6 of 6', type: 'build' },
    { time: '5:00 pm',  label: gymLabel, type: gym === 'REST' ? 'break' : 'gym' },
    { time: '6:30 pm',  label: '— Dinner / Rest —',        type: 'break' },
  ]

  if (sunday) {
    blocks.push({ time: '5:30 pm', label: 'Young Longs Class — 5:30–6:15pm · 2–3h hw', type: 'study' })
  }

  blocks.push(
    { time: '8:00 pm',  label: 'Evening Protocol — journal · reading · Bible · skincare', type: 'routine' },
    { time: '10:00 pm', label: 'Sleep',                    type: 'routine' },
  )

  return blocks
}

export default function ScheduleCard() {
  const today = todayString()
  const schedule = getSchedule(today)
  const dateLabel = new Date(today + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  return (
    <div className="card">
      <div className="card-title">Today's Schedule</div>
      <div className="card-sub">{dateLabel}</div>
      {schedule.map((block, i) => (
        <div key={i} className="sched-item">
          <div className="sched-time">{block.time}</div>
          <div className={`sched-block ${block.type}`}>{block.label}</div>
        </div>
      ))}
    </div>
  )
}
