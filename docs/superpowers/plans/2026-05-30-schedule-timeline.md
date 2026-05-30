# Schedule Timeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the flat read-only schedule list with a Google Calendar–style proportional timeline supporting drag-to-move, drag-to-resize, click-to-edit, and a real-time current-time red line.

**Architecture:** A single `ScheduleTimeline.tsx` component replaces `ScheduleCard.tsx`. It renders an absolutely-positioned block grid (60px/hr, 6am–11pm) using raw mouse events for drag. All edits dispatch `SET_SCHEDULE` to the existing reducer. The `ScheduleBlock` type gains `startTime`/`endTime` in place of `time`.

**Tech Stack:** React 18, TypeScript, plain CSS, Vite. No new dependencies.

---

## File Map

| Action | Path | Responsibility |
|--------|------|---------------|
| Modify | `src/types.ts` | Replace `time` with `startTime`/`endTime` on `ScheduleBlock` |
| Modify | `src/lib/schedule.ts` | Add `endTime` to all default blocks; export `minToHHMM` |
| Create | `src/components/today/ScheduleTimeline.tsx` | Full timeline component |
| Modify | `src/pages/Today.tsx` | Swap `ScheduleCard` import for `ScheduleTimeline` |
| Modify | `src/styles/today.css` | Add all timeline + edit-panel styles |
| Delete | `src/components/today/ScheduleCard.tsx` | Replaced by ScheduleTimeline |

`src/context/AppContext.tsx` — no changes needed. `SET_SCHEDULE` case already handles arbitrary block arrays.

---

## Task 1: Update ScheduleBlock type

**Files:**
- Modify: `src/types.ts`

- [ ] **Replace the `ScheduleBlock` interface**

In `src/types.ts`, replace:
```ts
export interface ScheduleBlock {
  id: string
  time: string   // "H:MM" display format
  label: string
  type: BlockType
}
```
with:
```ts
export interface ScheduleBlock {
  id: string
  startTime: string   // "HH:MM" 24h, e.g. "07:45"
  endTime: string     // "HH:MM" 24h, e.g. "10:45"
  label: string
  type: BlockType
}
```

- [ ] **Run TypeScript check**

```bash
cd "/Users/arav/Summer LOCK IN Dashboard" && npx tsc --noEmit 2>&1 | head -40
```

Expected: errors in `schedule.ts` and `ScheduleCard.tsx` only (not yet fixed). That's correct — continue.

- [ ] **Commit**

```bash
cd "/Users/arav/Summer LOCK IN Dashboard" && git add src/types.ts && git commit -m "refactor: update ScheduleBlock to startTime/endTime"
```

---

## Task 2: Update getDefaultSchedule + add minToHHMM

**Files:**
- Modify: `src/lib/schedule.ts`

- [ ] **Replace the entire file content**

