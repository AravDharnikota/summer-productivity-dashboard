# Summer Lock-In Dashboard — Design Spec
**Date:** 2026-05-29  
**Status:** Approved

---

## Overview

A personal productivity dashboard for a 77-day "Summer Lock-In" (May 30 – Aug 14, 2026). Tracks habits, goals, schedule, academics, and a product build across three life areas: Personal, Academics, and Entrepreneurial. Built as a local Vite + React app with localStorage persistence.

---

## Tech Stack

- **Framework:** Vite + React (TypeScript)
- **Styling:** Plain CSS (no Tailwind — match the SalesOps-inspired dark dashboard aesthetic exactly)
- **State / Persistence:** React Context + localStorage (no backend)
- **Charts:** Recharts (progress bars, heatmap)
- **Routing:** React Router v6 (3 pages)

---

## Visual Design

**Theme:** SalesOps-inspired dark dashboard  
- Background: `#0a0a0a`, sidebar: `#0d0d0d`, cards: `#111`  
- Borders: `#1f1f1f`, secondary text: `#555`, body text: `#e8e8e8`  
- Primary accent: `#22c55e` (green), active sidebar: `#0f1f0f` bg + `#22c55e` left border  
- Secondary colors: blue `#3b82f6`, orange `#fb923c`, purple `#a855f7`, teal `#14b8a6`
- Font: system-ui / Inter

**Layout:** Fixed left sidebar (220px) + scrollable main content area  
- Sidebar: Logo, nav sections (Dashboards / Life Areas), collapse button  
- Topbar: page title + date chip + Monk Mode badge  

---

## Pages & Navigation

Tab order in sidebar: **Overview → Today → Calendar** (default load: Today)

### Sidebar Nav Items
**Dashboards:** Overview, Today, Calendar  
**Life Areas:** Build, Academics, Personal

---

## Page: Today

The daily command center. Everything needed for the current day on one scrollable page.

### Sections (top to bottom)

**1. Stat Row (4 cards)**
- Day Streak
- Summer Progress % (days completed / 77)
- Habits Today (X / 8)
- Build Hours Target (6h)

**2. Today's Schedule + Mission/Protocol (2-col)**

*Left — Daily Schedule:* Time-blocked 6am–10pm template
- 6:00am: Morning Protocol (prayer · meditation · cold shower · skincare)
- 7:00am: AP Calculus AB — 1h
- 8:00am: AP Physics 1 — 1h
- 9:00am: Spanish 3 — 1h
- 10:00am–4:00pm: Build — AI Teacher (6 × 1h blocks)
- 5:00pm: Gym or Cardio (alternates by day of week)
- 6:30pm: Dinner / Break
- 8:00pm: Evening Protocol (journal · reading · Bible · skincare)
- 10:00pm: Sleep

*Right — Two stacked cards:*
- **Today's Mission:** 3–5 manually-entered must-do tasks for the day
- **Daily Protocol:** 8 habit checkboxes with streak counters

**3. Academics + Build (2-col)**

*Academics:* Progress bar per subject + today's task
- AP Calculus AB (Units 1–8, Khan Academy)
- AP Physics 1 (Units 1–8, Khan Academy)
- Spanish 3 (Weeks 1–11)

*Build:* AI Teacher milestone progress bar + today's build tasks + stretch goal

**4. Goal Cascade (3-col)**
- Columns: Build / Academics / Personal
- Each column: Summer goal → This Week → Today

**5. Fitness + Mind (2-col)**

*Fitness:*
- Today's workout type (GYM or CARDIO based on day)
- Session counter (X / 50)
- Weekly pattern pills (Mon GYM, Tue CARDIO, etc.)
- Log workout task + protein target

*Mind:*
- Atomic Habits progress (pages)
- Proverbs progress (chapters, 0–31)
- Weekly speaking video tracker (0/10)
- Tonight's journal prompt

---

## Page: Overview

High-level summer progress at a glance.

### Sections

**1. Stat Row (4 cards)**
- Day Streak
- Summer Done %
- Gym Sessions (X / 50)
- Journal Entries (X / 70)

