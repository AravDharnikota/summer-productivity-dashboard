import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { getHabitsCompletedToday } from '../../lib/stats'
import { defaultDayLog } from '../../lib/defaults'

interface MetricProps {
  value: string
  label: string
  color: string
  children?: React.ReactNode
}

function Metric({ value, label, color, children }: MetricProps) {
  return (
    <div className="dr-wrap">
      <div className="dr-number" style={{ color }}>{value}</div>
      <div className="dr-label">{label}</div>
      {children && <div className="dr-clicker">{children}</div>}
    </div>
  )
}

interface ClickerProps {
  value: number
  onMinus: () => void
  onPlus: () => void
  unit?: string
  step?: number
}

function Clicker({ value, onMinus, onPlus, unit = '', step }: ClickerProps) {
  return (
    <div className="clicker-row">
      <button className="clicker-btn" onClick={onMinus}>−</button>
      <span className="clicker-val">{step && step < 1 ? value.toFixed(1) : value}{unit}</span>
      <button className="clicker-btn" onClick={onPlus}>+</button>
    </div>
  )
}

function NumberInput({ onSet, placeholder }: { value: number; onSet: (n: number) => void; placeholder: string }) {
  const [val, setVal] = useState('')
  function submit() {
    const n = parseInt(val, 10)
    if (!isNaN(n) && n >= 0) onSet(n)
    setVal('')
  }
  return (
    <div className="protein-input-row">
      <input
        className="protein-input"
        type="number"
        min={0}
        placeholder={placeholder}
        value={val}
        onChange={e => setVal(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') submit() }}
      />
      <button className="protein-add-btn" onClick={submit}>Set</button>
    </div>
  )
}

export default function DayRings({ date }: { date: string }) {
  const { state, dispatch } = useApp()
  const log = state.logs[date] ?? defaultDayLog(date)

  const habitsToday = getHabitsCompletedToday(log)
  const water       = log.waterBottles ?? 0
  const protein     = log.proteinGrams ?? 0
  const buildHours  = log.buildHours ?? 0
  const pushups     = log.pushups ?? 0

  return (
    <div className="day-rings-card card gap-bottom">
      <div className="dr-row">
        <Metric value={`${habitsToday}/8`} label="Habits" color="#22c55e" />

        <Metric value={`${water}/2`} label="Water" color="#3b82f6">
          <Clicker
            value={water}
            onMinus={() => dispatch({ type: 'SET_WATER_BOTTLES', date, count: water - 1 })}
            onPlus={() => dispatch({ type: 'SET_WATER_BOTTLES', date, count: water + 1 })}
            unit=" btl"
          />
        </Metric>

        <Metric value={`${protein}g`} label="Protein" color="#a855f7">
          <NumberInput
            value={protein}
            onSet={g => dispatch({ type: 'SET_PROTEIN_GRAMS', date, grams: g })}
            placeholder="0g"
          />
        </Metric>

        <Metric value={`${buildHours.toFixed(1)}h`} label="Build Hrs" color="#fb923c">
          <Clicker
            value={buildHours}
            onMinus={() => dispatch({ type: 'SET_BUILD_HOURS', date, hours: Math.round((buildHours - 0.5) * 10) / 10 })}
            onPlus={() => dispatch({ type: 'SET_BUILD_HOURS', date, hours: Math.round((buildHours + 0.5) * 10) / 10 })}
            unit="h"
            step={0.5}
          />
        </Metric>

        <Metric value={`${pushups}/50`} label="Push-ups" color="#14b8a6">
          <NumberInput
            value={pushups}
            onSet={n => dispatch({ type: 'SET_PUSHUPS', date, count: n })}
            placeholder="0"
          />
        </Metric>
      </div>
    </div>
  )
}
