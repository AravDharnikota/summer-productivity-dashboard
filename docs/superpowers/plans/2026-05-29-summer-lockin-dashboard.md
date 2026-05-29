# Summer Lock-In Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 3-page personal productivity dashboard (Today / Overview / Calendar) as a local Vite + React app with localStorage persistence tracking habits, goals, schedule, academics, and a product build across 77 days (May 30 – Aug 14, 2026).

**Architecture:** React Router v6 handles 3 pages inside a fixed sidebar + scrollable main layout. All state lives in a single AppContext backed by localStorage — no server. Pure utility functions (dates, storage, streak) are tested with Vitest; UI is verified by running the dev server.

**Tech Stack:** Vite + React 18 + TypeScript, React Router v6, Vitest + React Testing Library, plain CSS (no Tailwind)

---

## File Map

```
src/
  main.tsx                        # entry point, Router wrap
  App.tsx                         # Sidebar + Topbar + <Outlet>
  types.ts                        # ALL TypeScript interfaces/types
  lib/
    dates.ts                      # getDayNumber, isOffDay, isHackathon, getGymType, etc.
    storage.ts                    # localStorage get/set helpers
    stats.ts                      # streak, summerProgress, habitCompletionRate
  context/
    AppContext.tsx                 # global state + dispatch + localStorage sync
  pages/
    Today.tsx                     # Today page (composed of section components)
    Overview.tsx                  # Overview page
    Calendar.tsx                  # Calendar page
  components/
    layout/
      Sidebar.tsx                 # fixed left sidebar, nav items
      Topbar.tsx                  # page title, date chip, monk mode badge
    today/
      StatRow.tsx                 # 4 stat cards
      ScheduleCard.tsx            # time-blocked daily schedule
      MissionCard.tsx             # today's mission task list
      ProtocolCard.tsx            # 8 habit checkboxes
      AcademicsCard.tsx           # 3 subject progress bars
      BuildCard.tsx               # AI Teacher tasks + milestone
      GoalCascade.tsx             # 3-col summer→week→today
      FitnessCard.tsx             # workout log + weekly pattern
      MindCard.tsx                # reading + Bible + speaking + journal prompt
    overview/
      OverviewStatRow.tsx         # 4 stat cards
      GoalProgressCard.tsx        # pipeline-style progress bars
      MonkModeCard.tsx            # monk mode status + progress
      MilestonesCard.tsx          # personal milestones checklist
      Heatmap.tsx                 # 28-day habit completion grid
    calendar/
      CalendarGrid.tsx            # monthly grid, typed cells
    ui/
      ProgressBar.tsx             # reusable labeled progress bar
      StatCard.tsx                # reusable stat card
      Checkbox.tsx                # styled checkbox
  styles/
    global.css                    # CSS variables, reset, body
    layout.css                    # sidebar, topbar, main layout
    components.css                # cards, stat cards, shared components
    today.css                     # today-page-specific styles
    overview.css                  # overview-page-specific styles
    calendar.css                  # calendar-specific styles
```

---

## Task 1: Scaffold Vite + React + TypeScript project

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.tsx`

- [ ] **Step 1: Scaffold the project**

```bash
cd "/Users/arav/Summer LOCK IN Dashboard"
npm create vite@latest . -- --template react-ts
```
Choose "React" → "TypeScript" if prompted interactively. If the directory isn't empty, confirm overwrite.

- [ ] **Step 2: Install dependencies**

```bash
npm install react-router-dom
npm install -D vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 3: Configure Vitest in vite.config.ts**

Replace `vite.config.ts` with:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
  },
})
```

- [ ] **Step 4: Create test setup file**

Create `src/test-setup.ts`:
```typescript
import '@testing-library/jest-dom'
```

- [ ] **Step 5: Add test script to package.json**

In `package.json`, add to `"scripts"`:
```json
"test": "vitest",
"test:ui": "vitest --ui"
```

- [ ] **Step 6: Verify dev server starts**

```bash
npm run dev
```
Expected: Vite dev server at `http://localhost:5173` with default React page.

- [ ] **Step 7: Commit**

```bash
git init
git add .
git commit -m "feat: scaffold Vite + React + TypeScript project"
```

---

## Task 2: Types

**Files:**
- Create: `src/types.ts`
- Create: `src/lib/constants.ts`

- [ ] **Step 1: Create types.ts**

Create `src/types.ts`:
```typescript
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
  date: string                          // "YYYY-MM-DD"
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
  dates: string[]   // ["2026-06-19", "2026-06-20", "2026-06-21"]
}

export type GymType = 'GYM' | 'CARDIO' | 'REST'

export interface AppState {
  today: string                         // "YYYY-MM-DD"
  logs: Record<string, DayLog>          // keyed by date string
  weekGoals: Record<number, WeekGoals>  // keyed by week number
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
```

- [ ] **Step 2: Create constants.ts**

Create `src/lib/constants.ts`:
```typescript
import type { Habit, Hackathon } from '../types'

export const START_DATE = '2026-05-30'
export const END_DATE = '2026-08-14'
export const TOTAL_DAYS = 77

export const OFF_DAYS = [
  '2026-06-06',
  '2026-06-07',
  '2026-06-16',
  '2026-07-11',
  '2026-07-19',
]

export const HACKATHONS: Hackathon[] = [
  {
    name: 'SF Horizons',
    dates: ['2026-06-19', '2026-06-20', '2026-06-21'],
  },
  {
    name: 'Kove Hacks',
    dates: ['2026-07-24', '2026-07-25', '2026-07-26'],
  },
  {
    name: 'Horizons Toronto',
    dates: ['2026-08-07', '2026-08-08', '2026-08-09'],
  },
]

export const HABITS: Habit[] = [
  { id: 'prayer',     label: 'Prayer (10–15 min)',   freq: 'every day',            icon: '🙏' },
  { id: 'meditation', label: 'Meditation (10 min)',   freq: 'every day',            icon: '🧘' },
  { id: 'coldShower', label: 'Cold Shower',           freq: 'every day',            icon: '🚿' },
  { id: 'amSkincare', label: 'AM Skincare',           freq: 'every day',            icon: '✨' },
  { id: 'noSugar',    label: 'No Sugar / No Junk',    freq: 'every day · 120g+ protein', icon: '🥗' },
  { id: 'journal',    label: 'Journal',               freq: 'every night',          icon: '📓' },
  { id: 'pmSkincare', label: 'PM Skincare',           freq: 'every day',            icon: '🌙' },
  { id: 'sleep10pm',  label: 'Sleep by 10pm',         freq: 'every day',            icon: '😴' },
]

export const GYM_SCHEDULE: Record<number, 'GYM' | 'CARDIO' | 'REST'> = {
  0: 'REST',     // Sunday
  1: 'GYM',     // Monday
  2: 'CARDIO',  // Tuesday
  3: 'GYM',     // Wednesday
  4: 'CARDIO',  // Thursday
  5: 'GYM',     // Friday
  6: 'CARDIO',  // Saturday
}

export const JOURNAL_PROMPTS: Record<number, string> = {
  1: 'Day 1. Who are you today — and who do you commit to becoming by August 14th? Be specific.',
  7: 'Week 1 done. What did you build, learn, and discover about yourself this week?',
  14: 'Two weeks in. Are your habits becoming automatic yet? What still needs work?',
  21: 'Three weeks. Rate your discipline 1–10 and explain exactly why.',
  28: 'One month complete. Look at your Day 1 photo. What has changed — physically, mentally, spiritually?',
  35: 'Halfway to Week 10. What would the version of you from Day 1 think of who you are right now?',
  42: 'Six weeks done. Is the AI Teacher project on track to ship v1 by Aug 14? What needs to happen?',
  49: 'Seven weeks. Describe the person you are becoming in 10th grade. Make it specific and vivid.',
  56: 'Eight weeks. What are the two things you are most proud of this summer?',
  63: 'Nine weeks. Final stretch — what does a perfect last two weeks look like?',
  70: 'Day 70 of 77. Read your Day 1 entry. Who were you then, and who are you now?',
  77: 'Day 77. You made it. Write the full story of this summer. Don\'t hold back.',
}

export const DEFAULT_JOURNAL_PROMPT =
  'What did you accomplish today? What are you grateful for? What will you do better tomorrow?'
```

- [ ] **Step 3: Commit**

```bash
git add src/types.ts src/lib/constants.ts
git commit -m "feat: add TypeScript types and app constants"
```

---

## Task 3: Date and stats utilities (TDD)

**Files:**
- Create: `src/lib/dates.ts`
- Create: `src/lib/stats.ts`
- Create: `src/lib/__tests__/dates.test.ts`
- Create: `src/lib/__tests__/stats.test.ts`

- [ ] **Step 1: Write failing tests for dates.ts**

Create `src/lib/__tests__/dates.test.ts`:
```typescript
import { describe, it, expect } from 'vitest'
import {
  getDayNumber,
  isOffDay,
  getHackathon,
  getGymType,
  formatDate,
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
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test
```
Expected: All 12 tests FAIL with "Cannot find module '../dates'"