**2. Summer Goal Progress + Monk Mode/Milestones (2-col wide)**

*Left — Pipeline-style progress bars:*
- AI Teacher v1
- AP Calculus AB
- AP Physics 1
- Spanish 3
- Body (50 sessions)
- Mind (2 books: Atomic Habits by Wk 4, HTWFAIP/Like Switch by Wk 8)
- Speaking (10 videos)

*Right — Two stacked cards:*
- Monk Mode Status (dates, progress bar, off days)
- Personal Milestones checklist (all 9 end-of-summer targets)

**3. Consistency Heatmap**
- GitHub contribution-style grid, last 28 days
- Green cells = habit completion rate for that day

---

## Page: Calendar

Full summer calendar May → August 2026.

### Cell Types
- **Normal day:** `#111` background, dark number
- **Off day:** Red bg/border (`#160a0a` / `#2a1010`), red number — Jun 6, 7, 16 · Jul 11, 19
- **Hackathon:** Blue/indigo bg/border (`#0d0d2a` / `#3b4fd8`), indigo number + name label
- **Day 1 (May 30):** Green border
- **Day 77 (Aug 14):** Green border (dimmer)

### Hackathons
- SF Horizons: Jun 19–21
- Kove Hacks: Jul 24–26
- Horizons Toronto: Aug 7–9

### Legend
- Off Day (red)
- Hackathon (blue/indigo)
- Day 1 / Day 77 (green border)

---

## Data Model (localStorage)

```typescript
// Config — set once
interface Config {
  startDate: string        // "2026-05-30"
  endDate: string          // "2026-08-14"
  offDays: string[]        // ["2026-06-06", ...]
  hackathons: { name: string; dates: string[] }[]
}

// Per-day log — keyed by "YYYY-MM-DD"
interface DayLog {
  habits: Record<HabitId, boolean>   // 8 habits
  mission: Task[]                     // today's mission tasks
  buildTasks: Task[]                  // build tasks for the day
  workoutLogged: boolean
  workoutNotes: string
  journalEntry: string
  journalPrompt: string
  proteinTarget: boolean
  readingPages: number                // pages read today
  bibleChapter: boolean               // chapter read today
  speakingVideo: boolean              // recorded this week
}

// Goals — set at start of each week
interface WeekGoals {
  week: number
  build: string
  academics: string
  personal: string
  todayGoals: Record<string, string>  // date -> today's goal text
}

// Progress counters — derived from DayLog entries
// Computed on read: streak, summer %, gym sessions, etc.
```

### Habit IDs
`prayer`, `meditation`, `coldShower`, `amSkincare`, `noSugar`, `journal`, `pmSkincare`, `sleep10pm`

### Gym Schedule (template, repeating weekly)
Mon=GYM, Tue=CARDIO, Wed=GYM, Thu=CARDIO, Fri=GYM, Sat=CARDIO, Sun=REST

**Sunday override:** Young Longs coding class 5:30–6:15pm. 2–3h homework block shown in schedule on Sundays.

---

## Functional Requirements

- **Check off habits:** Click checkbox on Today → persists to localStorage, streak auto-calculates
- **Mission tasks:** Add/check off tasks for today, reset each day
- **Build tasks:** Add/check off, persist per day
- **Schedule:** Static template, rendered from config (no editing needed v1)
- **Goal cascade:** Editable weekly goals (Build / Academics / Personal) + today's specific goal
- **Workout log:** Text input for exercises/notes, checkbox for protein target
- **Reading progress:** Increment pages (Atomic Habits), toggle daily Bible chapter
- **Speaking video:** Weekly toggle (resets each Sunday)
- **Heatmap:** Computed from habit completion rate per day (0 = dark, all 8 = bright green)
- **Monk Mode badge:** Shows "Active" on monk mode days, "Off Day" on off days, "Hackathon" on hackathon days

---

## Out of Scope (v1)

- Google Calendar sync
- Mobile responsiveness (desktop-first)
- User accounts / cloud sync
- Notifications / reminders
- Dark/light mode toggle
- Import/export (add in v2)
