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
        id: 'body',
        label: 'Body — build + lean out',
        sub: '50+ gym sessions tracked · visible muscle definition · run 2 miles non-stop by Aug 17',
      },
      {
        id: 'pushups',
        label: '50 push-ups — daily',
        sub: 'Hit 50 push-ups every single day · track in the daily rings · builds to the goal progressively',
      },
      {
        id: 'diet',
        label: 'Diet — zero sugar, zero junk',
        sub: 'No candy, soda, chips, fast food, desserts · 120g+ protein daily · meal prep Sundays',
      },
      {
        id: 'skin',
        label: 'Skin + appearance glow-up',
        sub: 'AM/PM skincare every day · cold shower every morning · Day 1 vs Day 70 comparison photo',
      },
      {
        id: 'reading',
        label: 'Read 2 full books',
        sub: 'Atomic Habits by Week 4 · How to Win Friends & Influence People by Week 8 · no summaries',
      },
      {
        id: 'journal',
        label: '70-entry journal streak',
        sub: '4 Monk Mode check-ins nightly · Sunday longer reflection every week · no gaps',
      },
      {
        id: 'spirit',
        label: 'Spirit — prayer + Bhagavad Gita',
        sub: '10–15 min intentional prayer every morning · read all 18 chapters of Bhagavad Gita',
      },
      {
        id: 'voice',
        label: 'Voice — 10 speaking videos',
        sub: '2-minute on-camera recording once per week · watch them back · Week 10 vs Week 1 visible growth',
      },
      {
        id: 'meditation',
        label: 'Meditation — 70 sessions',
        sub: '10 min every morning after prayer · Waking Up app or silent breathwork · trains deep focus',
      },
    ],
  },
  {
    label: 'Academic',
    color: '#3b82f6',
    goals: [
      {
        id: 'calc',
        label: 'AP Calc AB — complete + pass',
        sub: 'Units 1–8 Khan Academy · proficient on every unit test · Course Challenge by Aug 17',
      },
      {
        id: 'physics',
        label: 'AP Physics 1 — complete + pass',
        sub: 'Units 1–8 Khan Academy · proficient on every unit test · Course Challenge by Aug 17',
      },
      {
        id: 'spanish',
        label: 'Spanish — conversational fluency',
        sub: 'All Spanish 2 grammar + vocab · hold a full conversation · become fluent',
      },
    ],
  },
  {
    label: 'Entrepreneurial',
    color: '#22c55e',
    goals: [
      {
        id: 'app',
        label: 'Ship AI Teacher MVP v1',
        sub: 'Voice + avatar interface · one subject · built for underserved communities · deployed by Aug 14',
      },
      {
        id: 'modernai',
        label: 'Finish Modern AI Course',
        sub: 'All lectures + homeworks complete · applied to the project build',
      },
      {
        id: 'agents',
        label: 'Finish AI Agents Course',
        sub: 'Complete curriculum · agent skills feeding directly into AI Teacher architecture',
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
      <div className="card-sub">{doneCount}/{totalGoals} achieved · Aug 17, 2026 deadline</div>

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
