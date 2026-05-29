import { useApp } from '../../context/AppContext'
import { todayString, getWeekNumber } from '../../lib/dates'

const DEFAULT_GOALS = {
  build: {
    summer: 'Ship working v1 of AI Teacher (voice + avatar)',
    week: 'Scaffold project, pick tech stack, first voice prototype',
    today: 'Repo live · API researched · first commit pushed',
  },
  academics: {
    summer: 'Calc + Physics Units 1–8 Proficient+. Spanish conversational.',
    week: 'Calc Unit 1 · Physics Unit 1 · Spanish Wk 1',
    today: '1h each subject — lock in the habit from day 1',
  },
  personal: {
    summer: 'Become unrecognizable — body, mind, spirit, discipline',
    week: 'Every habit from day 1. No exceptions. Build the streak.',
    today: 'All 8 protocol items · Day 1 photo · first journal',
  },
}

export default function GoalCascade() {
  const { state } = useApp()
  const today = todayString()
  const weekNum = getWeekNumber(today) ?? 1
  const weekGoals = state.weekGoals[weekNum]

  const cols = [
    { key: 'build',     label: 'Build',     className: 'build',     goals: weekGoals?.build     ?? DEFAULT_GOALS.build },
    { key: 'academics', label: 'Academics', className: 'academics', goals: weekGoals?.academics ?? DEFAULT_GOALS.academics },
    { key: 'personal',  label: 'Personal',  className: 'personal',  goals: weekGoals?.personal  ?? DEFAULT_GOALS.personal },
  ]

  return (
    <div className="card gap-bottom">
      <div className="card-title">Goal Cascade</div>
      <div className="card-sub">How today connects to the summer</div>
      <div className="goal-cascade-cols">
        {cols.map(col => (
          <div key={col.key}>
            <div className={`gc-col-label ${col.className}`}>{col.label}</div>
            <div className="gc-block summer">
              <div className="gc-tier">Summer</div>
              {col.goals.summer}
            </div>
            <div className="gc-block week">
              <div className="gc-tier">This Week</div>
              {col.goals.week}
            </div>
            <div className="gc-block today">
              <div className="gc-tier">Today</div>
              {col.goals.today}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