```ts
import { getGymType, isSunday } from './dates'
import type { ScheduleBlock } from '../types'

const FLOATING: Record<number, string> = {
  1: 'Modern AI — lecture (1.5 hrs)',
  2: 'Modern AI — homework (1.5 hrs)',
  3: 'Modern AI — lecture (1.5 hrs)',
  4: 'Modern AI — homework (1.5 hrs)',
  5: 'YoungWonks HW (1.5 hrs)',
  6: 'YoungWonks HW (1.5 hrs)',
  0: 'Free / overflow',
}

type RawBlock = Omit<ScheduleBlock, 'id'>

export function getDefaultSchedule(date: string): ScheduleBlock[] {
  const dow = new Date(date + 'T00:00:00').getDay()
  const gym = getGymType(date)
  const gymLabel = gym === 'GYM' ? 'Gym — Push/Pull/Legs' : 'Cardio — Run / Bike'
  const sunday = isSunday(date)

  const raw: RawBlock[] = sunday ? [
    { startTime: '06:00', endTime: '06:15', label: 'Wake — no phone, brush teeth, AM skincare',              type: 'routine' },
    { startTime: '06:15', endTime: '07:00', label: 'Morning routine — prayer, meditation, journal, reading', type: 'routine' },
    { startTime: '07:00', endTime: '07:15', label: 'Cold shower + get ready',                                type: 'routine' },
    { startTime: '07:15', endTime: '07:45', label: 'Breakfast — high protein, no junk',                      type: 'break'   },
    { startTime: '07:45', endTime: '10:45', label: 'Deep work I — project (3 hrs)',                          type: 'build'   },
    { startTime: '10:45', endTime: '11:00', label: 'Break — walk outside, no phone',                        type: 'break'   },
    { startTime: '11:00', endTime: '14:00', label: 'Deep work II — project (3 hrs)',                         type: 'build'   },
    { startTime: '14:00', endTime: '17:00', label: 'Academic block — AP Calc → AP Physics → Spanish',        type: 'study'   },
    { startTime: '17:00', endTime: '17:30', label: 'Transition / light movement',                            type: 'break'   },
    { startTime: '17:30', endTime: '18:15', label: 'YoungWonks class (5:30–6:15)',                           type: 'study'   },
    { startTime: '18:15', endTime: '19:00', label: 'Dinner',                                                 type: 'break'   },
    { startTime: '19:00', endTime: '20:00', label: gymLabel,                                                 type: 'gym'     },
    { startTime: '20:00', endTime: '20:45', label: 'Shower',                                                 type: 'routine' },
    { startTime: '20:45', endTime: '21:50', label: 'Night routine + journal',                                type: 'routine' },
    { startTime: '21:50', endTime: '22:00', label: 'Lights out',                                             type: 'routine' },
  ] : [
    { startTime: '06:00', endTime: '06:15', label: 'Wake — no phone, brush teeth, AM skincare',              type: 'routine' },
    { startTime: '06:15', endTime: '07:00', label: 'Morning routine — prayer, meditation, journal, reading', type: 'routine' },
    { startTime: '07:00', endTime: '07:15', label: 'Cold shower + get ready',                                type: 'routine' },
    { startTime: '07:15', endTime: '07:45', label: 'Breakfast — high protein, no junk',                      type: 'break'   },
    { startTime: '07:45', endTime: '10:45', label: 'Deep work I — project (3 hrs)',                          type: 'build'   },
    { startTime: '10:45', endTime: '11:00', label: 'Break — walk outside, no phone, decompress',             type: 'break'   },
    { startTime: '11:00', endTime: '14:00', label: 'Deep work II — project (3 hrs)',                         type: 'build'   },
    { startTime: '14:00', endTime: '14:30', label: 'Lunch — high protein',                                   type: 'break'   },
    { startTime: '14:30', endTime: '17:30', label: 'Academic block — AP Calc (1hr) → AP Physics (1hr) → Spanish (1hr)', type: 'study' },
    { startTime: '17:30', endTime: '18:30', label: gymLabel,                                                 type: 'gym'     },
    { startTime: '18:30', endTime: '19:15', label: 'Shower + dinner',                                        type: 'routine' },
    { startTime: '19:15', endTime: '20:45', label: FLOATING[dow],                                            type: 'study'   },
    { startTime: '20:45', endTime: '21:30', label: 'Night routine — wind down, PM skincare',                 type: 'routine' },
    { startTime: '21:30', endTime: '21:50', label: 'Night journal — 4 check-in questions',                   type: 'routine' },
    { startTime: '21:50', endTime: '22:00', label: 'In bed, lights off by 10:00',                            type: 'routine' },
  ]

  return raw.map((b, i) => ({ ...b, id: `default-${i}` }))
}

export function timeToMin(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + (m || 0)
}

export function minToHHMM(min: number): string {
  const h = Math.floor(min / 60)
  const m = min % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function minToDisplay(m: number): string {
  const h = Math.floor(m / 60)
  const min = m % 60
  const suffix = h >= 12 ? 'pm' : 'am'
  const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h
  return `${displayH}:${String(min).padStart(2, '0')}${suffix}`
}
```

- [ ] **Run TypeScript check**

```bash
cd "/Users/arav/Summer LOCK IN Dashboard" && npx tsc --noEmit 2>&1 | head -40
```

Expected: errors now only in `ScheduleCard.tsx` (still uses old `block.time`). Continue.

- [ ] **Commit**

```bash
cd "/Users/arav/Summer LOCK IN Dashboard" && git add src/lib/schedule.ts && git commit -m "refactor: add startTime/endTime to default schedule, export minToHHMM"
```

---

## Task 3: Create ScheduleTimeline component

**Files:**
- Create: `src/components/today/ScheduleTimeline.tsx`

- [ ] **Create the file with this exact content**

