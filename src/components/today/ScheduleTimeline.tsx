import { useState, useRef, useEffect, useCallback } from 'react'
import { useApp } from '../../context/AppContext'
import { getDefaultSchedule, timeToMin, minToHHMM, minToDisplay } from '../../lib/schedule'
import type { ScheduleBlock, BlockType } from '../../types'

const PX_PER_MIN = 1
const DAY_START = 360   // 6:00 AM in minutes
const DAY_END = 1380    // 11:00 PM in minutes
const SNAP = 15
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
  const [draftBlocks, setDraftBlocks] = useState<ScheduleBlock[] | null>(null)
  const draftRef = useRef<ScheduleBlock[] | null>(null)
  const dragRef = useRef<DragState | null>(null)
  const mouseDownY = useRef(0)
  const lastTouchY = useRef(0)
  const wasDragRef = useRef(false)
  const timelineRef = useRef<HTMLDivElement>(null)
  const displaySchedule: ScheduleBlock[] = draftBlocks ?? schedule
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
  for (let h = 6; h <= 23; h++) {
    const label = h === 12 ? '12pm' : h < 12 ? `${h}am` : `${h - 12}pm`
    hours.push({ label, top: (h * 60 - DAY_START) * PX_PER_MIN })
  }

  function onBlockMouseDown(e: React.MouseEvent, block: ScheduleBlock, mode: 'move' | 'resize') {
    if (e.button !== 0) return
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
    const deltaMin = snapMin(rawDelta)
    const sched = liveScheduleRef.current
    const updated = sched.map(b => {
      if (b.id !== drag.blockId) return b
      if (drag.mode === 'move') {
        const dur = drag.origEndMin - drag.origStartMin
        const rawStart = Math.max(DAY_START, Math.min(DAY_END - dur, drag.origStartMin + rawDelta))
        const newStart = snapMin(rawStart)
        return { ...b, startTime: minToHHMM(newStart), endTime: minToHHMM(newStart + dur) }
      } else {
        const newEnd = Math.max(drag.origStartMin + SNAP, Math.min(DAY_END, drag.origEndMin + deltaMin))
        return { ...b, endTime: minToHHMM(snapMin(newEnd)) }
      }
    })
    draftRef.current = updated
    setDraftBlocks(updated)
  }

  function onMouseUp(e: React.MouseEvent) {
    const drag = dragRef.current
    if (!drag) return
    const moved = Math.abs(e.clientY - mouseDownY.current)
    wasDragRef.current = moved >= DRAG_THRESHOLD
    if (moved < DRAG_THRESHOLD) {
      const block = liveScheduleRef.current.find(b => b.id === drag.blockId)
      if (block) {
        setEdit({ blockId: block.id, label: block.label, type: block.type, startTime: block.startTime, endTime: block.endTime })
      }
    }
    dragRef.current = null
    if (draftRef.current) {
      save(draftRef.current)
      draftRef.current = null
      setDraftBlocks(null)
    }
  }

  function onTimelineClick(e: React.MouseEvent) {
    if (wasDragRef.current) { wasDragRef.current = false; return }
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
          onTouchMove={e => {
            const touch = e.touches[0]
            lastTouchY.current = touch.clientY
            onMouseMove({ clientY: touch.clientY } as React.MouseEvent)
          }}
          onTouchEnd={() => {
            onMouseUp({ clientY: lastTouchY.current } as React.MouseEvent)
          }}
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
            {displaySchedule.map(block => (
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
