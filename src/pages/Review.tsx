import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { todayString, getWeekNumber } from '../lib/dates'
import { getWeekRange, getWeekHabitPct } from '../lib/stats'
import type { WeeklyReview } from '../types'

const TOTAL_WEEKS = 11

const QUESTIONS: { field: keyof Omit<WeeklyReview, 'weekNumber' | 'habitPct' | 'rating' | 'savedAt'>; label: string; placeholder: string }[] = [
  { field: 'built',          label: 'What did I actually build or complete this week?',            placeholder: 'Shipped X, finished Y, made progress on Z…' },
  { field: 'blockers',       label: 'What blocked me or wasted the most time?',                    placeholder: 'Distraction, unclear task, bad sleep…' },
  { field: 'monkMode',       label: 'Did I hold Monk Mode? If not, where did I slip?',             placeholder: 'Honest answer — sugar, phone, late night…' },
  { field: 'nextWeekFocus',  label: "What's the single most important thing to accomplish next week?", placeholder: 'One specific outcome, not a list…' },
  { field: 'gutCheck',       label: 'How am I feeling — honest gut check.',                        placeholder: 'Energy, confidence, clarity, doubt…' },
]

function weekLabel(n: number) {
  return n <= TOTAL_WEEKS ? `Week ${n}` : null
}