- [ ] **Step 3: Implement dates.ts**

Create `src/lib/dates.ts`:
```typescript
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
  return new Date().toISOString().split('T')[0]
}

export function isSunday(dateStr: string): boolean {
  return toDate(dateStr).getDay() === 0
}

export function getDatesInRange(start: string, end: string): string[] {
  const dates: string[] = []
  const cur = toDate(start)
  const last = toDate(end)
  while (cur <= last) {
    dates.push(cur.toISOString().split('T')[0])
    cur.setDate(cur.getDate() + 1)
  }
  return dates
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test
```
Expected: All 12 tests PASS

- [ ] **Step 5: Write failing tests for stats.ts**

Create `src/lib/__tests__/stats.test.ts`:
```typescript
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
  it('returns 0 for day 0 (before start)', () => {
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
```

- [ ] **Step 6: Run to verify they fail**

```bash
npm test
```
Expected: Stats tests FAIL with "Cannot find module '../stats'"

- [ ] **Step 7: Implement stats.ts**

Create `src/lib/stats.ts`:
```typescript
import { getDayNumber, getDatesInRange } from './dates'
import { START_DATE, TOTAL_DAYS } from './constants'
import type { DayLog, HabitId } from '../types'

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
  const dates: string[] = []
  const d = new Date(today + 'T00:00:00')
  for (let i = 27; i >= 0; i--) {
    const dd = new Date(d)
    dd.setDate(d.getDate() - i)
    dates.push(dd.toISOString().split('T')[0])
  }
  return dates.map(date => {
    const log = logs[date]
    if (!log) return 0
    return getHabitCompletionRate(log.habits)
  })
}
```

- [ ] **Step 8: Run all tests to verify they pass**

```bash
npm test
```
Expected: All tests PASS

- [ ] **Step 9: Commit**

```bash
git add src/lib/
git commit -m "feat: add date/stats utilities with tests"
```

---

## Task 4: Storage and AppContext

**Files:**
- Create: `src/lib/storage.ts`
- Create: `src/context/AppContext.tsx`
- Create: `src/lib/defaults.ts`

- [ ] **Step 1: Create storage.ts**

Create `src/lib/storage.ts`:
```typescript
import type { AppState } from '../types'

const KEY = 'lockin-dashboard-v1'

export function loadState(): AppState | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    console.error('Failed to save state to localStorage')
  }
}
```

- [ ] **Step 2: Create defaults.ts**

Create `src/lib/defaults.ts`:
```typescript
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
```

- [ ] **Step 3: Create AppContext.tsx**

Create `src/context/AppContext.tsx`:
```typescript
import React, { createContext, useContext, useReducer, useEffect } from 'react'
import type { AppState, AppAction, DayLog, HabitId } from '../types'
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
```

- [ ] **Step 4: Create nanoid helper** (avoid importing full nanoid package)

Create `src/lib/nanoid.ts`:
```typescript
export function nanoid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/storage.ts src/lib/defaults.ts src/lib/nanoid.ts src/context/AppContext.tsx
git commit -m "feat: add localStorage storage and AppContext reducer"
```

---

## Task 5: Global CSS and design tokens

**Files:**
- Create: `src/styles/global.css`
- Create: `src/styles/layout.css`
- Create: `src/styles/components.css`
- Delete: `src/index.css`, `src/App.css` (replace with our own)

- [ ] **Step 1: Create global.css**

Create `src/styles/global.css`:
```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:           #0a0a0a;
  --bg-sidebar:   #0d0d0d;
  --bg-card:      #111111;
  --bg-hover:     #161616;
  --border:       #1f1f1f;
  --border-light: #1a1a1a;
  --text:         #e8e8e8;
  --text-muted:   #555555;
  --text-dim:     #3f3f3f;
  --green:        #22c55e;
  --green-bg:     #0f1f0f;
  --green-border: #166534;
  --green-dim:    #0c1a0c;
  --blue:         #3b82f6;
  --blue-bg:      #0f172a;
  --orange:       #fb923c;
  --orange-bg:    #1c1000;
  --purple:       #a855f7;
  --teal:         #14b8a6;
  --red:          #ef4444;
  --red-bg:       #160a0a;
  --indigo:       #818cf8;
  --indigo-bg:    #0d0d2a;
  --indigo-border:#3b4fd8;
}

html, body, #root {
  height: 100%;
  background: var(--bg);
  color: var(--text);
  font-family: -apple-system, 'Inter', system-ui, sans-serif;
  font-size: 14px;
  line-height: 1.5;
}

button { cursor: pointer; border: none; background: none; font: inherit; }
input, textarea { font: inherit; }
a { color: inherit; text-decoration: none; }
```

- [ ] **Step 2: Create layout.css**

Create `src/styles/layout.css`:
```css
.app { display: flex; height: 100vh; overflow: hidden; }

/* Sidebar */
.sidebar {
  width: 220px; flex-shrink: 0;
  background: var(--bg-sidebar);
  border-right: 1px solid var(--border);
  display: flex; flex-direction: column;
  height: 100vh; overflow-y: auto;
}
.sidebar-logo {
  display: flex; align-items: center; gap: 10px;
  padding: 20px 16px 16px;
  border-bottom: 1px solid var(--border);
}
.logo-icon {
  width: 32px; height: 32px; border-radius: 8px;
  background: #16a34a;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; color: #fff; font-weight: 800;
}
.logo-text { font-size: 15px; font-weight: 700; color: #fff; }
.sidebar-nav { padding: 12px 8px; flex: 1; }
.nav-section-label {
  font-size: 10px; color: var(--text-dim);
  letter-spacing: 2px; text-transform: uppercase; font-weight: 600;
  padding: 0 8px; margin: 16px 0 6px;
}
.nav-item {
  display: flex; align-items: center; gap: 10px;
  padding: 9px 10px; border-radius: 7px;
  color: #6b6b6b; font-size: 13px; font-weight: 500;
  border-left: 2px solid transparent;
  transition: all 0.12s; margin-bottom: 2px;
}
.nav-item:hover { background: var(--bg-hover); color: #aaa; }
.nav-item.active { background: var(--green-bg); color: var(--green); border-left-color: var(--green); font-weight: 600; }
.nav-icon { font-size: 15px; width: 18px; text-align: center; }
.sidebar-bottom { padding: 12px 8px; border-top: 1px solid var(--border); }

/* Topbar */
.topbar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 24px; height: 56px;
  border-bottom: 1px solid var(--border);
  background: var(--bg); flex-shrink: 0;
}
.topbar-title { font-size: 18px; font-weight: 700; color: #fff; }
.topbar-right { display: flex; align-items: center; gap: 12px; }
.day-chip {
  background: #1a1a1a; border: 1px solid #2a2a2a;
  color: #888; padding: 5px 12px; border-radius: 6px; font-size: 12px;
}
.monk-badge {
  background: #0f2a0f; border: 1px solid var(--green-border);
  color: var(--green); padding: 5px 12px; border-radius: 6px;
  font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;
}
.hack-badge {
  background: var(--indigo-bg); border: 1px solid var(--indigo-border);
  color: var(--indigo); padding: 5px 12px; border-radius: 6px;
  font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;
}
.off-badge {
  background: var(--red-bg); border: 1px solid #2a1010;
  color: var(--red); padding: 5px 12px; border-radius: 6px;
  font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;
}

/* Main content */
.main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.content { flex: 1; overflow-y: auto; padding: 24px; }
```

- [ ] **Step 3: Create components.css**

