import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { defaultDayLog } from '../../lib/defaults'

const QUESTIONS: { field: 'workBlocks' | 'built' | 'blockers' | 'tomorrow'; q: string }[] = [
  { field: 'workBlocks', q: 'Did I protect the work blocks today?' },
  { field: 'built',      q: 'What actually got built or done?' },
  { field: 'blockers',   q: 'What blocked me or wasted time?' },
  { field: 'tomorrow',   q: "What's the one thing I'm doing first tomorrow?" },
]

export default function NightCheckin({ date }: { date: string }) {
  const { state, dispatch } = useApp()
  const log = state.logs[date] ?? defaultDayLog(date)

  const [draft, setDraft] = useState({
    workBlocks: log.checkinWorkBlocks ?? '',
    built:      log.checkinBuilt ?? '',
    blockers:   log.checkinBlockers ?? '',
    tomorrow:   log.checkinTomorrow ?? '',
  })
  const [saved, setSaved] = useState(false)

  // Sync if log changes from outside
  useEffect(() => {
    setDraft({
      workBlocks: log.checkinWorkBlocks ?? '',
      built:      log.checkinBuilt ?? '',
      blockers:   log.checkinBlockers ?? '',
      tomorrow:   log.checkinTomorrow ?? '',
    })
  }, [date])

  function save() {
    const fields: Array<'workBlocks' | 'built' | 'blockers' | 'tomorrow'> = ['workBlocks', 'built', 'blockers', 'tomorrow']
    fields.forEach(f => dispatch({ type: 'SET_CHECKIN', date, field: f, value: draft[f] }))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const allAnswered = Object.values(draft).every(v => v.trim().length > 0)

  return (
    <div className="card gap-bottom">
      <div className="card-title">Night Check-in</div>
      <div className="card-sub">4 questions · 5 minutes · every night before bed</div>

      {QUESTIONS.map(({ field, q }) => (
        <div key={field} className="checkin-row">
          <div className="checkin-q">{q}</div>
          <textarea
            className="checkin-input"
            placeholder="…"
            value={draft[field]}
            onChange={e => setDraft(d => ({ ...d, [field]: e.target.value }))}
            rows={2}
          />
        </div>
      ))}

      <div className="checkin-footer">
        <button
          className={`checkin-save-btn ${allAnswered ? 'ready' : ''}`}
          onClick={save}
        >
          {saved ? '✓ Saved' : 'Save Check-in'}
        </button>
        {log.checkinBuilt && !saved && (
          <span className="checkin-status">Last saved today</span>
        )}
      </div>
    </div>
  )
}
