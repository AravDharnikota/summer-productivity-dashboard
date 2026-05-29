import { describe, it, expect } from 'vitest'
import { getStreak, getSummerProgress, getHabitCompletionRate } from '../stats'
import type { DayLog } from '../../types'

const allDone: DayLog['habits'] = {
  prayer: true, meditation: true, coldShower: true, amSkincare: true,
  noSugar: true, journal: true, pmSkincare: true, sleep10pm: true,
}
const noneDone: DayLog['habits'] = {
  prayer: false, meditation: false, coldShower: false, amSkincare: false,
  noSugar: false, journal: false, pmSkincare: false, sleep10pm: false,
}

function makeLog(date: string, habits: DayLog['habits']): DayLog {
  return {
    date, habits,
    mission: [], buildTasks: [],
    workoutLogged: false, workoutNotes: '',
    journalEntry: '', proteinTarget: false,
    readingPages: 0, bibleChapter: false, speakingVideo: false,
  }
}

describe('getStreak', () => {
  it('returns 0 when no logs', () => {
    expect(getStreak({}, '2026-05-30')).toBe(0)
  })
  it('returns 1 for one perfect day', () => {
    const logs = { '2026-05-30': makeLog('2026-05-30', allDone) }
    expect(getStreak(logs, '2026-05-30')).toBe(1)
  })
  it('returns 0 if today habits not all done', () => {
    const logs = { '2026-05-30': makeLog('2026-05-30', noneDone) }
    expect(getStreak(logs, '2026-05-30')).toBe(0)
  })
  it('returns 3 for three consecutive perfect days', () => {
    const logs = {
      '2026-05-30': makeLog('2026-05-30', allDone),
      '2026-05-31': makeLog('2026-05-31', allDone),
      '2026-06-01': makeLog('2026-06-01', allDone),
    }
    expect(getStreak(logs, '2026-06-01')).toBe(3)
  })
})

describe('getSummerProgress', () => {
  it('returns 0 for day before start', () => {
    expect(getSummerProgress('2026-05-29')).toBe(0)
  })
  it('returns ~1.3% for day 1', () => {
    expect(getSummerProgress('2026-05-30')).toBeCloseTo(1.3, 0)
  })
  it('returns 100 for the end date', () => {
    expect(getSummerProgress('2026-08-14')).toBe(100)
  })
})

describe('getHabitCompletionRate', () => {
  it('returns 1 for all habits done', () => {
    expect(getHabitCompletionRate(allDone)).toBe(1)
  })
  it('returns 0 for no habits done', () => {
    expect(getHabitCompletionRate(noneDone)).toBe(0)
  })
  it('returns 0.5 for 4 of 8', () => {
    const half = { ...noneDone, prayer: true, meditation: true, coldShower: true, amSkincare: true }
    expect(getHabitCompletionRate(half)).toBe(0.5)
  })
})