Create `src/styles/components.css`:
```css
/* Cards */
.card {
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: 12px; padding: 20px;
}
.card-title { font-size: 15px; font-weight: 600; color: #fff; margin-bottom: 4px; }
.card-sub { font-size: 12px; color: var(--text-muted); margin-bottom: 16px; }

/* Stat cards */
.stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 16px; }
.stat-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 18px 20px; }
.stat-label { font-size: 12px; color: var(--text-muted); margin-bottom: 8px; font-weight: 500; }
.stat-value { font-size: 28px; font-weight: 800; color: #fff; letter-spacing: -1px; line-height: 1; margin-bottom: 6px; }
.stat-value.green { color: var(--green); }
.stat-delta { font-size: 12px; color: var(--text-dim); }
.stat-delta.up { color: var(--green); }

/* Progress bar */
.prog-item { margin-bottom: 14px; }
.prog-item:last-child { margin-bottom: 0; }
.prog-head { display: flex; justify-content: space-between; margin-bottom: 6px; }
.prog-name { font-size: 13px; color: #ccc; font-weight: 500; }
.prog-pct { font-size: 12px; color: var(--text-muted); }
.prog-bar { height: 6px; background: var(--border); border-radius: 3px; overflow: hidden; }
.prog-fill { height: 100%; border-radius: 3px; transition: width 0.4s ease; }
.prog-fill.green  { background: linear-gradient(90deg, #16a34a, #22c55e); }
.prog-fill.blue   { background: linear-gradient(90deg, #1d4ed8, #3b82f6); }
.prog-fill.orange { background: linear-gradient(90deg, #c2410c, #fb923c); }
.prog-fill.purple { background: linear-gradient(90deg, #7c3aed, #a855f7); }
.prog-fill.teal   { background: linear-gradient(90deg, #0f766e, #14b8a6); }
.prog-note { font-size: 11px; color: var(--text-dim); margin-top: 4px; }

/* Checkbox */
.cb {
  width: 22px; height: 22px; border-radius: 6px;
  border: 1.5px solid #2a2a2a; background: #0d0d0d;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; flex-shrink: 0; transition: all 0.1s;
}
.cb:hover { border-color: #3a3a3a; }
.cb.done { border-color: var(--green); background: var(--green-bg); color: var(--green); font-size: 12px; font-weight: 700; }

/* Habit row */
.habit-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 0; border-bottom: 1px solid var(--border-light);
}
.habit-row:last-child { border: none; }
.habit-left { display: flex; align-items: center; gap: 12px; }
.habit-icon { width: 32px; height: 32px; border-radius: 8px; background: #1a1a1a; display: flex; align-items: center; justify-content: center; font-size: 14px; }
.habit-name { font-size: 13px; color: #ccc; font-weight: 500; }
.habit-freq { font-size: 11px; color: var(--text-dim); margin-top: 1px; }
.habit-right { display: flex; align-items: center; gap: 10px; }
.streak-badge { font-size: 11px; padding: 2px 8px; border-radius: 4px; }
.streak-badge.active { color: var(--green); background: var(--green-bg); border: 1px solid var(--green-border); }
.streak-badge.zero   { color: var(--text-dim); background: #141414; border: 1px solid var(--border); }

/* Task item */
.task-item {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 8px 0; border-bottom: 1px solid var(--border-light);
  font-size: 13px; color: #888;
}
.task-item:last-child { border: none; }
.task-item.done { color: var(--text-dim); text-decoration: line-through; }

/* Add task input row */
.add-task-row { display: flex; gap: 8px; margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--border-light); }
.add-task-input {
  flex: 1; background: #0d0d0d; border: 1px solid var(--border);
  border-radius: 6px; padding: 7px 10px; color: var(--text); font-size: 13px;
  outline: none;
}
.add-task-input:focus { border-color: var(--green); }
.add-task-btn {
  background: var(--green-bg); border: 1px solid var(--green-border);
  color: var(--green); padding: 7px 14px; border-radius: 6px;
  font-size: 12px; font-weight: 600;
}
.add-task-btn:hover { background: #142a14; }

/* Schedule */
.sched-item { display: flex; align-items: center; gap: 12px; padding: 7px 0; border-bottom: 1px solid #0f0f0f; }
.sched-item:last-child { border: none; }
.sched-time { font-size: 11px; color: var(--text-dim); width: 46px; flex-shrink: 0; }
.sched-block { flex: 1; padding: 7px 12px; border-radius: 8px; font-size: 12px; font-weight: 500; }
.sched-block.build   { background: var(--green-bg); border-left: 3px solid var(--green); color: #86efac; }
.sched-block.study   { background: var(--blue-bg); border-left: 3px solid var(--blue); color: #93c5fd; }
.sched-block.routine { background: #141414; border-left: 3px solid #2a2a2a; color: var(--text-muted); }
.sched-block.gym     { background: var(--orange-bg); border-left: 3px solid var(--orange); color: #fdba74; }
.sched-block.break   { background: transparent; color: #222; font-size: 11px; }

/* Grid layouts */
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
.two-col-wide { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; margin-bottom: 16px; }
.three-col { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 16px; }
.gap-bottom { margin-bottom: 16px; }
.stack { display: flex; flex-direction: column; gap: 16px; }
```

- [ ] **Step 4: Update src/main.tsx to import styles**

Replace `src/main.tsx`:
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import App from './App'
import './styles/global.css'
import './styles/layout.css'
import './styles/components.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
)
```

- [ ] **Step 5: Commit**

```bash
git add src/styles/ src/main.tsx
git commit -m "feat: add global CSS design system"
```

---

## Task 6: App shell — Sidebar, Topbar, Router

**Files:**
- Create: `src/App.tsx`
- Create: `src/components/layout/Sidebar.tsx`
- Create: `src/components/layout/Topbar.tsx`
- Create: `src/pages/Today.tsx` (stub)
- Create: `src/pages/Overview.tsx` (stub)
- Create: `src/pages/Calendar.tsx` (stub)

- [ ] **Step 1: Create Sidebar.tsx**

Create `src/components/layout/Sidebar.tsx`:
```typescript
import { NavLink } from 'react-router-dom'

export default function Sidebar() {
  return (
    <nav className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">S</div>
        <div className="logo-text">Lock-In</div>
      </div>
      <div className="sidebar-nav">
        <div className="nav-section-label">Dashboards</div>
        <NavLink to="/overview" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="nav-icon">⊞</span> Overview
        </NavLink>
        <NavLink to="/" end className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="nav-icon">◎</span> Today
        </NavLink>
        <NavLink to="/calendar" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="nav-icon">▦</span> Calendar
        </NavLink>
        <div className="nav-section-label">Life Areas</div>
        <NavLink to="/" end className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="nav-icon">⚡</span> Build
        </NavLink>
        <NavLink to="/" end className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="nav-icon">📖</span> Academics
        </NavLink>
        <NavLink to="/" end className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="nav-icon">◈</span> Personal
        </NavLink>
      </div>
    </nav>
  )
}
```

- [ ] **Step 2: Create Topbar.tsx**

Create `src/components/layout/Topbar.tsx`:
```typescript
import { useLocation } from 'react-router-dom'
import { todayString, formatDate, getDayNumber, isOffDay, getHackathon } from '../../lib/dates'

const PAGE_TITLES: Record<string, string> = {
  '/': 'Today',
  '/overview': 'Overview',
  '/calendar': 'Calendar',
}

