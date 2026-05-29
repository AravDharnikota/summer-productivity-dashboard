export type HabitId =
  | 'prayer'
  | 'meditation'
  | 'coldShower'
  | 'amSkincare'
  | 'noSugar'
  | 'journal'
  | 'pmSkincare'
  | 'sleep10pm'

export interface Habit {
  id: HabitId
  label: string
  freq: string
  icon: string
}

export interface Task {
  id: string
  text: string
  done: boolean
}

export interface DayLog {
  date: string
  habits: Record<HabitId, boolean>
  mission: Task[]
  buildTasks: Task[]
  workoutLogged: boolean
  workoutNotes: string
  journalEntry: string
  proteinTarget: boolean
  readingPages: number
  bibleChapter: boolean
  speakingVideo: boolean
}

export interface WeekGoals {
  weekNumber: number
  build: { summer: string; week: string; today: string }
  academics: { summer: string; week: string; today: string }
  personal: { summer: string; week: string; today: string }
}

export interface Hackathon {
  name: string
  dates: string[]
}

export type GymType = 'GYM' | 'CARDIO' | 'REST'

export interface AppState {
  today: string
  logs: Record<string, DayLog>
  weekGoals: Record<number, WeekGoals>
}

export type AppAction =
  | { type: 'TOGGLE_HABIT'; date: string; habit: HabitId }
  | { type: 'ADD_MISSION_TASK'; date: string; text: string }
  | { type: 'TOGGLE_MISSION_TASK'; date: string; taskId: string }
  | { type: 'ADD_BUILD_TASK'; date: string; text: string }
  | { type: 'TOGGLE_BUILD_TASK'; date: string; taskId: string }
  | { type: 'SET_WORKOUT'; date: string; logged: boolean; notes: string }
  | { type: 'SET_PROTEIN'; date: string; done: boolean }
  | { type: 'SET_READING_PAGES'; date: string; pages: number }
  | { type: 'TOGGLE_BIBLE_CHAPTER'; date: string }
  | { type: 'TOGGLE_SPEAKING_VIDEO'; date: string }
  | { type: 'SET_WEEK_GOALS'; weekNumber: number; goals: WeekGoals }