```tsx
import { useState, useRef, useEffect, useCallback } from 'react'
import { useApp } from '../../context/AppContext'
import { getDefaultSchedule, timeToMin, minToHHMM, minToDisplay } from '../../lib/schedule'
import type { ScheduleBlock, BlockType } from '../../types'

const PX_PER_MIN = 1
const DAY_START = 360   // 6:00 AM in minutes
const DAY_END = 1380    // 11:00 PM in minutes
const SNAP = 15
const RESIZE_HANDLE_PX = 8
const DRAG_THRESHOLD = 5

const TYPE_COLORS: Record<BlockType, string> = {
  build:   '#f97316',
  study:   '#3b82f6',
  gym:     '#22c55e',
  routine: '#6b7280',
  break:   '#8b5cf6',
}

interface EditState {
  blockId: string
  label: string
  type: BlockType
  startTime: string
  endTime: string
}

interface DragState {
  mode: 'move' | 'resize'
  blockId: string
  startY: number
  origStartMin: number
  origEndMin: number
}

function snapMin(min: number): number {
  return Math.round(min / SNAP) * SNAP
}

function nowMinutes(): number {
  const d = new Date()
  return d.getHours() * 60 + d.getMinutes()
}

export default function ScheduleTimeline({ date }: { date: string }) {
  const { state, dispatch } = useApp()
  const schedule: ScheduleBlock[] = (state.customSchedules?.[date] ?? getDefaultSchedule(date))

  const [edit, setEdit] = useState<EditState | null>(null)
  const [currentMin, setCurrentMin] = useState(nowMinutes())
  const dragRef = useRef<DragState | null>(null)
  const mouseDownY = useRef(0)
  const timelineRef = useRef<HTMLDivElement>(null)
  const liveScheduleRef = useRef<ScheduleBlock[]>(schedule)
  liveScheduleRef.current = schedule

  useEffect(() => {
    const id = setInterval(() => setCurrentMin(nowMinutes()), 60_000)
    return () => clearInterval(id)
  }, [])

  const save = useCallback((blocks: ScheduleBlock[]) => {
    dispatch({ type: 'SET_SCHEDULE', date, blocks })
  }, [dispatch, date])

  const totalHeight = (DAY_END - DAY_START) * PX_PER_MIN

  function blockTop(b: ScheduleBlock) {
    return (timeToMin(b.startTime) - DAY_START) * PX_PER_MIN
  }
  function blockHeight(b: ScheduleBlock) {
    return Math.max((timeToMin(b.endTime) - timeToMin(b.startTime)) * PX_PER_MIN, 15)
  }

  const hours: { label: string; top: number }[] = []
  for (let h = 6; h <= 22; h++) {
    const label = h === 12 ? '12pm' : h < 12 ? `${h}am` : `${h - 12}pm`
    hours.push({ label, top: (h * 60 - DAY_START) * PX_PER_MIN })
  }

  function onBlockMouseDown(e: React.MouseEvent, block: ScheduleBlock, mode: 'move' | 'resize') {
    e.stopPropagation()
    e.preventDefault()
    mouseDownY.current = e.clientY
    dragRef.current = {
      mode,
      blockId: block.id,
      startY: e.clientY,
      origStartMin: timeToMin(block.startTime),
      origEndMin: timeToMin(block.endTime),
    }
  }

  function onMouseMove(e: React.MouseEvent) {
    const drag = dragRef.current
    if (!drag) return
    const rawDelta = e.clientY - drag.startY
    const deltaMin = snapMin(Math.round(rawDelta / PX_PER_MIN))
    const sched = liveScheduleRef.current
    const updated = sched.map(b => {
      if (b.id !== drag.blockId) return b
      if (drag.mode === 'move') {
        const dur = drag.origEndMin - drag.origStartMin
        const newStart = Math.max(DAY_START, Math.min(DAY_END - dur, drag.origStartMin + deltaMin))
        const snapped = snapMin(newStart)
        return { ...b, startTime: minToHHMM(snapped), endTime: minToHHMM(snapped + dur) }
      } else {
        const newEnd = Math.max(drag.origStartMin + SNAP, Math.min(DAY_END, drag.origEndMin + deltaMin))
        return { ...b, endTime: minToHHMM(snapMin(newEnd)) }
      }
    })
    dispatch({ type: 'SET_SCHEDULE', date, blocks: updated })
  }

  function onMouseUp(e: React.MouseEvent) {
    const drag = dragRef.current
    if (!drag) return
    const moved = Math.abs(e.clientY - mouseDownY.current)
    if (moved < DRAG_THRESHOLD) {
      const block = liveScheduleRef.current.find(b => b.id === drag.blockId)
      if (block) {
        setEdit({ blockId: block.id, label: block.label, type: block.type, startTime: block.startTime, endTime: block.endTime })
      }
    }
    dragRef.current = null
  }

  function onTimelineClick(e: React.MouseEvent) {
    if (dragRef.current) return
    if (!timelineRef.current) return
    const rect = timelineRef.current.getBoundingClientRect()
    const y = e.clientY - rect.top
    const clickMin = snapMin(Math.round(y / PX_PER_MIN) + DAY_START)
    addBlock(clickMin)
  }

  function addBlock(startMin = DAY_START + 60) {
    const clamped = Math.max(DAY_START, Math.min(DAY_END - 60, startMin))
    const newBlock: ScheduleBlock = {
      id: `custom-${Date.now()}`,
      startTime: minToHHMM(clamped),
      endTime: minToHHMM(clamped + 60),
      label: 'New Event',
      type: 'study',
    }
    const newBlocks = [...liveScheduleRef.current, newBlock]
    save(newBlocks)
    setEdit({ blockId: newBlock.id, label: newBlock.label, type: newBlock.type, startTime: newBlock.startTime, endTime: newBlock.endTime })
  }

  function saveEdit() {
    if (!edit) return
    const updated = liveScheduleRef.current.map(b =>
      b.id === edit.blockId
        ? { ...b, label: edit.label, type: edit.type, startTime: edit.startTime, endTime: edit.endTime }
        : b
    )
    save(updated)
    setEdit(null)
  }

  function deleteBlock() {
    if (!edit) return
    save(liveScheduleRef.current.filter(b => b.id !== edit.blockId))
    setEdit(null)
  }

  const nowTop = (currentMin - DAY_START) * PX_PER_MIN
  const showNow = currentMin >= DAY_START && currentMin <= DAY_END

  return (
    <div className="card tl-card">
      <div className="tl-header">
        <div className="card-title">Schedule</div>
        <button className="tl-add-btn" onClick={() => addBlock()}>+ Add</button>
      </div>

      <div className="tl-scroll">
        <div
          className="tl-grid"
          style={{ height: totalHeight }}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onClick={onTimelineClick}
          ref={timelineRef}
        >
          {hours.map(({ label, top }) => (
            <div key={label} className="tl-hour" style={{ top }}>
              <span className="tl-hour-label">{label}</span>
              <div className="tl-hour-line" />
            </div>
          ))}

          <div className="tl-blocks">
            {schedule.map(block => (
              <div
                key={block.id}
                className="tl-block"
                style={{
                  top: blockTop(block),
                  height: blockHeight(block),
                  borderLeft: `3px solid ${TYPE_COLORS[block.type]}`,
                  background: `${TYPE_COLORS[block.type]}22`,
                }}
                onMouseDown={e => onBlockMouseDown(e, block, 'move')}
              >
                <div className="tl-block-label">{block.label}</div>
                {blockHeight(block) >= 28 && (
                  <div className="tl-block-time">
                    {minToDisplay(timeToMin(block.startTime))} – {minToDisplay(timeToMin(block.endTime))}
                  </div>
                )}
                <div
                  className="tl-resize-handle"
                  onMouseDown={e => { e.stopPropagation(); onBlockMouseDown(e, block, 'resize') }}
                />
              </div>
            ))}
          </div>

          {showNow && (
            <div className="tl-now-line" style={{ top: nowTop }}>
              <div className="tl-now-dot" />
            </div>
          )}
        </div>
      </div>

      {edit && (
        <>
          <div className="tl-edit-overlay" onClick={() => setEdit(null)} />
          <div className="tl-edit-panel" onClick={e => e.stopPropagation()}>
            <div className="tl-edit-title">Edit Block</div>
            <div className="tl-edit-row">
              <label className="tl-edit-label">Label</label>
              <input
                className="tl-edit-input"
                value={edit.label}
                onChange={e => setEdit(p => p && ({ ...p, label: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && saveEdit()}
                autoFocus
              />
            </div>
            <div className="tl-edit-row">
              <label className="tl-edit-label">Type</label>
              <select
                className="tl-edit-input"
                value={edit.type}
                onChange={e => setEdit(p => p && ({ ...p, type: e.target.value as BlockType }))}
              >
                <option value="build">Build</option>
                <option value="study">Study</option>
                <option value="routine">Routine</option>
                <option value="gym">Gym</option>
                <option value="break">Break</option>
              </select>
            </div>
            <div className="tl-edit-row">
              <label className="tl-edit-label">Start</label>
              <input
                className="tl-edit-input"
                type="time"
                value={edit.startTime}
                onChange={e => setEdit(p => p && ({ ...p, startTime: e.target.value }))}
              />
            </div>
            <div className="tl-edit-row">
              <label className="tl-edit-label">End</label>
              <input
                className="tl-edit-input"
                type="time"
                value={edit.endTime}
                onChange={e => setEdit(p => p && ({ ...p, endTime: e.target.value }))}
              />
            </div>
            <div className="tl-edit-actions">
              <button className="tl-edit-delete" onClick={deleteBlock}>Delete</button>
              <button className="tl-edit-save" onClick={saveEdit}>Save</button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
```

