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
