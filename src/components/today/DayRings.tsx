import { useEffect, useState } from 'react'
import { useApp } from '../../context/AppContext'
import { getHabitsCompletedToday } from '../../lib/stats'
import { defaultDayLog } from '../../lib/defaults'

interface RingProps {
  pct: number
  value: string
  label: string
  color: string
  children?: React.ReactNode
}

function Ring({ pct, value, label, color, children }: RingProps) {
  const [drawn, setDrawn] = useState(0)
  useEffect(() => {
    setDrawn(0)
    const t = setTimeout(() => setDrawn(Math.min(pct, 100)), 100)
    return () => clearTimeout(t)
  }, [pct])

  const r = 40
  const circ = 2 * Math.PI * r
  const offset = circ - (circ * drawn) / 100

  return (
    <div className="dr-wrap">
      <div className="dr-svg-outer">
        <svg viewBox="0 0 100 100" width="96" height="96">
          <circle cx="50" cy="50" r={r} fill="none" stroke="#1d1d1d" strokeWidth="7" />
          <circle
            cx="50" cy="50" r={r} fill="none"
            stroke={color} strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            transform="rotate(-90 50 50)"
            style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)' }}
          />
        </svg>
        <div className="dr-center-val">{value}</div>
      </div>
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


function NumberInput({ value, onSet, placeholder, unit }: { value: number; onSet: (n: number) => void; placeholder: string; unit?: string }) {
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

  const habitsPct  = Math.round((habitsToday / 8) * 100)
  const waterPct   = Math.min(100, Math.round((water / 2) * 100))
  const proteinPct = Math.min(100, Math.round((protein / 120) * 100))
  const buildPct   = Math.min(100, Math.round((buildHours / 6) * 100))
  const pushuPct   = Math.min(100, Math.round((pushups / 50) * 100))

  return (
    <div className="day-rings-card card gap-bottom">
      <div className="dr-row">
        <Ring pct={habitsPct} value={`${habitsToday}/8`} label="Habits" color="#22c55e" />

        <Ring pct={waterPct} value={`${water}/2`} label="Water" color="#3b82f6">
          <Clicker
            value={water}
            onMinus={() => dispatch({ type: 'SET_WATER_BOTTLES', date, count: water - 1 })}
            onPlus={() => dispatch({ type: 'SET_WATER_BOTTLES', date, count: water + 1 })}
            unit=" btl"
          />
        </Ring>

        <Ring pct={proteinPct} value={`${protein}g`} label="Protein" color="#a855f7">
          <NumberInput
            value={protein}
            onSet={g => dispatch({ type: 'SET_PROTEIN_GRAMS', date, grams: g })}
            placeholder="0g"
          />
        </Ring>

        <Ring pct={buildPct} value={`${buildHours.toFixed(1)}h`} label="Build Hrs" color="#fb923c">
          <Clicker
            value={buildHours}
            onMinus={() => dispatch({ type: 'SET_BUILD_HOURS', date, hours: Math.round((buildHours - 0.5) * 10) / 10 })}
            onPlus={() => dispatch({ type: 'SET_BUILD_HOURS', date, hours: Math.round((buildHours + 0.5) * 10) / 10 })}
            unit="h"
            step={0.5}
          />
        </Ring>

        <Ring pct={pushuPct} value={`${pushups}/50`} label="Push-ups" color="#14b8a6">
          <NumberInput
            value={pushups}
            onSet={n => dispatch({ type: 'SET_PUSHUPS', date, count: n })}
            placeholder="0"
          />
        </Ring>
      </div>
    </div>
  )
}