- [ ] **Run TypeScript check**

```bash
cd "/Users/arav/Summer LOCK IN Dashboard" && npx tsc --noEmit 2>&1 | head -40
```

Expected: errors only in `ScheduleCard.tsx` (still unreplaced). That's fine.

- [ ] **Commit**

```bash
cd "/Users/arav/Summer LOCK IN Dashboard" && git add src/components/today/ScheduleTimeline.tsx && git commit -m "feat: create ScheduleTimeline component with drag and edit panel"
```

---

## Task 4: Add timeline CSS

**Files:**
- Modify: `src/styles/today.css`

- [ ] **Append the following CSS block to the end of `src/styles/today.css`**

```css
/* ── Schedule Timeline ────────────────────────────────── */
.tl-card { position: relative; overflow: visible; }

.tl-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 12px;
}
.tl-add-btn {
  font-size: 11px; font-weight: 700; padding: 5px 12px;
  border-radius: 7px; cursor: pointer;
  background: #1a1a1a; border: 1px solid var(--border); color: #666;
  transition: all 0.1s;
}
.tl-add-btn:hover { background: #222; color: #aaa; border-color: #333; }

.tl-scroll {
  overflow-y: auto; max-height: 540px;
  border: 1px solid var(--border); border-radius: 8px;
  user-select: none;
}

.tl-grid {
  position: relative; width: 100%;
  cursor: crosshair;
}

.tl-hour {
  position: absolute; left: 0; right: 0;
  display: flex; align-items: flex-start;
  pointer-events: none;
}
.tl-hour-label {
  font-size: 10px; color: #444; line-height: 1;
  width: 36px; flex-shrink: 0; padding: 0 6px 0 4px;
  transform: translateY(-6px);
}
.tl-hour-line {
  flex: 1; height: 1px; background: #1e1e1e; margin-top: 0;
}

.tl-blocks {
  position: absolute; inset: 0; left: 36px;
}

.tl-block {
  position: absolute; left: 4px; right: 8px;
  border-radius: 4px;
  cursor: grab; overflow: hidden;
  box-sizing: border-box;
  transition: box-shadow 0.1s;
}
.tl-block:hover { box-shadow: 0 0 0 1px rgba(255,255,255,0.08); }
.tl-block:active { cursor: grabbing; }

.tl-block-label {
  font-size: 11px; font-weight: 600; color: #ccc;
  padding: 3px 6px 1px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  line-height: 1.3;
}
.tl-block-time {
  font-size: 10px; color: #666;
  padding: 0 6px 3px;
  white-space: nowrap;
}

.tl-resize-handle {
  position: absolute; bottom: 0; left: 0; right: 0;
  height: 8px; cursor: ns-resize;
  background: transparent;
}
.tl-resize-handle:hover { background: rgba(255,255,255,0.06); border-radius: 0 0 4px 4px; }

/* Current time line */
.tl-now-line {
  position: absolute; left: 0; right: 0;
  height: 2px; background: #ef4444;
  pointer-events: none; z-index: 10;
  display: flex; align-items: center;
}
.tl-now-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: #ef4444; margin-left: 28px;
  transform: translateY(-3px);
  flex-shrink: 0;
}

/* Edit panel */
.tl-edit-overlay {
  position: fixed; inset: 0; z-index: 50;
}
.tl-edit-panel {
  position: absolute; right: 0; top: 48px;
  width: 240px; z-index: 51;
  background: #111; border: 1px solid #2a2a2a;
  border-radius: 10px; padding: 14px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.6);
}
.tl-edit-title {
  font-size: 12px; font-weight: 700; color: #888;
  margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.05em;
}
.tl-edit-row { margin-bottom: 10px; }
.tl-edit-label {
  display: block; font-size: 11px; color: #555;
  margin-bottom: 4px; font-weight: 600;
}
.tl-edit-input {
  width: 100%; box-sizing: border-box;
  background: #0d0d0d; border: 1px solid var(--border);
  border-radius: 6px; color: #ccc; font-size: 12px;
  padding: 6px 9px; outline: none; font-family: inherit;
  transition: border-color 0.15s;
}
.tl-edit-input:focus { border-color: #3a3a3a; }
select.tl-edit-input { cursor: pointer; }
.tl-edit-actions {
  display: flex; gap: 8px; margin-top: 14px;
  padding-top: 12px; border-top: 1px solid #1e1e1e;
}
.tl-edit-delete {
  font-size: 11px; font-weight: 700; padding: 6px 12px;
  border-radius: 6px; cursor: pointer;
  background: #1a0a0a; border: 1px solid #3a1a1a; color: #ef4444;
  transition: background 0.1s;
}
.tl-edit-delete:hover { background: #200d0d; }
.tl-edit-save {
  flex: 1; font-size: 11px; font-weight: 700; padding: 6px 12px;
  border-radius: 6px; cursor: pointer;
  background: var(--green-bg); border: 1px solid var(--green-border); color: var(--green);
  transition: background 0.1s;
}
.tl-edit-save:hover { background: #0a200a; }
```

