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
    readingPages: 0,
    bibleChapter: false,
    speakingVideo: false,
  }
}

export function defaultAppState(): AppState {
  return {
    today: todayString(),
    logs: {},
    weekGoals: {},
  }
}
