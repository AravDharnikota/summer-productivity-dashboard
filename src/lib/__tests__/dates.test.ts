import { describe, it, expect } from 'vitest'
import {
  getDayNumber,
  isOffDay,
  getHackathon,
  getGymType,
  getWeekNumber,
} from '../dates'

describe('getDayNumber', () => {
  it('returns 1 for the start date', () => {
    expect(getDayNumber('2026-05-30')).toBe(1)
  })
  it('returns 77 for the end date', () => {
    expect(getDayNumber('2026-08-14')).toBe(77)
  })
  it('returns null for a date before start', () => {
    expect(getDayNumber('2026-05-29')).toBeNull()
  })
  it('returns null for a date after end', () => {
    expect(getDayNumber('2026-08-15')).toBeNull()
  })
  it('returns correct day for June 1', () => {
    expect(getDayNumber('2026-06-01')).toBe(3)
  })
})

describe('isOffDay', () => {
  it('returns true for Jun 6', () => {
    expect(isOffDay('2026-06-06')).toBe(true)
  })
  it('returns false for a normal day', () => {
    expect(isOffDay('2026-06-05')).toBe(false)
  })
})

describe('getHackathon', () => {
  it('returns hackathon name for Jun 19', () => {
    expect(getHackathon('2026-06-19')).toBe('SF Horizons')
  })
  it('returns null for a non-hackathon day', () => {
    expect(getHackathon('2026-06-18')).toBeNull()
  })
  it('returns Kove Hacks for Jul 25', () => {
    expect(getHackathon('2026-07-25')).toBe('Kove Hacks')
  })
})

describe('getGymType', () => {
  it('returns GYM for Monday (2026-06-01)', () => {
    expect(getGymType('2026-06-01')).toBe('GYM')
  })
  it('returns CARDIO for Tuesday (2026-06-02)', () => {
    expect(getGymType('2026-06-02')).toBe('CARDIO')
  })
  it('returns REST for Sunday (2026-06-07)', () => {
    expect(getGymType('2026-06-07')).toBe('REST')
  })
})

describe('getWeekNumber', () => {
  it('returns 1 for Day 1', () => {
    expect(getWeekNumber('2026-05-30')).toBe(1)
  })
  it('returns 1 for Day 7', () => {
    expect(getWeekNumber('2026-06-05')).toBe(1)
  })
  it('returns 2 for Day 8', () => {
    expect(getWeekNumber('2026-06-06')).toBe(2)
  })
  it('returns 11 for Day 77', () => {
    expect(getWeekNumber('2026-08-14')).toBe(11)
  })
})