export default function Review() {
  const { state, dispatch } = useApp()
  const today = todayString()
  const currentWeek = getWeekNumber(today) ?? 1

  const [viewingWeek, setViewingWeek] = useState(Math.min(currentWeek, TOTAL_WEEKS))
  const [expandedArchive, setExpandedArchive] = useState<number | null>(null)

  const { start, end, label: rangeLabel } = getWeekRange(viewingWeek)
  const habitPct = getWeekHabitPct(state.logs, viewingWeek)
  const saved = state.weeklyReviews?.[viewingWeek]

  // Draft state (pre-fill from saved if exists)
  const [draft, setDraft] = useState<Record<string, string>>(() => ({
    built:         saved?.built         ?? '',
    blockers:      saved?.blockers      ?? '',
    monkMode:      saved?.monkMode      ?? '',
    nextWeekFocus: saved?.nextWeekFocus ?? '',
    gutCheck:      saved?.gutCheck      ?? '',
  }))
  const [rating, setRating] = useState(saved?.rating ?? 0)
  const [savePulse, setSavePulse] = useState(false)

  function switchWeek(n: number) {
    if (n < 1 || n > TOTAL_WEEKS) return
    setViewingWeek(n)
    const s = state.weeklyReviews?.[n]
    setDraft({
      built:         s?.built         ?? '',
      blockers:      s?.blockers      ?? '',
      monkMode:      s?.monkMode      ?? '',
      nextWeekFocus: s?.nextWeekFocus ?? '',
      gutCheck:      s?.gutCheck      ?? '',
    })
    setRating(s?.rating ?? 0)
  }

  function saveReview() {
    const review: WeeklyReview = {
      weekNumber:    viewingWeek,
      habitPct:      getWeekHabitPct(state.logs, viewingWeek),
      built:         draft.built,
      blockers:      draft.blockers,
      monkMode:      draft.monkMode,
      rating,
      nextWeekFocus: draft.nextWeekFocus,
      gutCheck:      draft.gutCheck,
      savedAt:       new Date().toISOString(),
    }
    dispatch({ type: 'SAVE_WEEKLY_REVIEW', review })
    setSavePulse(true)
    setTimeout(() => setSavePulse(false), 2000)
  }

  const isFuture = viewingWeek > (currentWeek ?? 0)
  const completedWeeks = Array.from({ length: TOTAL_WEEKS }, (_, i) => i + 1)
    .filter(w => state.weeklyReviews?.[w])

  return (
    <div className="review-page">
      {/* Week navigation */}
      <div className="card review-header-card gap-bottom">
        <div className="review-nav">
          <button className="review-nav-btn" onClick={() => switchWeek(viewingWeek - 1)} disabled={viewingWeek <= 1}>←</button>
          <div className="review-nav-center">
            <div className="review-week-label">Week {viewingWeek} Review</div>
            <div className="review-date-range">{rangeLabel}, 2026</div>
          </div>
          <button className="review-nav-btn" onClick={() => switchWeek(viewingWeek + 1)} disabled={viewingWeek >= TOTAL_WEEKS}>→</button>
        </div>

        {/* Habit % bar */}
        <div className="review-habit-bar">
          <div className="review-habit-label">
            <span>Habit completion this week</span>
            <span className="review-habit-pct" style={{ color: habitPct >= 80 ? 'var(--green)' : habitPct >= 60 ? 'var(--orange)' : 'var(--red)' }}>
              {habitPct}%
            </span>
          </div>
          <div className="review-bar-track">
            <div className="review-bar-fill" style={{ width: `${habitPct}%`, background: habitPct >= 80 ? 'var(--green)' : habitPct >= 60 ? 'var(--orange)' : 'var(--red)' }} />
          </div>
          <div className="review-bar-hint">Reflect honestly — this is your data, not a grade.</div>
        </div>
      </div>

      {/* Questions */}
      {isFuture ? (
        <div className="card review-future">
          <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>This week hasn't started yet. Come back on {start}.</div>
        </div>
      ) : (
        <div className="card gap-bottom">
          {QUESTIONS.map(({ field, label, placeholder }) => (
            <div key={field} className="review-q-block">
              <div className="review-q-label">{label}</div>
              <textarea
                className="review-textarea"
                placeholder={placeholder}
                value={draft[field]}
                onChange={e => setDraft(d => ({ ...d, [field]: e.target.value }))}
                rows={3}
              />
            </div>
          ))}

          {/* Rating */}
          <div className="review-q-block">
            <div className="review-q-label">Rate the week — one number, no justification needed.</div>
            <div className="review-rating-row">
              {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  className={`review-rating-btn ${rating === n ? 'active' : ''}`}
                  onClick={() => setRating(n)}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div className="review-save-row">
            {saved && <span className="review-saved-stamp">Last saved {new Date(saved.savedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>}
            <button className="review-save-btn" onClick={saveReview}>
              {savePulse ? '✓ Saved' : saved ? 'Update Review' : 'Save Review'}
            </button>
          </div>
        </div>
      )}

      {/* Archive */}
      <div className="card">
        <div className="card-title">Archive — all 11 weeks</div>
        <div className="card-sub">{completedWeeks.length} of 11 weeks reviewed</div>
        <div className="review-archive-grid">
          {Array.from({ length: TOTAL_WEEKS }, (_, i) => i + 1).map(w => {
            const r = state.weeklyReviews?.[w]
            const { label: wLabel } = getWeekRange(w)
            const isExpanded = expandedArchive === w
            return (
              <div key={w} className={`review-archive-card ${r ? 'filled' : 'empty'} ${isExpanded ? 'expanded' : ''}`}
                onClick={() => r && setExpandedArchive(isExpanded ? null : w)}>
                <div className="review-archive-top">
                  <span className="review-archive-week">Wk {w}</span>
                  {r ? (
                    <>
                      <span className="review-archive-rating" style={{ color: r.rating >= 7 ? 'var(--green)' : r.rating >= 5 ? 'var(--orange)' : 'var(--red)' }}>{r.rating}/10</span>
                      <span className="review-archive-pct">{r.habitPct}%</span>
                    </>
                  ) : (
                    <span className="review-archive-empty-label">{w <= (currentWeek ?? 0) ? 'not yet' : '—'}</span>
                  )}
                </div>
                {isExpanded && r && (
                  <div className="review-archive-detail">
                    <div className="review-archive-range">{wLabel}</div>
                    {QUESTIONS.map(({ field, label }) => r[field as keyof typeof r] ? (
                      <div key={field} className="review-archive-entry">
                        <div className="review-archive-q">{label}</div>
                        <div className="review-archive-a">{String(r[field as keyof typeof r])}</div>
                      </div>
                    ) : null)}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
