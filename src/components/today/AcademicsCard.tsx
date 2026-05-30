import { getDayNumber } from '../../lib/dates'

const SUBJECTS = [
  { name: 'AP Calculus AB', color: 'blue' as const, totalDays: 55, defaultToday: 'Limits: An Intuitive Approach (Unit 1.1)' },
  { name: 'AP Physics 1',   color: 'blue' as const, totalDays: 55, defaultToday: 'Kinematics: Position & Velocity (Unit 1.1)' },
  { name: 'Spanish 3',      color: 'orange' as const, totalDays: 55, defaultToday: 'Vocab Set 1 · Presente de Indicativo' },
]

export default function AcademicsCard({ date }: { date: string }) {
  const dayNum = (getDayNumber(date) ?? 1) - 1

  return (
    <div className="card">
      <div className="card-title">Academics</div>
      <div className="card-sub">1 hour each · every day</div>
      {SUBJECTS.map(subject => {
        const pct = Math.min(100, Math.round((dayNum / subject.totalDays) * 100))
        const unitsDone = Math.min(8, Math.floor((dayNum / subject.totalDays) * 8))
        return (
          <div key={subject.name} className="prog-item">
            <div className="prog-head">
              <div className="prog-name">{subject.name}</div>
              <div className="prog-pct">Unit {unitsDone + 1} / 8</div>
            </div>
            <div className="prog-bar">
              <div className={`prog-fill ${subject.color}`} style={{ width: `${pct}%` }} />
            </div>
            <div className="prog-note">Today → {subject.defaultToday}</div>
          </div>
        )
      })}
    </div>
  )
}
