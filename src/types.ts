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

export type BlockType = 'build' | 'study' | 'routine' | 'gym' | 'break'

export interface ScheduleBlock {
  id: string
  startTime: string   // "HH:MM" 24h, e.g. "07:45"
  endTime: string     // "HH:MM" 24h, e.g. "10:45"
  label: string
  type: BlockType
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
  proteinGrams: number
  readingPages: number
  bibleChapter: boolean
  speakingVideo: boolean
  waterBottles: number
  buildHours: number
  pushups: number
  checkinWorkBlocks: string
  checkinBuilt: string
  checkinBlockers: string
  checkinTomorrow: string
}

export interface WeeklyReview {
  weekNumber: number
  habitPct: number
  built: string
  blockers: string
  monkMode: string
  rating: number       // 1–10, 0 = not set
  nextWeekFocus: string
  gutCheck: string
  savedAt: string
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
  weeklyReviews: Record<number, WeeklyReview>
  calcUnits: boolean[]
  physicsUnits: boolean[]
  customSchedules: Record<string, ScheduleBlock[]>
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
  | { type: 'TOGGLE_CALC_UNIT'; unit: number }
  | { type: 'TOGGLE_PHYSICS_UNIT'; unit: number }
  | { type: 'SET_WATER_BOTTLES'; date: string; count: number }
  | { type: 'SET_BUILD_HOURS'; date: string; hours: number }
  | { type: 'SET_PROTEIN_GRAMS'; date: string; grams: number }
  | { type: 'SET_PUSHUPS'; date: string; count: number }
  | { type: 'SET_SCHEDULE'; date: string; blocks: ScheduleBlock[] }
  | { type: 'RESET_SCHEDULE'; date: string }
  | { type: 'SET_CHECKIN'; date: string; field: 'workBlocks' | 'built' | 'blockers' | 'tomorrow'; value: string }
  | { type: 'SAVE_WEEKLY_REVIEW'; review: WeeklyReview }
