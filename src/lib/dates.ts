import { START_DATE, END_DATE, OFF_DAYS, HACKATHONS, GYM_SCHEDULE } from './constants'
import type { GymType } from '../types'

function toDate(dateStr: string): Date {
  return new Date(dateStr + 'T00:00:00')
}

export function getDayNumber(dateStr: string): number | null {
  const start = toDate(START_DATE)
  const end = toDate(END_DATE)
  const date = toDate(dateStr)
  if (date < start || date > end) return null
  const diff = Math.round((date.getTime() - start.getTime()) / 86400000)
  return diff + 1
}

export function isOffDay(dateStr: string): boolean {
  return OFF_DAYS.includes(dateStr)
}

export function getHackathon(dateStr: string): string | null {
  const h = HACKATHONS.find(h => h.dates.includes(dateStr))
  return h ? h.name : null
}

export function getGymType(dateStr: string): GymType {
  const dow = toDate(dateStr).getDay()
  return GYM_SCHEDULE[dow]
}

export function formatDate(dateStr: string): string {
  return toDate(dateStr).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
}

export function getWeekNumber(dateStr: string): number | null {
  const day = getDayNumber(dateStr)
  if (day === null) return null
  return Math.ceil(day / 7)
}

export function todayString(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function isSunday(dateStr: string): boolean {
  return toDate(dateStr).getDay() === 0
}

export function getDatesInRange(start: string, end: string): string[] {
  const dates: string[] = []
  const cur = toDate(start)
  const last = toDate(end)
  while (cur <= last) {
    dates.push(`${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, '0')}-${String(cur.getDate()).padStart(2, '0')}`)
    cur.setDate(cur.getDate() + 1)
  }
  return dates
}
