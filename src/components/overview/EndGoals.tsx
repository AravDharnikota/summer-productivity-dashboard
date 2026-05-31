import { useState, useEffect } from 'react'

interface Goal {
  id: string
  label: string
  sub: string
}

interface Category {
  label: string
  color: string
  goals: Goal[]
}

const CATEGORIES: Category[] = [
  {
    label: 'Personal',
    color: '#a855f7',
    goals: [
      {
        id: 'fitness',
        label: 'Complete 50+ gym sessions',
        sub: 'Strength training + cardio tracked daily · visible progress by end of summer',
      },
      {
        id: 'pushups',
        label: '50 push-ups — every day',
        sub: 'Hit 50 push-ups daily · tracked in the daily metrics · builds progressively',
      },
      {
        id: 'diet',
        label: 'Clean diet — no sugar/junk',
        sub: 'No processed food, candy, or fast food · 120g+ protein daily · consistent',
      },
      {
        id: 'reading',
        label: 'Read 2 full books',
        sub: 'One book per month · no summaries · full read-throughs only',
      },
      {
        id: 'journal',
        label: '70-entry journal streak',
        sub: 'Daily evening check-in · Sunday longer reflection · no gaps allowed',
      },
      {
        id: 'meditation',
        label: 'Meditation — 70 sessions',
        sub: '10 min every morning · breathwork or guided · builds focus and clarity',
      },
    ],
  },
  {
    label: 'Academic',
    color: '#3b82f6',
    goals: [
      {
        id: 'course1',
        label: 'AP Calc AB — complete + pass',
        sub: 'Units 1–8 · proficient on every unit · Course Challenge by end of summer',
      },
      {
        id: 'course2',
        label: 'AP Physics 1 — complete + pass',
        sub: 'Units 1–8 · proficient on every unit · Course Challenge by end of summer',
      },
      {
        id: 'course3',
        label: 'Language — conversational fluency',
        sub: 'Grammar + vocabulary · hold a full conversation by Week 10',
      },
    ],
  },
  {
    label: 'Entrepreneurial',
    color: '#22c55e',
    goals: [
      {
        id: 'project',
        label: 'Ship main project — MVP v1',
        sub: 'Core feature complete · deployed and accessible · presented by end of summer',
      },
      {
        id: 'course4',
        label: 'Finish primary online course',
        sub: 'All lectures + assignments complete · applied directly to project build',
      },
      {
        id: 'course5',
        label: 'Finish secondary online course',
        sub: 'Complete curriculum · skills feeding directly into project architecture',
      },
    ],
  },
]

const STORAGE_KEY = 'lockin-end-goals-v2'

export default function EndGoals() {
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') } catch { return {} }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checked))
  }, [checked])

  const toggle = (id: string) => setChecked(prev => ({ ...prev, [id]: !prev[id] }))

  const totalGoals = CATEGORIES.reduce((s, c) => s + c.goals.length, 0)
  const doneCount  = Object.values(checked).filter(Boolean).length

  return (
    <div className="card">
      <div className="card-title">End Goals</div>
      <div className="card-sub">{doneCount}/{totalGoals} achieved · end-of-summer deadline</div>

      {CATEGORIES.map(cat => (
        <div key={cat.label} className="eg-category">
          <div className="eg-cat-label" style={{ color: cat.color }}>{cat.label}</div>
          {cat.goals.map(g => (
            <div
              key={g.id}
              className={`eg-row ${checked[g.id] ? 'done' : ''}`}
              onClick={() => toggle(g.id)}
            >
              <div className={`eg-check ${checked[g.id] ? 'done' : ''}`}>
                {checked[g.id] && '✓'}
              </div>
              <div className="eg-text">
                <div className="eg-label">{g.label}</div>
                <div className="eg-sub">{g.sub}</div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