- [ ] **Commit**

```bash
cd "/Users/arav/Summer LOCK IN Dashboard" && git add src/styles/today.css && git commit -m "feat: add schedule timeline CSS"
```

---

## Task 5: Wire up in Today.tsx + remove ScheduleCard

**Files:**
- Modify: `src/pages/Today.tsx`
- Delete: `src/components/today/ScheduleCard.tsx`

- [ ] **Update Today.tsx**

Replace the contents of `src/pages/Today.tsx` with:

```tsx
import { todayString } from '../lib/dates'
import DayRings from '../components/today/DayRings'
import ScheduleTimeline from '../components/today/ScheduleTimeline'
import MissionCard from '../components/today/MissionCard'
import ProtocolCard from '../components/today/ProtocolCard'
import NightCheckin from '../components/today/NightCheckin'

interface Props { date?: string }

export default function Today({ date = todayString() }: Props) {
  return (
    <div className="today-page">
      <DayRings date={date} />
      <div className="two-col gap-bottom">
        <ScheduleTimeline date={date} />
        <div className="stack">
          <MissionCard date={date} />
          <ProtocolCard date={date} />
        </div>
      </div>
      <NightCheckin date={date} />
    </div>
  )
}
```

- [ ] **Delete ScheduleCard.tsx**

