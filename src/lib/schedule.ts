import { getGymType, isSunday } from './dates'
import type { ScheduleBlock } from '../types'

const FLOATING: Record<number, string> = {
  1: 'Online Course — lecture (1.5 hrs)',
  2: 'Online Course — assignment (1.5 hrs)',
  3: 'Online Course — lecture (1.5 hrs)',
  4: 'Online Course — assignment (1.5 hrs)',
  5: 'Side project / overflow',
  6: 'Side project / overflow',
  0: 'Free / recovery',
}

type RawBlock = Omit<ScheduleBlock, 'id'>

export function getDefaultSchedule(date: string): ScheduleBlock[] {
  const dow = new Date(date + 'T00:00:00').getDay()
  const gym = getGymType(date)
  const gymLabel = gym === 'GYM' ? 'Gym — Strength training' : 'Cardio — Run / Bike'
  const sunday = isSunday(date)

  const raw: RawBlock[] = sunday ? [
    { startTime: '06:00', endTime: '06:15', label: 'Wake up — morning routine start',         type: 'routine' },
    { startTime: '06:15', endTime: '07:00', label: 'Morning routine — reflection, meditation', type: 'routine' },
    { startTime: '07:00', endTime: '07:15', label: 'Cold shower + get ready',                  type: 'routine' },
    { startTime: '07:15', endTime: '07:45', label: 'Breakfast — high protein',                 type: 'break'   },
    { startTime: '07:45', endTime: '10:45', label: 'Deep work I — main project (3 hrs)',       type: 'build'   },
    { startTime: '10:45', endTime: '11:00', label: 'Break — walk outside',                    type: 'break'   },
    { startTime: '11:00', endTime: '14:00', label: 'Deep work II — main project (3 hrs)',      type: 'build'   },
    { startTime: '14:00', endTime: '17:00', label: 'Study block — course 1 → course 2 → course 3', type: 'study' },
    { startTime: '17:00', endTime: '17:30', label: 'Transition / light movement',              type: 'break'   },
    { startTime: '17:30', endTime: '18:15', label: 'Weekly class / session',                   type: 'study'   },
    { startTime: '18:15', endTime: '19:00', label: 'Dinner',                                   type: 'break'   },
    { startTime: '19:00', endTime: '20:00', label: gymLabel,                                   type: 'gym'     },
    { startTime: '20:00', endTime: '20:45', label: 'Shower + wind down',                       type: 'routine' },
    { startTime: '20:45', endTime: '21:50', label: 'Evening routine + journal',                type: 'routine' },
    { startTime: '21:50', endTime: '22:00', label: 'Lights out',                               type: 'routine' },
  ] : [
    { startTime: '06:00', endTime: '06:15', label: 'Wake up — morning routine start',         type: 'routine' },
    { startTime: '06:15', endTime: '07:00', label: 'Morning routine — reflection, meditation', type: 'routine' },
    { startTime: '07:00', endTime: '07:15', label: 'Cold shower + get ready',                  type: 'routine' },
    { startTime: '07:15', endTime: '07:45', label: 'Breakfast — high protein',                 type: 'break'   },
    { startTime: '07:45', endTime: '10:45', label: 'Deep work I — main project (3 hrs)',       type: 'build'   },
    { startTime: '10:45', endTime: '11:00', label: 'Break — walk outside, decompress',         type: 'break'   },
    { startTime: '11:00', endTime: '14:00', label: 'Deep work II — main project (3 hrs)',      type: 'build'   },
    { startTime: '14:00', endTime: '14:30', label: 'Lunch — high protein',                     type: 'break'   },
    { startTime: '14:30', endTime: '17:30', label: 'Study block — course 1 (1hr) → course 2 (1hr) → course 3 (1hr)', type: 'study' },
    { startTime: '17:30', endTime: '18:30', label: gymLabel,                                   type: 'gym'     },
    { startTime: '18:30', endTime: '19:15', label: 'Shower + dinner',                          type: 'routine' },
    { startTime: '19:15', endTime: '20:45', label: FLOATING[dow],                              type: 'study'   },
    { startTime: '20:45', endTime: '21:30', label: 'Evening wind-down routine',                type: 'routine' },
    { startTime: '21:30', endTime: '21:50', label: 'Evening journal',                          type: 'routine' },
    { startTime: '21:50', endTime: '22:00', label: 'In bed, lights off by 10:00',              type: 'routine' },
  ]

  return raw.map((b, i) => ({ ...b, id: `default-${i}` }))
}

export function timeToMin(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + (m || 0)
}

export function minToHHMM(min: number): string {
  const h = Math.floor(min / 60)
  const m = min % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function minToDisplay(m: number): string {
  const h = Math.floor(m / 60)
  const min = m % 60
  const suffix = h >= 12 ? 'pm' : 'am'
  const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h
  return `${displayH}:${String(min).padStart(2, '0')}${suffix}`
}
