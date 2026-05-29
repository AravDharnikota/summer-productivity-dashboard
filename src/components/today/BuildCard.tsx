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
  const dayNum = (getDayNumber(today) ?? 1) - 1
  const pct = Math.round((dayNum / TOTAL_DAYS) * 100)

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
        <div className="prog-bar">
          <div className="prog-fill green" style={{ width: `${pct}%` }} />
        </div>
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
        <input
          className="add-task-input"
          placeholder="Add a build task…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKey}
        />
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
