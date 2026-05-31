# Mobile Responsive Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the dashboard fully usable on mobile (≤768px) with a hamburger sidebar, stacked layouts, and touch-enabled schedule timeline.

**Architecture:** Three independent changes — (1) hamburger nav via state lifted to App.tsx, (2) CSS media queries for layout reflow, (3) touch event handlers on ScheduleTimeline. Desktop is completely unchanged.

**Tech Stack:** React 18, TypeScript, plain CSS media queries. No new dependencies.

---

## File Map

| Action | Path | Change |
|--------|------|--------|
| Modify | `src/App.tsx` | Manage `sidebarOpen` state, pass to Sidebar + Topbar |
| Modify | `src/components/layout/Sidebar.tsx` | Accept `isOpen`/`onClose` props, render backdrop |
| Modify | `src/components/layout/Topbar.tsx` | Accept `onMenuClick` prop, render hamburger button |
| Modify | `src/components/today/ScheduleTimeline.tsx` | Add touch event handlers |
| Modify | `src/styles/layout.css` | Mobile sidebar overlay + hamburger styles |
| Modify | `src/styles/components.css` | `.two-col` reflow, `.dr-row` horizontal scroll |
| Modify | `src/styles/overview.css` | `.rings-row` horizontal scroll, `.unit-cols` reflow |
| Modify | `src/styles/today.css` | `touch-action: none` on `.tl-grid`, mobile content padding |

---

## Task 1: Hamburger nav — App, Sidebar, Topbar

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/layout/Sidebar.tsx`
- Modify: `src/components/layout/Topbar.tsx`

- [ ] **Replace `src/App.tsx`**

```tsx
import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'
import Today from './pages/Today'
import Overview from './pages/Overview'
import Calendar from './pages/Calendar'
import DayPage from './pages/DayPage'
import Review from './pages/Review'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="app">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main">
        <Topbar onMenuClick={() => setSidebarOpen(o => !o)} />
        <div className="content">
          <Routes>
            <Route path="/" element={<Today />} />
            <Route path="/day/:date" element={<DayPage />} />
            <Route path="/overview" element={<Overview />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/review" element={<Review />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Replace `src/components/layout/Sidebar.tsx`**

```tsx
import { NavLink, useLocation } from 'react-router-dom'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: Props) {
  const { pathname } = useLocation()
  const isDayRoute = pathname.startsWith('/day/')

  return (
    <>
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}
      <nav className={`sidebar${isOpen ? ' sidebar--open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">S</div>
          <div className="logo-text">Lock-In</div>
        </div>
        <div className="sidebar-nav">
          <div className="nav-section-label">Dashboards</div>
          <NavLink to="/overview" onClick={onClose} className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
            <span className="nav-icon">⊞</span> Overview
          </NavLink>
          <NavLink to="/" end onClick={onClose} className={({ isActive }) => 'nav-item' + (isActive || isDayRoute ? ' active' : '')}>
            <span className="nav-icon">◎</span> Today
          </NavLink>
          <NavLink to="/calendar" onClick={onClose} className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
            <span className="nav-icon">▦</span> Calendar
          </NavLink>
          <NavLink to="/review" onClick={onClose} className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
            <span className="nav-icon">◉</span> Review
          </NavLink>
        </div>
      </nav>
    </>
  )
}
```

- [ ] **Replace `src/components/layout/Topbar.tsx`**

```tsx
import { useLocation, useNavigate } from 'react-router-dom'
import { todayString, getDayNumber, isOffDay, getHackathon } from '../../lib/dates'

const PAGE_TITLES: Record<string, string> = {
  '/': 'Today',
  '/overview': 'Overview',
  '/calendar': 'Calendar',
  '/review': 'Weekly Review',
}

interface Props {
  onMenuClick: () => void
}

