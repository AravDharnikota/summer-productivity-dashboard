import React, { createContext, useContext, useReducer, useEffect } from 'react'
import type { AppState, AppAction, DayLog } from '../types'
import { loadState, saveState } from '../lib/storage'
import { defaultAppState, defaultDayLog } from '../lib/defaults'
import { todayString } from '../lib/dates'
import { nanoid } from '../lib/nanoid'

function getOrCreateLog(state: AppState, date: string): DayLog {
  return state.logs[date] ?? defaultDayLog(date)
}

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'TOGGLE_HABIT': {
      const log = getOrCreateLog(state, action.date)
      return {
        ...state,
        logs: {
          ...state.logs,
          [action.date]: {
            ...log,
            habits: { ...log.habits, [action.habit]: !log.habits[action.habit] },
          },
        },
      }
    }
    case 'ADD_MISSION_TASK': {
      const log = getOrCreateLog(state, action.date)
      return {
        ...state,
        logs: {
          ...state.logs,
          [action.date]: {
            ...log,
            mission: [...log.mission, { id: nanoid(), text: action.text, done: false }],
          },
        },
      }
    }
    case 'TOGGLE_MISSION_TASK': {
      const log = getOrCreateLog(state, action.date)
      return {
        ...state,
        logs: {
          ...state.logs,
          [action.date]: {
            ...log,
            mission: log.mission.map(t =>
              t.id === action.taskId ? { ...t, done: !t.done } : t
            ),
          },
        },
      }
    }
    case 'ADD_BUILD_TASK': {
      const log = getOrCreateLog(state, action.date)
      return {
        ...state,
        logs: {
          ...state.logs,
          [action.date]: {
            ...log,
            buildTasks: [...log.buildTasks, { id: nanoid(), text: action.text, done: false }],
          },
        },
      }
    }
    case 'TOGGLE_BUILD_TASK': {
      const log = getOrCreateLog(state, action.date)
      return {
        ...state,
        logs: {
          ...state.logs,
          [action.date]: {
            ...log,
            buildTasks: log.buildTasks.map(t =>
              t.id === action.taskId ? { ...t, done: !t.done } : t
            ),
          },
        },
      }
    }
    case 'SET_WORKOUT': {
      const log = getOrCreateLog(state, action.date)
      return {
        ...state,
        logs: {
          ...state.logs,
          [action.date]: { ...log, workoutLogged: action.logged, workoutNotes: action.notes },
        },
      }
    }
    case 'SET_PROTEIN': {
      const log = getOrCreateLog(state, action.date)
      return {
        ...state,
        logs: { ...state.logs, [action.date]: { ...log, proteinTarget: action.done } },
      }
    }
    case 'SET_READING_PAGES': {
      const log = getOrCreateLog(state, action.date)
      return {
        ...state,
        logs: { ...state.logs, [action.date]: { ...log, readingPages: action.pages } },
      }
    }
    case 'TOGGLE_BIBLE_CHAPTER': {
      const log = getOrCreateLog(state, action.date)
      return {
        ...state,
        logs: { ...state.logs, [action.date]: { ...log, bibleChapter: !log.bibleChapter } },
      }
    }
    case 'TOGGLE_SPEAKING_VIDEO': {
      const log = getOrCreateLog(state, action.date)
      return {
        ...state,
        logs: { ...state.logs, [action.date]: { ...log, speakingVideo: !log.speakingVideo } },
      }
    }
    case 'SET_WEEK_GOALS': {
      return {
        ...state,
        weekGoals: { ...state.weekGoals, [action.weekNumber]: action.goals },
      }
    }
    case 'TOGGLE_CALC_UNIT': {
      const units = [...(state.calcUnits ?? Array(8).fill(false))]
      units[action.unit] = !units[action.unit]
      return { ...state, calcUnits: units }
    }
    case 'TOGGLE_PHYSICS_UNIT': {
      const units = [...(state.physicsUnits ?? Array(8).fill(false))]
      units[action.unit] = !units[action.unit]
      return { ...state, physicsUnits: units }
    }
    case 'SET_WATER_BOTTLES': {
      const log = getOrCreateLog(state, action.date)
      return { ...state, logs: { ...state.logs, [action.date]: { ...log, waterBottles: Math.max(0, action.count) } } }
    }
    case 'SET_BUILD_HOURS': {
      const log = getOrCreateLog(state, action.date)
      return { ...state, logs: { ...state.logs, [action.date]: { ...log, buildHours: Math.max(0, action.hours) } } }
    }
    case 'SET_PROTEIN_GRAMS': {
      const log = getOrCreateLog(state, action.date)
      return { ...state, logs: { ...state.logs, [action.date]: { ...log, proteinGrams: Math.max(0, action.grams) } } }
    }
    case 'SET_PUSHUPS': {
      const log = getOrCreateLog(state, action.date)
      return { ...state, logs: { ...state.logs, [action.date]: { ...log, pushups: Math.max(0, action.count) } } }
    }
    case 'SET_SCHEDULE': {
      const cs = { ...(state.customSchedules ?? {}), [action.date]: action.blocks }
      return { ...state, customSchedules: cs }
    }
    case 'RESET_SCHEDULE': {
      const cs = { ...(state.customSchedules ?? {}) }
      delete cs[action.date]
      return { ...state, customSchedules: cs }
    }
    case 'SET_CHECKIN': {
      const log = getOrCreateLog(state, action.date)
      const fieldMap = {
        workBlocks: 'checkinWorkBlocks',
        built:      'checkinBuilt',
        blockers:   'checkinBlockers',
        tomorrow:   'checkinTomorrow',
      } as const
      return { ...state, logs: { ...state.logs, [action.date]: { ...log, [fieldMap[action.field]]: action.value } } }
    }
    case 'SAVE_WEEKLY_REVIEW': {
      return { ...state, weeklyReviews: { ...(state.weeklyReviews ?? {}), [action.review.weekNumber]: action.review } }
    }
    default:
      return state
  }
}

interface AppContextValue {
  state: AppState
  dispatch: React.Dispatch<AppAction>
  todayLog: DayLog
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(
    reducer,
    undefined,
    () => loadState() ?? defaultAppState()
  )

  useEffect(() => {
    saveState(state)
  }, [state])

  const todayLog = state.logs[todayString()] ?? defaultDayLog(todayString())

  return (
    <AppContext.Provider value={{ state, dispatch, todayLog }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
