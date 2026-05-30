import { getDayNumber, getDatesInRange } from './dates'
import { START_DATE, END_DATE, TOTAL_DAYS } from './constants'
import type { DayLog } from '../types'

export function getWeekRange(weekNumber: number): { start: string; end: string; label: string } {
  const all = getDatesInRange(START_DATE, END_DATE)
  const s = (weekNumber - 1) * 7
  const start = all[s]
  const end = all[Math.min(s + 6, all.length - 1)]
  const fmt = (d: string) => new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return { start, end, label: `${fmt(start)} – ${fmt(end)}` }
}

export function getWeekHabitPct(logs: Record<string, DayLog>, weekNumber: number): number {
  const { start, end } = getWeekRange(weekNumber)
  const days = getDatesInRange(start, end)
  const logged = days.filter(d => logs[d])
  if (logged.length === 0) return 0
  const total = logged.reduce((s, d) => s + getHabitCompletionRate(logs[d].habits), 0)
  return Math.round((total / logged.length) * 100)
}

export function getHabitCompletionRate(habits: DayLog['habits']): number {
  const vals = Object.values(habits)
  return vals.filter(Boolean).length / vals.length
}

export function getStreak(logs: Record<string, DayLog>, today: string): number {
  let streak = 0
  let current = today
  while (true) {
    const log = logs[current]
    if (!log || getHabitCompletionRate(log.habits) < 1) break
    streak++
    const d = new Date(current + 'T00:00:00')
    d.setDate(d.getDate() - 1)
    const prev = d.toISOString().split('T')[0]
    if (prev < START_DATE) break
    current = prev
  }
  return streak
}

export function getSummerProgress(today: string): number {
  const day = getDayNumber(today)
  if (!day) return today < START_DATE ? 0 : 100
  return Math.round((day / TOTAL_DAYS) * 100 * 10) / 10
}

export function getHabitsCompletedToday(log: DayLog | undefined): number {
  if (!log) return 0
  return Object.values(log.habits).filter(Boolean).length
}

export function getTotalGymSessions(logs: Record<string, DayLog>): number {
  return Object.values(logs).filter(l => l.workoutLogged).length
}

export function getTotalJournalEntries(logs: Record<string, DayLog>): number {
  return Object.values(logs).filter(l => l.journalEntry.trim().length > 0).length
}

export function getTotalBibleChapters(logs: Record<string, DayLog>): number {
  return Object.values(logs).filter(l => l.bibleChapter).length
}

export function getTotalReadingPages(logs: Record<string, DayLog>): number {
  return Object.values(logs).reduce((sum, l) => sum + l.readingPages, 0)
}

export function getLast28DaysCompletion(
  logs: Record<string, DayLog>,
  today: string
): number[] {
  const d = new Date(today + 'T00:00:00')
  return Array.from({ length: 28 }, (_, i) => {
    const dd = new Date(d)
    dd.setDate(d.getDate() - (27 - i))
    const date = dd.toISOString().split('T')[0]
    const log = logs[date]
    return log ? getHabitCompletionRate(log.habits) : 0
  })
}
