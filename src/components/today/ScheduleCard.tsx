import { todayString, getGymType, isSunday } from '../../lib/dates'

interface Block { time: string; label: string; type: 'build' | 'study' | 'routine' | 'gym' | 'break' }

const FLOATING_BLOCK: Record<number, string> = {
  1: 'Modern AI — lecture (1.5 hrs)',
  2: 'Modern AI — homework (1.5 hrs)',
  3: 'Modern AI — lecture (1.5 hrs)',
  4: 'Modern AI — homework (1.5 hrs)',
  5: 'YoungWonks HW (1.5 hrs)',
  6: 'YoungWonks HW (1.5 hrs)',
  0: 'Free / overflow',
}

function getSchedule(date: string): Block[] {
  const dow = new Date(date + 'T00:00:00').getDay()
  const gym = getGymType(date)
  const gymLabel = gym === 'GYM' ? 'Gym — Push/Pull/Legs' : 'Cardio — Run / Bike'
  const sunday = isSunday(date)

  if (sunday) {
    return [
      { time: '6:00',  label: 'Wake — no phone, brush teeth, AM skincare',         type: 'routine' },
      { time: '6:15',  label: 'Morning routine — prayer, meditation, journal, reading', type: 'routine' },
      { time: '7:00',  label: 'Cold shower + get ready',                            type: 'routine' },
      { time: '7:15',  label: 'Breakfast — high protein, no junk',                  type: 'break'   },
      { time: '7:45',  label: 'Deep work I — project (3 hrs)',                      type: 'build'   },
      { time: '10:45', label: 'Break — walk outside, no phone',                     type: 'break'   },
      { time: '11:00', label: 'Deep work II — project (3 hrs)',                     type: 'build'   },
      { time: '2:00',  label: 'Academic block — AP Calc → AP Physics → Spanish',    type: 'study'   },
      { time: '5:00',  label: 'Transition / light movement',                        type: 'break'   },
      { time: '5:30',  label: 'YoungWonks class (5:30–6:15)',                       type: 'study'   },
      { time: '6:15',  label: 'Dinner',                                             type: 'break'   },
      { time: '7:00',  label: gymLabel,                                             type: 'gym'     },
      { time: '8:00',  label: 'Shower',                                             type: 'routine' },
      { time: '8:45',  label: 'Night routine + journal',                            type: 'routine' },
      { time: '9:50',  label: 'Lights out',                                         type: 'routine' },
    ]
  }

  return [
    { time: '6:00',  label: 'Wake — no phone, brush teeth, AM skincare',             type: 'routine' },
    { time: '6:15',  label: 'Morning routine — prayer, meditation, journal, reading', type: 'routine' },
    { time: '7:00',  label: 'Cold shower + get ready',                               type: 'routine' },
    { time: '7:15',  label: 'Breakfast — high protein, no junk',                     type: 'break'   },
    { time: '7:45',  label: 'Deep work I — project (3 hrs)',                         type: 'build'   },
    { time: '10:45', label: 'Break — walk outside, no phone, decompress',            type: 'break'   },
    { time: '11:00', label: 'Deep work II — project (3 hrs)',                        type: 'build'   },
    { time: '2:00',  label: 'Lunch — high protein',                                  type: 'break'   },
    { time: '2:30',  label: 'Academic block — AP Calc (1hr) → AP Physics (1hr) → Spanish (1hr)', type: 'study' },
    { time: '5:30',  label: gymLabel,                                                type: 'gym'     },
    { time: '6:30',  label: 'Shower + dinner',                                       type: 'routine' },
    { time: '7:15',  label: FLOATING_BLOCK[dow],                                     type: 'study'   },
    { time: '8:45',  label: 'Night routine — wind down, PM skincare',                type: 'routine' },
    { time: '9:30',  label: 'Night journal — 4 check-in questions',                  type: 'routine' },
    { time: '9:50',  label: 'In bed, lights off by 10:00',                           type: 'routine' },
  ]
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
