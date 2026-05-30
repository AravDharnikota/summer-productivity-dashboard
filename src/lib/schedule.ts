import { getGymType, isSunday } from './dates'
import type { ScheduleBlock } from '../types'

const FLOATING: Record<number, string> = {
  1: 'Modern AI — lecture (1.5 hrs)',
  2: 'Modern AI — homework (1.5 hrs)',
  3: 'Modern AI — lecture (1.5 hrs)',
  4: 'Modern AI — homework (1.5 hrs)',
  5: 'YoungWonks HW (1.5 hrs)',
  6: 'YoungWonks HW (1.5 hrs)',
  0: 'Free / overflow',
}

type RawBlock = Omit<ScheduleBlock, 'id'>

export function getDefaultSchedule(date: string): ScheduleBlock[] {
  const dow = new Date(date + 'T00:00:00').getDay()
  const gym = getGymType(date)
  const gymLabel = gym === 'GYM' ? 'Gym — Push/Pull/Legs' : 'Cardio — Run / Bike'
  const sunday = isSunday(date)

  const raw: RawBlock[] = sunday ? [
    { startTime: '06:00', endTime: '06:15', label: 'Wake — no phone, brush teeth, AM skincare',              type: 'routine' },
    { startTime: '06:15', endTime: '07:00', label: 'Morning routine — prayer, meditation, journal, reading', type: 'routine' },
    { startTime: '07:00', endTime: '07:15', label: 'Cold shower + get ready',                                type: 'routine' },
    { startTime: '07:15', endTime: '07:45', label: 'Breakfast — high protein, no junk',                      type: 'break'   },
    { startTime: '07:45', endTime: '10:45', label: 'Deep work I — project (3 hrs)',                          type: 'build'   },
    { startTime: '10:45', endTime: '11:00', label: 'Break — walk outside, no phone',                        type: 'break'   },
    { startTime: '11:00', endTime: '14:00', label: 'Deep work II — project (3 hrs)',                         type: 'build'   },
    { startTime: '14:00', endTime: '17:00', label: 'Academic block — AP Calc → AP Physics → Spanish',        type: 'study'   },
    { startTime: '17:00', endTime: '17:30', label: 'Transition / light movement',                            type: 'break'   },
    { startTime: '17:30', endTime: '18:15', label: 'YoungWonks class (5:30–6:15)',                           type: 'study'   },
    { startTime: '18:15', endTime: '19:00', label: 'Dinner',                                                 type: 'break'   },
    { startTime: '19:00', endTime: '20:00', label: gymLabel,                                                 type: 'gym'     },
    { startTime: '20:00', endTime: '20:45', label: 'Shower',                                                 type: 'routine' },
    { startTime: '20:45', endTime: '21:50', label: 'Night routine + journal',                                type: 'routine' },
    { startTime: '21:50', endTime: '22:00', label: 'Lights out',                                             type: 'routine' },
  ] : [
    { startTime: '06:00', endTime: '06:15', label: 'Wake — no phone, brush teeth, AM skincare',              type: 'routine' },
    { startTime: '06:15', endTime: '07:00', label: 'Morning routine — prayer, meditation, journal, reading', type: 'routine' },
    { startTime: '07:00', endTime: '07:15', label: 'Cold shower + get ready',                                type: 'routine' },
    { startTime: '07:15', endTime: '07:45', label: 'Breakfast — high protein, no junk',                      type: 'break'   },
    { startTime: '07:45', endTime: '10:45', label: 'Deep work I — project (3 hrs)',                          type: 'build'   },
    { startTime: '10:45', endTime: '11:00', label: 'Break — walk outside, no phone, decompress',             type: 'break'   },
    { startTime: '11:00', endTime: '14:00', label: 'Deep work II — project (3 hrs)',                         type: 'build'   },
    { startTime: '14:00', endTime: '14:30', label: 'Lunch — high protein',                                   type: 'break'   },
    { startTime: '14:30', endTime: '17:30', label: 'Academic block — AP Calc (1hr) → AP Physics (1hr) → Spanish (1hr)', type: 'study' },
    { startTime: '17:30', endTime: '18:30', label: gymLabel,                                                 type: 'gym'     },
    { startTime: '18:30', endTime: '19:15', label: 'Shower + dinner',                                        type: 'routine' },
    { startTime: '19:15', endTime: '20:45', label: FLOATING[dow],                                            type: 'study'   },
    { startTime: '20:45', endTime: '21:30', label: 'Night routine — wind down, PM skincare',                 type: 'routine' },
    { startTime: '21:30', endTime: '21:50', label: 'Night journal — 4 check-in questions',                   type: 'routine' },
    { startTime: '21:50', endTime: '22:00', label: 'In bed, lights off by 10:00',                            type: 'routine' },
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