```bash
rm "/Users/arav/Summer LOCK IN Dashboard/src/components/today/ScheduleCard.tsx"
```

- [ ] **Run full TypeScript check — must be zero errors**

```bash
cd "/Users/arav/Summer LOCK IN Dashboard" && npx tsc --noEmit 2>&1
```

Expected output: *(nothing)* — no errors.

- [ ] **Commit**

```bash
cd "/Users/arav/Summer LOCK IN Dashboard" && git add src/pages/Today.tsx && git rm src/components/today/ScheduleCard.tsx && git commit -m "feat: wire ScheduleTimeline into Today, remove ScheduleCard"
```

---

## Task 6: Verify in browser

- [ ] **Start dev server**

```bash
cd "/Users/arav/Summer LOCK IN Dashboard" && npm run dev
```

- [ ] **Check these things in the browser at http://localhost:5173:**
  1. Today page shows a scrollable timeline with proportional blocks (Deep Work I should be 3× taller than a 15-min wake block)
  2. A thin red line with a circle on the left appears at the current time
  3. Dragging a block body up/down moves it and snaps to 15-min grid
  4. Dragging the bottom resize handle changes only the end time
  5. Clicking a block (without dragging) opens the edit panel with correct fields
  6. Saving the edit panel updates the block on the timeline
  7. Deleting from the edit panel removes the block
  8. Clicking `[+ Add]` creates a new block and opens the edit panel
  9. Clicking empty timeline space creates a block at that time
  10. Calendar day pages (`/day/2026-05-30`) show the same timeline correctly
