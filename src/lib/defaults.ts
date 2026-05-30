import type { DayLog, AppState } from '../types'
import { todayString } from './dates'

export function defaultHabits(): DayLog['habits'] {
  return {
    prayer: false, meditation: false, coldShower: false, amSkincare: false,
    noSugar: false, journal: false, pmSkincare: false, sleep10pm: false,
  }
}

export function defaultDayLog(date: string): DayLog {
  return {
    date,
    habits: defaultHabits(),
    mission: [],
    buildTasks: [],
    workoutLogged: false,
    workoutNotes: '',
    journalEntry: '',
    proteinTarget: false,
    proteinGrams: 0,
    readingPages: 0,
    bibleChapter: false,
    speakingVideo: false,
    waterBottles: 0,
    buildHours: 0,
    pushups: 0,
    checkinWorkBlocks: '',
    checkinBuilt: '',
    checkinBlockers: '',
    checkinTomorrow: '',
  }
}

export function defaultAppState(): AppState {
  return {
    today: todayString(),
    logs: {},
    weekGoals: {},
    calcUnits: Array(8).fill(false),
    physicsUnits: Array(8).fill(false),
    customSchedules: {},
    weeklyReviews: {},
  }
}