export default function Topbar({ onMenuClick }: Props) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const today = todayString()
  const hackathon = getHackathon(today)
  const off = isOffDay(today)
  const dayNum = getDayNumber(today)

  const isDayRoute = pathname.startsWith('/day/')
  const pageTitle = isDayRoute ? 'Day View' : (PAGE_TITLES[pathname] ?? 'Dashboard')

  return (
    <div className="topbar">
      <div className="topbar-left">
        <button className="hamburger-btn" onClick={onMenuClick} aria-label="Open menu">☰</button>
        <div className="topbar-title">{pageTitle}</div>
      </div>
      <div className="topbar-right">
        <div
          className="day-chip"
          style={{ cursor: 'pointer' }}
          title="Open calendar"
          onClick={() => navigate('/calendar')}
        >
          📅 {new Date(today + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          {dayNum ? ` · Day ${dayNum}` : ''}
        </div>
        {hackathon && <div className="hack-badge">🚀 {hackathon}</div>}
        {off && !hackathon && <div className="off-badge">🌅 Off Day</div>}
        {!off && !hackathon && dayNum && <div className="monk-badge">⚡ Monk Mode</div>}
        {!dayNum && !hackathon && <div className="day-chip">🔒 Lock-In starts May 30</div>}
      </div>
    </div>
  )
}
```

- [ ] **Run TypeScript check**

```bash
cd "/Users/arav/Summer LOCK IN Dashboard" && npx tsc -p tsconfig.app.json --noEmit 2>&1 | grep -E "(App|Sidebar|Topbar)"
```

Expected: no output (no errors in these files).

- [ ] **Commit**

```bash
cd "/Users/arav/Summer LOCK IN Dashboard" && git add src/App.tsx src/components/layout/Sidebar.tsx src/components/layout/Topbar.tsx && git commit -m "feat: add hamburger menu state to App, Sidebar, Topbar"
```

---

## Task 2: Mobile CSS — layout + hamburger styles

**Files:**
- Modify: `src/styles/layout.css`

- [ ] **Append this block to the end of `src/styles/layout.css`**

```css
/* ── Hamburger button (desktop: hidden) ──────────────── */
.topbar-left {
  display: flex; align-items: center; gap: 12px;
}
.hamburger-btn {
  display: none;
  background: none; border: none; color: var(--text-muted);
  font-size: 20px; cursor: pointer; padding: 4px 6px;
  line-height: 1; border-radius: 6px;
  transition: color 0.1s;
}
.hamburger-btn:hover { color: var(--text); }

/* ── Mobile ──────────────────────────────────────────── */
@media (max-width: 768px) {
  .hamburger-btn { display: block; }

  .sidebar {
    position: fixed; top: 0; left: 0; bottom: 0;
    z-index: 200;
    transform: translateX(-100%);
    transition: transform 0.22s ease;
    box-shadow: none;
  }
  .sidebar--open {
    transform: translateX(0);
    box-shadow: 4px 0 24px rgba(0,0,0,0.6);
  }
  .sidebar-backdrop {
    position: fixed; inset: 0; z-index: 199;
    background: rgba(0,0,0,0.5);
  }

  .main { width: 100%; }
  .content { padding: 12px; }

  .topbar { padding: 0 12px; }
  .topbar-title { font-size: 16px; }
  .day-chip { font-size: 11px; padding: 4px 8px; }
  .monk-badge, .hack-badge, .off-badge { display: none; }
}
```

- [ ] **Commit**

```bash
cd "/Users/arav/Summer LOCK IN Dashboard" && git add src/styles/layout.css && git commit -m "feat: add hamburger button + mobile sidebar overlay CSS"
```

---

## Task 3: Mobile CSS — component reflow

**Files:**
- Modify: `src/styles/components.css`
- Modify: `src/styles/overview.css`
- Modify: `src/styles/today.css`

- [ ] **Append to end of `src/styles/components.css`**

```css
/* ── Mobile reflow ───────────────────────────────────── */
@media (max-width: 768px) {
  .two-col, .two-col-wide {
    grid-template-columns: 1fr;
  }
  .stat-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

- [ ] **Append to end of `src/styles/overview.css`**

```css
/* ── Mobile reflow ───────────────────────────────────── */
@media (max-width: 768px) {
  .rings-row {
    flex-wrap: nowrap;
    overflow-x: auto;
    justify-content: flex-start;
    padding-bottom: 8px;
    -webkit-overflow-scrolling: touch;
  }
  .ring-wrap { flex-shrink: 0; }

  .unit-cols {
    grid-template-columns: 1fr;
  }
  .unit-divider { display: none; }
}
```

- [ ] **Append to end of `src/styles/today.css`**

```css
/* ── Mobile reflow ───────────────────────────────────── */
@media (max-width: 768px) {
  .dr-row {
    overflow-x: auto;
    grid-template-columns: repeat(5, 110px);
    -webkit-overflow-scrolling: touch;
  }
  .tl-grid { touch-action: none; }
}
```

- [ ] **Commit**

```bash
cd "/Users/arav/Summer LOCK IN Dashboard" && git add src/styles/components.css src/styles/overview.css src/styles/today.css && git commit -m "feat: add mobile reflow CSS for cards, rings, timeline"
```

---

## Task 4: Touch events for ScheduleTimeline

**Files:**
- Modify: `src/components/today/ScheduleTimeline.tsx`

- [ ] **Read the current onBlockMouseDown, onMouseMove, onMouseUp functions** in `src/components/today/ScheduleTimeline.tsx` to find their exact current implementation before making changes.

- [ ] **Add a `lastTouchY` ref** alongside the other refs (near `mouseDownY`):

Find this line:
```tsx
const mouseDownY = useRef(0)
```
Add immediately after:
```tsx
const lastTouchY = useRef(0)
```

- [ ] **Add touch handlers for block body** — find the block's `onMouseDown`:

```tsx
onMouseDown={e => onBlockMouseDown(e, block, 'move')}
onClick={e => e.stopPropagation()}
```

Add `onTouchStart` right after `onMouseDown`:
```tsx
onMouseDown={e => onBlockMouseDown(e, block, 'move')}
onTouchStart={e => {
  e.stopPropagation()
  const touch = e.touches[0]
  mouseDownY.current = touch.clientY
  lastTouchY.current = touch.clientY
  dragRef.current = {
    mode: 'move',
    blockId: block.id,
    startY: touch.clientY,
    origStartMin: timeToMin(block.startTime),
    origEndMin: timeToMin(block.endTime),
  }
}}
onClick={e => e.stopPropagation()}
```

- [ ] **Add touch handler for resize handle** — find:

```tsx
onMouseDown={e => { e.stopPropagation(); onBlockMouseDown(e, block, 'resize') }}
```

Add `onTouchStart` after it:
```tsx
onMouseDown={e => { e.stopPropagation(); onBlockMouseDown(e, block, 'resize') }}
onTouchStart={e => {
  e.stopPropagation()
  const touch = e.touches[0]
  mouseDownY.current = touch.clientY
  lastTouchY.current = touch.clientY
  dragRef.current = {
    mode: 'resize',
    blockId: block.id,
    startY: touch.clientY,
    origStartMin: timeToMin(block.startTime),
    origEndMin: timeToMin(block.endTime),
  }
}}
```

- [ ] **Add `onTouchMove` and `onTouchEnd` to `.tl-grid`** — find the grid div:

```tsx
onMouseMove={onMouseMove}
onMouseUp={onMouseUp}
onMouseLeave={onMouseUp}
onClick={onTimelineClick}
ref={timelineRef}
```

Add touch handlers:
```tsx
onMouseMove={onMouseMove}
onMouseUp={onMouseUp}
onMouseLeave={onMouseUp}
onTouchMove={e => {
  const touch = e.touches[0]
  lastTouchY.current = touch.clientY
  const synth = { clientY: touch.clientY } as React.MouseEvent
  onMouseMove(synth)
}}
onTouchEnd={() => {
  const synth = { clientY: lastTouchY.current } as React.MouseEvent
  onMouseUp(synth)
}}
onClick={onTimelineClick}
ref={timelineRef}
```

- [ ] **Run TypeScript check**

```bash
cd "/Users/arav/Summer LOCK IN Dashboard" && npx tsc -p tsconfig.app.json --noEmit 2>&1 | grep ScheduleTimeline
```

Expected: no output.

- [ ] **Commit**

```bash
cd "/Users/arav/Summer LOCK IN Dashboard" && git add src/components/today/ScheduleTimeline.tsx && git commit -m "feat: add touch event support to ScheduleTimeline for mobile drag"
```

---

## Task 5: Build verification + push

- [ ] **Run full build**

```bash
cd "/Users/arav/Summer LOCK IN Dashboard" && npm run build 2>&1 | tail -8
```

Expected:
```
✓ built in ~500ms
```

- [ ] **Push to main**

```bash
cd "/Users/arav/Summer LOCK IN Dashboard" && git push
```