export default function Topbar() {
  const { pathname } = useLocation()
  const today = todayString()
  const hackathon = getHackathon(today)
  const off = isOffDay(today)
  const dayNum = getDayNumber(today)

  return (
    <div className="topbar">
      <div className="topbar-title">{PAGE_TITLES[pathname] ?? 'Dashboard'}</div>
      <div className="topbar-right">
        <div className="day-chip">
          📅 {new Date(today + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          {dayNum ? ` · Day ${dayNum}` : ''}
        </div>
        {hackathon && <div className="hack-badge">🚀 {hackathon}</div>}
        {off && !hackathon && <div className="off-badge">🌅 Off Day</div>}
        {!off && !hackathon && dayNum && <div className="monk-badge">⚡ Monk Mode</div>}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create page stubs**

Create `src/pages/Today.tsx`:
```typescript
export default function Today() {
  return <div style={{ color: '#22c55e', padding: 24 }}>Today — coming soon</div>
}
```

Create `src/pages/Overview.tsx`:
```typescript
export default function Overview() {
  return <div style={{ color: '#22c55e', padding: 24 }}>Overview — coming soon</div>
}
```

Create `src/pages/Calendar.tsx`:
```typescript
export default function Calendar() {
  return <div style={{ color: '#22c55e', padding: 24 }}>Calendar — coming soon</div>
}
```

- [ ] **Step 4: Create App.tsx**

Create `src/App.tsx`:
```typescript
import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'
import Today from './pages/Today'
import Overview from './pages/Overview'
import Calendar from './pages/Calendar'

export default function App() {
  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        <Topbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Today />} />
            <Route path="/overview" element={<Overview />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Verify in browser**

```bash
npm run dev
```
Open `http://localhost:5173` — should show sidebar + topbar + "Today — coming soon". Clicking nav items should switch pages.

- [ ] **Step 6: Commit**

```bash
git add src/
git commit -m "feat: add app shell with sidebar, topbar, and routing"
```

---

## Task 7: Today page — StatRow + Schedule

**Files:**
- Create: `src/components/today/StatRow.tsx`
- Create: `src/components/today/ScheduleCard.tsx`
- Modify: `src/pages/Today.tsx`
- Create: `src/styles/today.css`

- [ ] **Step 1: Create today.css**

Create `src/styles/today.css`:
```css
.today-page { display: flex; flex-direction: column; gap: 0; }

/* Week pills */
.week-pills { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 10px; }
.week-pill { font-size: 11px; padding: 4px 10px; border-radius: 6px; font-weight: 500; border: 1px solid; }
.week-pill.gym     { background: var(--green-bg); color: var(--green); border-color: var(--green-border); }
.week-pill.cardio  { background: var(--blue-bg);  color: var(--blue);  border-color: #1e3a5f; }
.week-pill.rest    { background: #141414; color: var(--text-dim); border-color: var(--border); }
.week-pill.current { box-shadow: 0 0 0 1px currentColor; font-weight: 700; }

/* Goal cascade */
.goal-cascade-cols { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
.gc-col-label { font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px solid var(--border-light); }
.gc-col-label.build    { color: var(--green); }
.gc-col-label.academics { color: var(--blue); }
.gc-col-label.personal  { color: var(--purple); }
.gc-block { padding: 9px 11px; border-radius: 8px; font-size: 12px; line-height: 1.5; margin-bottom: 6px; }
.gc-block.summer { background: #0a1a0a; border: 1px solid #1a3a1a; color: #555; }
.gc-block.week   { background: #0a0f1a; border: 1px solid #1a2a3a; color: #555; }
.gc-block.today  { background: #0c0c0c; border: 1px solid var(--border); color: #444; }
.gc-tier { font-size: 8px; letter-spacing: 2px; text-transform: uppercase; font-weight: 700; margin-bottom: 3px; color: var(--text-dim); }

/* Journal box */
.journal-box { background: var(--blue-bg); border: 1px solid #1e3a5f; border-radius: 8px; padding: 12px 14px; margin-top: 12px; }
.journal-box-label { font-size: 9px; color: #3b82f680; letter-spacing: 2px; text-transform: uppercase; font-weight: 600; margin-bottom: 6px; }
.journal-box-text { font-size: 12px; color: #475569; line-height: 1.6; font-style: italic; }
```

Add to `src/main.tsx` imports:
```typescript
import './styles/today.css'
```

- [ ] **Step 2: Create StatRow.tsx**

Create `src/components/today/StatRow.tsx`:
```typescript
import { useApp } from '../../context/AppContext'
import { todayString } from '../../lib/dates'
import { getStreak, getSummerProgress, getHabitsCompletedToday } from '../../lib/stats'

export default function StatRow() {
  const { state, todayLog } = useApp()
  const today = todayString()
  const streak = getStreak(state.logs, today)
  const progress = getSummerProgress(today)
  const habitsToday = getHabitsCompletedToday(state.logs[today])

  return (
    <div className="stat-grid gap-bottom">
      <div className="stat-card">
        <div className="stat-label">Day Streak</div>
        <div className={`stat-value ${streak > 0 ? 'green' : ''}`}>{streak}</div>
        <div className="stat-delta">{streak === 0 ? '— starting today' : `${streak} day${streak !== 1 ? 's' : ''} strong`}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Summer Progress</div>
        <div className="stat-value">{progress}%</div>
        <div className="stat-delta">Day {state.logs[today] ? Object.keys(state.logs).length : 1} of 77</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Habits Today</div>
        <div className={`stat-value ${habitsToday === 8 ? 'green' : ''}`}>
          {habitsToday}<span style={{ fontSize: 16, color: 'var(--text-dim)', fontWeight: 400 }}> / 8</span>
        </div>
        <div className="stat-delta">{habitsToday === 8 ? '✓ all done' : `${8 - habitsToday} remaining`}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Build Hours Target</div>
        <div className="stat-value green">6h</div>
        <div className="stat-delta up">↑ daily goal</div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create ScheduleCard.tsx**

Create `src/components/today/ScheduleCard.tsx`:
```typescript
import { todayString, getGymType, isSunday } from '../../lib/dates'

interface Block { time: string; label: string; type: 'build' | 'study' | 'routine' | 'gym' | 'break' }

function getSchedule(date: string): Block[] {
  const gym = getGymType(date)
  const gymLabel = gym === 'GYM' ? 'Gym — Push/Pull/Legs' : gym === 'CARDIO' ? 'Cardio — Run / Bike' : 'Rest'
  const sunday = isSunday(date)

  return [
    { time: '6:00 am',  label: 'Morning Protocol — prayer · meditation · cold shower · skincare', type: 'routine' },
    { time: '7:00 am',  label: 'AP Calculus AB — 1 hour', type: 'study' },
    { time: '8:00 am',  label: 'AP Physics 1 — 1 hour',   type: 'study' },
    { time: '9:00 am',  label: 'Spanish 3 — 1 hour',      type: 'study' },
    { time: '10:00 am', label: 'Build — AI Teacher · Block 1 of 6', type: 'build' },
    { time: '11:00 am', label: 'Build — AI Teacher · Block 2 of 6', type: 'build' },
    { time: '12:00 pm', label: '— Lunch / Break —',        type: 'break' },
    { time: '1:00 pm',  label: 'Build — AI Teacher · Block 3 of 6', type: 'build' },
    { time: '2:00 pm',  label: 'Build — AI Teacher · Block 4 of 6', type: 'build' },
    { time: '3:00 pm',  label: 'Build — AI Teacher · Block 5 of 6', type: 'build' },
    { time: '4:00 pm',  label: 'Build — AI Teacher · Block 6 of 6', type: 'build' },
    { time: '5:00 pm',  label: gymLabel,                   type: gym === 'REST' ? 'break' : 'gym' },
    { time: '6:30 pm',  label: '— Dinner / Rest —',        type: 'break' },
    ...(sunday ? [{ time: '5:30 pm', label: 'Young Longs Class — 5:30–6:15pm', type: 'study' as const }] : []),
    { time: '8:00 pm',  label: 'Evening Protocol — journal · reading · Bible · skincare', type: 'routine' },
    { time: '10:00 pm', label: 'Sleep',                    type: 'routine' },
  ]
}

export default function ScheduleCard() {
  const schedule = getSchedule(todayString())
  return (
    <div className="card">
      <div className="card-title">Today's Schedule</div>
      <div className="card-sub">{new Date(todayString() + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
      {schedule.map((block, i) => (
        <div key={i} className="sched-item">
          <div className="sched-time">{block.time}</div>
          <div className={`sched-block ${block.type}`}>{block.label}</div>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Update Today.tsx with StatRow + Schedule**

Replace `src/pages/Today.tsx`:
```typescript
import StatRow from '../components/today/StatRow'
import ScheduleCard from '../components/today/ScheduleCard'

export default function Today() {
  return (
    <div className="today-page">
      <StatRow />
      <div className="two-col gap-bottom">
        <ScheduleCard />
        <div className="stack">
          {/* Mission + Protocol cards — added in Task 8 */}
          <div className="card" style={{ color: 'var(--text-muted)' }}>Mission card coming…</div>
          <div className="card" style={{ color: 'var(--text-muted)' }}>Protocol card coming…</div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Verify in browser**

```bash
npm run dev
```
Open `http://localhost:5173` — should show 4 stat cards and the full schedule.

- [ ] **Step 6: Commit**

```bash
git add src/
git commit -m "feat: add Today page stat row and schedule"
```

---

## Task 8: Today page — Mission + Protocol (habits)

**Files:**
- Create: `src/components/today/MissionCard.tsx`
- Create: `src/components/today/ProtocolCard.tsx`
- Modify: `src/pages/Today.tsx`

- [ ] **Step 1: Create MissionCard.tsx**

Create `src/components/today/MissionCard.tsx`:
```typescript
import { useState, KeyboardEvent } from 'react'
import { useApp } from '../../context/AppContext'
import { todayString } from '../../lib/dates'

export default function MissionCard() {
  const { state, dispatch } = useApp()
  const today = todayString()
  const log = state.logs[today]
  const tasks = log?.mission ?? []
  const [input, setInput] = useState('')

  function addTask() {
    const text = input.trim()
    if (!text) return
    dispatch({ type: 'ADD_MISSION_TASK', date: today, text })
    setInput('')
  }

  function onKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') addTask()
  }

  return (
    <div className="card">
      <div className="card-title">Today's Mission</div>
      <div className="card-sub">Must complete today</div>
      {tasks.map(task => (
        <div key={task.id} className={`task-item ${task.done ? 'done' : ''}`}>
          <div
            className={`cb ${task.done ? 'done' : ''}`}
            onClick={() => dispatch({ type: 'TOGGLE_MISSION_TASK', date: today, taskId: task.id })}
          >
            {task.done ? '✓' : ''}
          </div>
          {task.text}
        </div>
      ))}
      {tasks.length === 0 && (
        <div style={{ color: 'var(--text-dim)', fontSize: 12, padding: '4px 0 8px' }}>No tasks yet — add your mission below</div>
      )}
      <div className="add-task-row">
        <input
          className="add-task-input"
          placeholder="Add a mission task…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKey}
        />
        <button className="add-task-btn" onClick={addTask}>+ Add</button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create ProtocolCard.tsx**

Create `src/components/today/ProtocolCard.tsx`:
```typescript
import { useApp } from '../../context/AppContext'
import { todayString } from '../../lib/dates'
import { HABITS } from '../../lib/constants'
import { getStreak } from '../../lib/stats'
import type { HabitId } from '../../types'

export default function ProtocolCard() {
  const { state, dispatch } = useApp()
  const today = todayString()
  const log = state.logs[today]
  const habits = log?.habits ?? {}

  function habitStreak(habitId: HabitId): number {
    let streak = 0
    let current = today
    while (true) {
      const l = state.logs[current]
      if (!l || !l.habits[habitId]) break
      streak++
      const d = new Date(current + 'T00:00:00')
      d.setDate(d.getDate() - 1)
      current = d.toISOString().split('T')[0]
      if (current < '2026-05-30') break
    }
    return streak
  }

  return (
    <div className="card">
      <div className="card-title">Daily Protocol</div>
      <div className="card-sub">Monk Mode — all required</div>
      {HABITS.map(habit => {
        const done = habits[habit.id] ?? false
        const streak = habitStreak(habit.id)
        return (
          <div key={habit.id} className="habit-row">
            <div className="habit-left">
              <div className="habit-icon">{habit.icon}</div>
              <div>
                <div className="habit-name">{habit.label}</div>
                <div className="habit-freq">{habit.freq}</div>
              </div>
            </div>
            <div className="habit-right">
              <span className={`streak-badge ${streak > 0 ? 'active' : 'zero'}`}>{streak}d</span>
              <div
                className={`cb ${done ? 'done' : ''}`}
                onClick={() => dispatch({ type: 'TOGGLE_HABIT', date: today, habit: habit.id })}
              >
                {done ? '✓' : ''}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 3: Update Today.tsx**

Replace `src/pages/Today.tsx`:
```typescript
import StatRow from '../components/today/StatRow'
import ScheduleCard from '../components/today/ScheduleCard'
import MissionCard from '../components/today/MissionCard'
import ProtocolCard from '../components/today/ProtocolCard'

export default function Today() {
  return (
    <div className="today-page">
      <StatRow />
      <div className="two-col gap-bottom">
        <ScheduleCard />
        <div className="stack">
          <MissionCard />
          <ProtocolCard />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Verify in browser**

```bash
npm run dev
```
Add a mission task and check it off. Toggle habits — streaks should update. Data should persist after page refresh.

- [ ] **Step 5: Commit**

```bash
git add src/
git commit -m "feat: add mission task list and habit protocol with persistence"
```

---

## Task 9: Today page — Academics + Build + Goal Cascade + Fitness + Mind

**Files:**
- Create: `src/components/today/AcademicsCard.tsx`
- Create: `src/components/today/BuildCard.tsx`
- Create: `src/components/today/GoalCascade.tsx`
- Create: `src/components/today/FitnessCard.tsx`
- Create: `src/components/today/MindCard.tsx`
- Modify: `src/pages/Today.tsx`

- [ ] **Step 1: Create AcademicsCard.tsx**

Create `src/components/today/AcademicsCard.tsx`:
```typescript
import { getDayNumber, todayString } from '../../lib/dates'
import { TOTAL_DAYS } from '../../lib/constants'

const SUBJECTS = [
  {
    name: 'AP Calculus AB',
    color: 'blue' as const,
    units: 8,
    totalDays: 55,
    defaultToday: 'Limits: An Intuitive Approach (Unit 1.1)',
  },
  {
    name: 'AP Physics 1',
    color: 'blue' as const,
    units: 8,
    totalDays: 55,
    defaultToday: 'Kinematics: Position & Velocity (Unit 1.1)',
  },
  {
    name: 'Spanish 3',
    color: 'orange' as const,
    units: 11,
    totalDays: 55,
    defaultToday: 'Vocab Set 1 · Presente de Indicativo',
  },
]

export default function AcademicsCard() {
  const today = todayString()
  const dayNum = getDayNumber(today) ?? 1

  return (
    <div className="card">
      <div className="card-title">Academics</div>
      <div className="card-sub">1 hour each · every day</div>
      {SUBJECTS.map(subject => {
        const pct = Math.min(100, Math.round(((dayNum - 1) / subject.totalDays) * 100))
        const unitsDone = Math.min(subject.units, Math.floor(((dayNum - 1) / subject.totalDays) * subject.units))
        return (
          <div key={subject.name} className="prog-item">
            <div className="prog-head">
              <div className="prog-name">{subject.name}</div>
              <div className="prog-pct">Unit {unitsDone + 1} / {subject.units}</div>
            </div>
            <div className="prog-bar">
              <div className={`prog-fill ${subject.color}`} style={{ width: `${pct}%` }} />
            </div>
            <div className="prog-note">Today → {subject.defaultToday}</div>
          </div>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 2: Create BuildCard.tsx**

Create `src/components/today/BuildCard.tsx`:
```typescript
import { useState, KeyboardEvent } from 'react'
import { useApp } from '../../context/AppContext'
import { todayString, getDayNumber } from '../../lib/dates'
import { TOTAL_DAYS } from '../../lib/constants'

export default function BuildCard() {
  const { state, dispatch } = useApp()
  const today = todayString()
  const log = state.logs[today]
  const tasks = log?.buildTasks ?? []
  const [input, setInput] = useState('')
  const dayNum = getDayNumber(today) ?? 1
  const pct = Math.round(((dayNum - 1) / TOTAL_DAYS) * 100)

  function addTask() {
    const text = input.trim()
    if (!text) return
    dispatch({ type: 'ADD_BUILD_TASK', date: today, text })
    setInput('')
  }

  function onKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') addTask()
  }

  return (
    <div className="card">
      <div className="card-title">Build — AI Teacher</div>
      <div className="card-sub">For underserved communities · ship v1 by Aug 14</div>
      <div className="prog-item">
        <div className="prog-head">
          <div className="prog-name">v1 Milestone</div>
          <div className="prog-pct" style={{ color: 'var(--green)' }}>Ship Aug 14</div>
        </div>
        <div className="prog-bar"><div className="prog-fill green" style={{ width: `${pct}%` }} /></div>
      </div>
      {tasks.map(task => (
        <div key={task.id} className={`task-item ${task.done ? 'done' : ''}`}>
          <div
            className={`cb ${task.done ? 'done' : ''}`}
            onClick={() => dispatch({ type: 'TOGGLE_BUILD_TASK', date: today, taskId: task.id })}
          >
            {task.done ? '✓' : ''}
          </div>
          {task.text}
        </div>
      ))}
      {tasks.length === 0 && (
        <div style={{ color: 'var(--text-dim)', fontSize: 12, padding: '4px 0 8px' }}>No build tasks yet</div>
      )}
      <div className="add-task-row">
        <input className="add-task-input" placeholder="Add a build task…" value={input} onChange={e => setInput(e.target.value)} onKeyDown={onKey} />
        <button className="add-task-btn" onClick={addTask}>+ Add</button>
      </div>
      <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border-light)' }}>
        <div className="task-item" style={{ color: 'rgba(251,146,60,0.35)' }}>
          <div className="cb" style={{ borderColor: '#7c2d12', opacity: 0.4 }} />
          Stretch: Demo to orphanage (India) / Sinha / Pratham
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 8 }}>
          Young Longs: Sunday 5:30pm · 2–3h hw/week
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create GoalCascade.tsx**

Create `src/components/today/GoalCascade.tsx`:
```typescript
import { useApp } from '../../context/AppContext'
import { todayString, getWeekNumber } from '../../lib/dates'

const DEFAULT_GOALS = {
  build: {
    summer: 'Ship working v1 of AI Teacher (voice + avatar)',
    week: 'Scaffold project, pick tech stack, first voice prototype',
    today: 'Repo live · API researched · first commit pushed',
  },
  academics: {
    summer: 'Calc + Physics Units 1–8 Proficient+. Spanish conversational.',
    week: 'Calc Unit 1 · Physics Unit 1 · Spanish Wk 1',
    today: '1h each subject — lock in the habit from day 1',
  },
  personal: {
    summer: 'Become unrecognizable — body, mind, spirit, discipline',
    week: 'Every habit from day 1. No exceptions. Build the streak.',
    today: 'All 8 protocol items · Day 1 photo · first journal',
  },
}

export default function GoalCascade() {
  const { state } = useApp()
  const today = todayString()
  const weekNum = getWeekNumber(today) ?? 1
  const weekGoals = state.weekGoals[weekNum]

  const cols = [
    { key: 'build',     label: 'Build',     className: 'build',     goals: weekGoals?.build     ?? DEFAULT_GOALS.build },
    { key: 'academics', label: 'Academics', className: 'academics', goals: weekGoals?.academics ?? DEFAULT_GOALS.academics },
    { key: 'personal',  label: 'Personal',  className: 'personal',  goals: weekGoals?.personal  ?? DEFAULT_GOALS.personal },
  ]

  return (
    <div className="card gap-bottom">
      <div className="card-title">Goal Cascade</div>
      <div className="card-sub">How today connects to the summer</div>
      <div className="goal-cascade-cols">
        {cols.map(col => (
          <div key={col.key}>
            <div className={`gc-col-label ${col.className}`}>{col.label}</div>
            <div className="gc-block summer">
              <div className="gc-tier">Summer</div>
              {col.goals.summer}
            </div>
            <div className="gc-block week">
              <div className="gc-tier">This Week</div>
              {col.goals.week}
            </div>
            <div className="gc-block today">
              <div className="gc-tier">Today</div>
              {col.goals.today}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create FitnessCard.tsx**

Create `src/components/today/FitnessCard.tsx`:
```typescript
import { useApp } from '../../context/AppContext'
import { todayString, getGymType } from '../../lib/dates'
import { getTotalGymSessions } from '../../lib/stats'

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const GYM_WEEK = ['REST', 'GYM', 'CARDIO', 'GYM', 'CARDIO', 'GYM', 'CARDIO']

export default function FitnessCard() {
  const { state, dispatch } = useApp()
  const today = todayString()
  const log = state.logs[today]
  const gymType = getGymType(today)
  const sessions = getTotalGymSessions(state.logs)
  const pct = Math.min(100, Math.round((sessions / 50) * 100))
  const todayDow = new Date(today + 'T00:00:00').getDay()

  return (
    <div className="card">
      <div className="card-title">Fitness</div>
      <div className="card-sub">4x gym + 3x cardio per week</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--orange)' }}>
          Today: {gymType === 'REST' ? 'Rest Day' : gymType === 'GYM' ? 'GYM — Push/Pull/Legs' : 'Cardio — Run / Bike'}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>{sessions} / 50 sessions</div>
      </div>
      <div className="prog-bar" style={{ marginBottom: 12 }}>
        <div className="prog-fill orange" style={{ width: `${pct}%` }} />
      </div>
      <div className="week-pills">
        {WEEK_DAYS.map((day, i) => {
          const type = GYM_WEEK[i].toLowerCase()
          return (
            <span key={day} className={`week-pill ${type} ${i === todayDow ? 'current' : ''}`}>
              {day} · {GYM_WEEK[i]}
            </span>
          )
        })}
      </div>
      {gymType !== 'REST' && (
        <div style={{ marginTop: 14 }}>
          <div
            className={`task-item`}
            style={{ cursor: 'pointer' }}
            onClick={() => dispatch({ type: 'SET_WORKOUT', date: today, logged: !log?.workoutLogged, notes: log?.workoutNotes ?? '' })}
          >
            <div className={`cb ${log?.workoutLogged ? 'done' : ''}`}>{log?.workoutLogged ? '✓' : ''}</div>
            Log today's workout
          </div>
          <div
            className="task-item"
            onClick={() => dispatch({ type: 'SET_PROTEIN', date: today, done: !log?.proteinTarget })}
            style={{ cursor: 'pointer' }}
          >
            <div className={`cb ${log?.proteinTarget ? 'done' : ''}`}>{log?.proteinTarget ? '✓' : ''}</div>
            Hit 120g+ protein today
          </div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 5: Create MindCard.tsx**

Create `src/components/today/MindCard.tsx`:
```typescript
import { useApp } from '../../context/AppContext'
import { todayString, getDayNumber } from '../../lib/dates'
import { getTotalBibleChapters, getTotalReadingPages } from '../../lib/stats'
import { JOURNAL_PROMPTS, DEFAULT_JOURNAL_PROMPT } from '../../lib/constants'

export default function MindCard() {
  const { state, dispatch } = useApp()
  const today = todayString()
  const log = state.logs[today]
  const dayNum = getDayNumber(today) ?? 1
  const bibleChapters = getTotalBibleChapters(state.logs)
  const readingPages = getTotalReadingPages(state.logs)
  const speakingVideos = Object.values(state.logs).filter(l => l.speakingVideo).length
  const prompt = JOURNAL_PROMPTS[dayNum] ?? DEFAULT_JOURNAL_PROMPT

  const readingPct = Math.min(100, Math.round((readingPages / 280) * 100))
  const biblePct = Math.min(100, Math.round((bibleChapters / 31) * 100))

  return (
    <div className="card">
      <div className="card-title">Mind</div>
      <div className="card-sub">Reading, spirit, speaking</div>
      <div className="prog-item">
        <div className="prog-head">
          <div className="prog-name">Atomic Habits</div>
          <div className="prog-pct">{readingPages} / ~280 pages</div>
        </div>
        <div className="prog-bar"><div className="prog-fill purple" style={{ width: `${readingPct}%` }} /></div>
        <div className="prog-note">Goal: finish by Week 4</div>
      </div>
      <div className="prog-item">
        <div className="prog-head">
          <div className="prog-name">Proverbs</div>
          <div className="prog-pct">Ch. {bibleChapters} / 31</div>
        </div>
        <div className="prog-bar"><div className="prog-fill teal" style={{ width: `${biblePct}%` }} /></div>
        <div className="prog-note">1 chapter per day</div>
      </div>
      <div className="habit-row" style={{ marginTop: 4 }}>
        <div className="habit-left">
          <div className="habit-icon">🎤</div>
          <div>
            <div className="habit-name">Weekly Speaking Video</div>
            <div className="habit-freq">2 min · every week · 10 total</div>
          </div>
        </div>
        <div className="habit-right">
          <span className={`streak-badge ${speakingVideos > 0 ? 'active' : 'zero'}`}>{speakingVideos} / 10</span>
          <div
            className={`cb ${log?.speakingVideo ? 'done' : ''}`}
            onClick={() => dispatch({ type: 'TOGGLE_SPEAKING_VIDEO', date: today })}
          >
            {log?.speakingVideo ? '✓' : ''}
          </div>
        </div>
      </div>
      <div className="journal-box">
        <div className="journal-box-label">Tonight's Journal Prompt</div>
        <div className="journal-box-text">"{prompt}"</div>
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Update Today.tsx (final)**

Replace `src/pages/Today.tsx`:
```typescript
import StatRow from '../components/today/StatRow'
import ScheduleCard from '../components/today/ScheduleCard'
import MissionCard from '../components/today/MissionCard'
import ProtocolCard from '../components/today/ProtocolCard'
import AcademicsCard from '../components/today/AcademicsCard'
import BuildCard from '../components/today/BuildCard'
import GoalCascade from '../components/today/GoalCascade'
import FitnessCard from '../components/today/FitnessCard'
import MindCard from '../components/today/MindCard'

export default function Today() {
  return (
    <div className="today-page">
      <StatRow />
      <div className="two-col gap-bottom">
        <ScheduleCard />
        <div className="stack">
          <MissionCard />
          <ProtocolCard />
        </div>
      </div>
      <div className="two-col gap-bottom">
        <AcademicsCard />
        <BuildCard />
      </div>
      <GoalCascade />
      <div className="two-col gap-bottom">
        <FitnessCard />
        <MindCard />
      </div>
    </div>
  )
}
```

- [ ] **Step 7: Verify full Today page in browser**

```bash
npm run dev
```
Scroll through Today page — all sections should be visible. Check habits, add tasks, verify persistence on refresh.

- [ ] **Step 8: Commit**

```bash
git add src/
git commit -m "feat: complete Today page with all sections"
```

---

## Task 10: Overview page

**Files:**
- Create: `src/components/overview/OverviewStatRow.tsx`
- Create: `src/components/overview/GoalProgressCard.tsx`
- Create: `src/components/overview/MonkModeCard.tsx`
- Create: `src/components/overview/MilestonesCard.tsx`
- Create: `src/components/overview/Heatmap.tsx`
- Create: `src/styles/overview.css`
- Modify: `src/pages/Overview.tsx`

- [ ] **Step 1: Create overview.css and import it**

Create `src/styles/overview.css`:
```css
.pipeline-item {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 0; border-bottom: 1px solid var(--border-light);
}
.pipeline-item:last-child { border: none; }
.pipeline-name { font-size: 13px; color: #ccc; font-weight: 500; }
.pipeline-bar-wrap { flex: 1; margin: 0 16px; }
.pipeline-pct { font-size: 13px; color: var(--text-muted); font-weight: 600; width: 36px; text-align: right; }

.milestone { display: flex; align-items: center; gap: 12px; padding: 9px 0; border-bottom: 1px solid var(--border-light); }
.milestone:last-child { border: none; }
.milestone-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.milestone-dot.done { background: var(--green); }
.milestone-dot.open { background: #2a2a2a; border: 1.5px solid var(--text-dim); }
.milestone-text { font-size: 13px; color: #666; flex: 1; }
.milestone-tag { font-size: 10px; padding: 2px 8px; border-radius: 4px; }
.milestone-tag.pending  { background: #141414; color: var(--text-dim); border: 1px solid var(--border); }
.milestone-tag.active   { background: var(--green-bg); color: var(--green); border: 1px solid var(--green-border); }
.milestone-tag.stretch  { background: var(--orange-bg); color: var(--orange); border: 1px solid #7c2d12; }

.heatmap-grid { display: grid; grid-template-columns: repeat(28, 1fr); gap: 3px; }
.heatmap-cell { height: 14px; border-radius: 3px; background: #1a1a1a; transition: background 0.2s; }
```

Add to `src/main.tsx`:
```typescript
import './styles/overview.css'
```

- [ ] **Step 2: Create OverviewStatRow.tsx**

Create `src/components/overview/OverviewStatRow.tsx`:
```typescript
import { useApp } from '../../context/AppContext'
import { todayString, getDayNumber } from '../../lib/dates'
import { getStreak, getSummerProgress, getTotalGymSessions, getTotalJournalEntries } from '../../lib/stats'

export default function OverviewStatRow() {
  const { state } = useApp()
  const today = todayString()
  const streak = getStreak(state.logs, today)
  const progress = getSummerProgress(today)
  const gymSessions = getTotalGymSessions(state.logs)
  const journalEntries = getTotalJournalEntries(state.logs)

  return (
    <div className="stat-grid gap-bottom">
      <div className="stat-card">
        <div className="stat-label">Day Streak</div>
        <div className={`stat-value ${streak > 0 ? 'green' : ''}`}>{streak}</div>
        <div className="stat-delta">{streak === 0 ? '— starting today' : `${streak} day${streak !== 1 ? 's' : ''} strong`}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Summer Done</div>
        <div className="stat-value">{progress}%</div>
        <div className="stat-delta">Day {getDayNumber(today) ?? 0} of 77</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Gym Sessions</div>
        <div className={`stat-value ${gymSessions >= 50 ? 'green' : ''}`}>
          {gymSessions}<span style={{ fontSize: 16, color: 'var(--text-dim)', fontWeight: 400 }}> / 50</span>
        </div>
        <div className="stat-delta">target by Aug 14</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Journal Entries</div>
        <div className={`stat-value ${journalEntries >= 70 ? 'green' : ''}`}>
          {journalEntries}<span style={{ fontSize: 16, color: 'var(--text-dim)', fontWeight: 400 }}> / 70</span>
        </div>
        <div className="stat-delta">target by Aug 14</div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create GoalProgressCard.tsx**

Create `src/components/overview/GoalProgressCard.tsx`:
```typescript
import { useApp } from '../../context/AppContext'
import { todayString, getDayNumber } from '../../lib/dates'
import { TOTAL_DAYS } from '../../lib/constants'
import { getTotalGymSessions, getTotalReadingPages } from '../../lib/stats'

export default function GoalProgressCard() {
  const { state } = useApp()
  const today = todayString()
  const dayNum = (getDayNumber(today) ?? 1) - 1
  const pctTime = Math.round((dayNum / TOTAL_DAYS) * 100)
  const gymSessions = getTotalGymSessions(state.logs)
  const readingPages = getTotalReadingPages(state.logs)
  const speakingVideos = Object.values(state.logs).filter(l => l.speakingVideo).length

  const goals = [
    { name: 'AI Teacher v1', pct: pctTime, color: 'green' },
    { name: 'AP Calculus AB — Units 1–8', pct: Math.round((dayNum / 55) * 100), color: 'blue' },
    { name: 'AP Physics 1 — Units 1–8',   pct: Math.round((dayNum / 55) * 100), color: 'blue' },
    { name: 'Spanish 3 — Conversational', pct: Math.round((dayNum / 55) * 100), color: 'orange' },
    { name: 'Body — 50 gym sessions',      pct: Math.round((gymSessions / 50) * 100), color: 'orange' },
    { name: 'Mind — 2 books',              pct: Math.round((readingPages / 560) * 100), color: 'purple' },
    { name: 'Speaking — 10 videos',        pct: Math.round((speakingVideos / 10) * 100), color: 'teal' },
  ]

  return (
    <div className="card">
      <div className="card-title">Summer Goal Progress</div>
      <div className="card-sub">All areas · as of today</div>
      {goals.map(g => (
        <div key={g.name} className="pipeline-item">
          <div style={{ minWidth: 200 }}><div className="pipeline-name">{g.name}</div></div>
          <div className="pipeline-bar-wrap">
            <div className="prog-bar">
              <div className={`prog-fill ${g.color}`} style={{ width: `${Math.min(100, g.pct)}%`, height: '5px', borderRadius: 3 }} />
            </div>
          </div>
          <div className="pipeline-pct">{Math.min(100, g.pct)}%</div>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Create MonkModeCard.tsx**

Create `src/components/overview/MonkModeCard.tsx`:
```typescript
import { todayString, getDayNumber, isOffDay, getHackathon } from '../../lib/dates'
import { getSummerProgress } from '../../lib/stats'
import { OFF_DAYS } from '../../lib/constants'

export default function MonkModeCard() {
  const today = todayString()
  const progress = getSummerProgress(today)
  const off = isOffDay(today)
  const hack = getHackathon(today)
  const status = hack ? hack : off ? 'Off Day' : 'Active'
  const statusColor = hack ? 'var(--indigo)' : off ? 'var(--red)' : 'var(--green)'

  return (
    <div className="card">
      <div className="card-title">Monk Mode</div>
      <div className="card-sub">May 30 → Aug 14 · 77 days</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: statusColor }}>{status} — Day {getDayNumber(today) ?? '—'}</div>
        <div className="monk-badge">On Track</div>
      </div>
      <div className="prog-bar" style={{ marginBottom: 6 }}>
        <div className="prog-fill green" style={{ width: `${progress}%` }} />
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>
        Off days: Jun 6, 7, 16 · Jul 11, 19
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Create MilestonesCard.tsx**

Create `src/components/overview/MilestonesCard.tsx`:
```typescript
import { useApp } from '../../context/AppContext'
import { getTotalGymSessions, getTotalBibleChapters, getTotalReadingPages } from '../../lib/stats'

export default function MilestonesCard() {
  const { state } = useApp()
  const gymSessions = getTotalGymSessions(state.logs)
  const bibleChapters = getTotalBibleChapters(state.logs)
  const readingPages = getTotalReadingPages(state.logs)
  const speakingVideos = Object.values(state.logs).filter(l => l.speakingVideo).length

  const milestones = [
    { text: '50+ gym sessions',           tag: `${gymSessions} / 50`,   done: gymSessions >= 50 },
    { text: 'Run 2 miles continuously',   tag: 'pending',               done: false,    type: 'pending' as const },
    { text: 'Finish Atomic Habits',       tag: `${readingPages}/280 pg`,done: readingPages >= 280 },
    { text: 'Finish HTWFAIP / Like Switch',tag: 'Week 8',              done: false,    type: 'pending' as const },
    { text: 'Proverbs cover to cover',    tag: `Ch ${bibleChapters}/31`,done: bibleChapters >= 31 },
    { text: '10 speaking videos',         tag: `${speakingVideos}/10`,  done: speakingVideos >= 10 },
    { text: '70 journal entries',         tag: `${Object.values(state.logs).filter(l => l.journalEntry.trim()).length}/70`, done: false },
    { text: 'Modern AI course complete',  tag: 'stretch',               done: false,    type: 'stretch' as const },
    { text: 'Claude/AI mastery course',   tag: 'stretch',               done: false,    type: 'stretch' as const },
  ]

  return (
    <div className="card">
      <div className="card-title">Personal Milestones</div>
      <div className="card-sub">End of summer targets</div>
      {milestones.map((m, i) => (
        <div key={i} className="milestone">
          <div className={`milestone-dot ${m.done ? 'done' : 'open'}`} />
          <div className="milestone-text">{m.text}</div>
          <span className={`milestone-tag ${m.done ? 'active' : (m as any).type === 'stretch' ? 'stretch' : 'pending'}`}>
            {m.tag}
          </span>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 6: Create Heatmap.tsx**

Create `src/components/overview/Heatmap.tsx`:
```typescript
import { useApp } from '../../context/AppContext'
import { todayString } from '../../lib/dates'
import { getLast28DaysCompletion } from '../../lib/stats'

function rateToColor(rate: number): string {
  if (rate === 0) return '#1a1a1a'
  if (rate < 0.5) return '#14532d'
  if (rate < 0.875) return '#166534'
  return '#22c55e'
}

export default function Heatmap() {
  const { state } = useApp()
  const today = todayString()
  const rates = getLast28DaysCompletion(state.logs, today)

  return (
    <div className="card gap-bottom">
      <div className="card-title">Consistency — Last 28 Days</div>
      <div className="card-sub">Daily habit completion rate</div>
      <div className="heatmap-grid">
        {rates.map((rate, i) => (
          <div key={i} className="heatmap-cell" style={{ background: rateToColor(rate) }} title={`${Math.round(rate * 100)}%`} />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-dim)', fontSize: 11, marginTop: 6 }}>
        <span>28 days ago</span><span>Today</span>
      </div>
    </div>
  )
}
```

- [ ] **Step 7: Update Overview.tsx**

Replace `src/pages/Overview.tsx`:
```typescript
import OverviewStatRow from '../components/overview/OverviewStatRow'
import GoalProgressCard from '../components/overview/GoalProgressCard'
import MonkModeCard from '../components/overview/MonkModeCard'
import MilestonesCard from '../components/overview/MilestonesCard'
import Heatmap from '../components/overview/Heatmap'

export default function Overview() {
  return (
    <div>
      <OverviewStatRow />
      <div className="two-col-wide gap-bottom">
        <GoalProgressCard />
        <div className="stack">
          <MonkModeCard />
          <MilestonesCard />
        </div>
      </div>
      <Heatmap />
    </div>
  )
}
```

- [ ] **Step 8: Verify in browser**

```bash
npm run dev
```
Navigate to Overview — all sections visible, progress bars reflect actual logged data.

- [ ] **Step 9: Commit**

```bash
git add src/
git commit -m "feat: complete Overview page"
```

---

## Task 11: Calendar page

**Files:**
- Create: `src/components/calendar/CalendarGrid.tsx`
- Create: `src/styles/calendar.css`
- Modify: `src/pages/Calendar.tsx`

- [ ] **Step 1: Create calendar.css and import it**

Create `src/styles/calendar.css`:
```css
.cal-page { }
.cal-month-label { font-size: 13px; font-weight: 600; color: #888; letter-spacing: 1px; text-transform: uppercase; margin: 20px 0 10px; }
.cal-month-label:first-of-type { margin-top: 0; }
.cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; margin-bottom: 4px; }
.cal-head { text-align: center; font-size: 10px; color: var(--text-dim); letter-spacing: 1px; text-transform: uppercase; padding-bottom: 6px; }
.cal-cell { min-height: 58px; background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; padding: 7px 9px; }
.cal-cell.empty { background: transparent; border: none; min-height: 20px; }
.cal-cell.start { border-color: var(--green); background: var(--green-dim); }
.cal-cell.end   { border-color: rgba(34,197,94,0.4); background: rgba(12,26,12,0.5); }
.cal-cell.off   { background: var(--red-bg); border-color: #2a1010; }
.cal-cell.hack  { background: var(--indigo-bg); border-color: var(--indigo-border); }
.cal-num { font-size: 12px; color: var(--text-muted); font-weight: 600; margin-bottom: 4px; }
.cal-cell.start .cal-num { color: var(--green); }
.cal-cell.end   .cal-num { color: var(--green); }
.cal-cell.off   .cal-num { color: var(--red); }
.cal-cell.hack  .cal-num { color: var(--indigo); }
.cal-tag { font-size: 9px; color: var(--text-dim); margin-top: 2px; line-height: 1.3; }
.cal-cell.start .cal-tag { color: rgba(34,197,94,0.6); }
.cal-cell.end   .cal-tag { color: rgba(34,197,94,0.4); }
.cal-cell.off   .cal-tag { color: rgba(239,68,68,0.5); }
.cal-cell.hack  .cal-tag { color: rgba(129,140,248,0.6); }

.cal-legend { display: flex; gap: 20px; margin-bottom: 20px; font-size: 12px; color: var(--text-muted); flex-wrap: wrap; }
.legend-dot { display: inline-block; width: 10px; height: 10px; border-radius: 2px; margin-right: 5px; vertical-align: middle; }
```

Add to `src/main.tsx`:
```typescript
import './styles/calendar.css'
```

- [ ] **Step 2: Create CalendarGrid.tsx**

Create `src/components/calendar/CalendarGrid.tsx`:
```typescript
import { isOffDay, getHackathon, getDayNumber } from '../../lib/dates'

interface MonthGridProps {
  year: number
  month: number    // 0-indexed
  startDay: string // "2026-05-30"
  endDay: string   // "2026-08-14"
}

function pad2(n: number) { return n.toString().padStart(2, '0') }

export default function CalendarGrid({ year, month, startDay, endDay }: MonthGridProps) {
  const firstDow = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const monthName = new Date(year, month, 1).toLocaleString('en-US', { month: 'long', year: 'numeric' })

  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  // pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <>
      <div className="cal-month-label">{monthName}</div>
      <div className="cal-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="cal-head">{d}</div>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <div key={i} className="cal-cell empty" />
          const dateStr = `${year}-${pad2(month + 1)}-${pad2(day)}`
          const isStart = dateStr === startDay
          const isEnd = dateStr === endDay
          const off = isOffDay(dateStr)
          const hack = getHackathon(dateStr)
          const inRange = dateStr >= startDay && dateStr <= endDay

          let cls = 'cal-cell'
          if (isStart) cls += ' start'
          else if (isEnd) cls += ' end'
          else if (hack) cls += ' hack'
          else if (off) cls += ' off'
          else if (!inRange) cls += ' empty' // outside lock-in, style minimally

          return (
            <div key={i} className={cls}>
              <div className="cal-num">{day}</div>
              {isStart && <div className="cal-tag">Day 1 🚀</div>}
              {isEnd && <div className="cal-tag">Day 77 🏁</div>}
              {off && !isStart && !isEnd && <div className="cal-tag">OFF</div>}
              {hack && <div className="cal-tag">{hack}</div>}
            </div>
          )
        })}
      </div>
    </>
  )
}
```

- [ ] **Step 3: Update Calendar.tsx**

Replace `src/pages/Calendar.tsx`:
```typescript
import CalendarGrid from '../components/calendar/CalendarGrid'

const START = '2026-05-30'
const END   = '2026-08-14'

export default function Calendar() {
  return (
    <div className="cal-page card">
      <div className="card-title">Summer Lock-In Calendar</div>
      <div className="card-sub">May 30 → Aug 14, 2026 · 77 days</div>
      <div className="cal-legend">
        <span>
          <span className="legend-dot" style={{ background: 'var(--red-bg)', border: '1px solid #2a1010' }} />
          Off Day
        </span>
        <span>
          <span className="legend-dot" style={{ background: 'var(--indigo-bg)', border: '1px solid var(--indigo-border)' }} />
          Hackathon
        </span>
        <span style={{ color: 'var(--green)', fontWeight: 600 }}>
          Green border = Day 1 &amp; Day 77
        </span>
      </div>
      <CalendarGrid year={2026} month={4} startDay={START} endDay={END} />
      <CalendarGrid year={2026} month={5} startDay={START} endDay={END} />
      <CalendarGrid year={2026} month={6} startDay={START} endDay={END} />
      <CalendarGrid year={2026} month={7} startDay={START} endDay={END} />
    </div>
  )
}
```

- [ ] **Step 4: Verify Calendar page in browser**

```bash
npm run dev
```
Navigate to Calendar — should show May–August grids. Verify: May 30 = green border Day 1 (Saturday), off days in red, hackathon days in indigo with names, Aug 14 = green Day 77.

- [ ] **Step 5: Commit**

```bash
git add src/
git commit -m "feat: complete Calendar page with hackathons and off days"
```

---

## Task 12: Final polish and .gitignore

**Files:**
- Create: `.gitignore`
- Modify: `index.html` (page title)

- [ ] **Step 1: Create .gitignore**

Create `.gitignore`:
```
node_modules/
dist/
.superpowers/
*.local
.DS_Store
```

- [ ] **Step 2: Update page title in index.html**

In `index.html`, change:
```html
<title>Summer Lock-In Dashboard</title>
```

- [ ] **Step 3: Run all tests one final time**

```bash
npm test
```
Expected: All tests PASS

- [ ] **Step 4: Run dev server and do a full walkthrough**

```bash
npm run dev
```
Check:
- Sidebar navigation works for all 3 pages
- Today page: stat cards, schedule, mission (add + check tasks), habits (check off, streaks update), academics, build tasks, goal cascade, fitness, mind
- Overview page: stats, progress bars, milestones, heatmap
- Calendar page: correct day layout, off days red, hackathons indigo, Day 1 green
- Refresh page → all checked data persists

- [ ] **Step 5: Final commit**

```bash
git add .
git commit -m "feat: complete Summer Lock-In Dashboard v1"
```

---

## Self-Review

**Spec coverage check:**
- ✅ 3-page SalesOps-style layout (Sidebar + Topbar + Router)
- ✅ Today: stat row, schedule, mission, protocol/habits, academics, build, goal cascade, fitness, mind
- ✅ Overview: stat row, pipeline progress, monk mode, milestones, heatmap
- ✅ Calendar: May–Aug grids, off days, hackathons (SF Horizons, Kove Hacks, Horizons Toronto)
- ✅ localStorage persistence via AppContext reducer
- ✅ Streak calculation, summer progress %, gym sessions counter
- ✅ Monk Mode badge (active/off/hackathon) in Topbar
- ✅ Black + green theme via CSS variables
- ✅ Tab order: Overview → Today → Calendar, default load: Today (route `/`)
- ✅ All 8 habits with streak counters
- ✅ Goal cascade (summer → week → today) for all 3 life areas
- ✅ Gym schedule (Mon GYM, Tue CARDIO, etc.) with today highlighted
- ✅ Reading progress (Atomic Habits pages + Proverbs chapters)
- ✅ Speaking video weekly tracker
- ✅ Journal prompts per day number

**No placeholders found.**

**Type consistency verified:** All action types in `AppAction` match dispatch calls in components. All `HabitId` values in `HABITS` constant match the `HabitId` union type. `DayLog` fields used in stats functions match the interface definition.
