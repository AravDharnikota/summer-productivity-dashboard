# Summer Productivity Dashboard

A personal productivity dashboard built for an intensive 77-day summer self-improvement program. Tracks daily habits, schedule, fitness, academics, and weekly reflections — all in one place.

Built with **React 18 + TypeScript + Vite**, plain CSS, and localStorage persistence. No backend, no database. AI was used in this project.

![Dashboard preview](https://img.shields.io/badge/stack-React%20%2B%20TypeScript%20%2B%20Vite-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## Features

- **Today view** — flat metrics bar (habits, water, protein, build hours, push-ups) with live increment controls
- **Google Calendar–style schedule timeline** — drag to move, drag to resize, click to edit, current-time red line
- **Habit tracker** — 8 daily habits with streak badges and check-off
- **77-day habit heatmap** — GitHub contribution graph style, one row per habit
- **Weekly review** — structured reflection with rating, text prompts, and archive
- **Overview** — progress metrics bar, AP unit trackers, end goals checklist
- **Calendar** — full summer calendar with off days, hackathons, and day navigation
- **Mobile responsive** — hamburger sidebar, touch drag on schedule, horizontal-scroll metrics

---

## Stack

| Layer | Choice |
|---|---|
| Framework | React 18 + TypeScript |
| Build tool | Vite |
| Styling | Plain CSS (no Tailwind) |
| State | React Context + useReducer |
| Persistence | localStorage |
| Fonts | Inter + JetBrains Mono (Google Fonts) |
| Deployment | Vercel |

---

## Getting Started

```bash
git clone https://github.com/AravDharnikota/summer-productivity-dashboard.git
cd summer-productivity-dashboard
npm install
npm run dev
```

Open `http://localhost:5173`.

---

## Project Structure

```
src/
├── components/
│   ├── layout/          # Sidebar, Topbar
│   ├── today/           # DayRings, ScheduleTimeline, habit/task cards
│   └── overview/        # RingProgress, HabitHeatmap, EndGoals
├── context/             # AppContext — global state + useReducer
├── lib/
│   ├── constants.ts     # Dates, habits, hackathons, journal prompts
│   ├── dates.ts         # Day number, off day, gym type helpers
│   ├── schedule.ts      # Default schedule blocks
│   └── stats.ts         # Streak, completion rate, aggregate stats
├── pages/               # Today, Overview, Calendar, Review, DayPage
├── styles/              # One CSS file per page/concern
└── types.ts             # Shared TypeScript types
```

---

## Customizing for Your Own Use

Everything personal lives in two files:

**`src/lib/constants.ts`** — set your start/end dates, habits, off days, hackathons, and journal prompts.

**`src/lib/schedule.ts`** — define your default daily schedule blocks (drag-to-edit overrides are saved per-day in localStorage).

---

## License

MIT
