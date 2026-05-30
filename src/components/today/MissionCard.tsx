import { useState, KeyboardEvent } from 'react'
import { useApp } from '../../context/AppContext'

export default function MissionCard({ date }: { date: string }) {
  const { state, dispatch } = useApp()
  const today = date
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
        <div
          key={task.id}
          className={`task-item ${task.done ? 'done' : ''}`}
        >
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
        <div style={{ color: 'var(--text-dim)', fontSize: 12, padding: '4px 0 8px' }}>
          No tasks yet — add your mission below
        </div>
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
