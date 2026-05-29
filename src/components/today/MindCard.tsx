import { useApp } from '../../context/AppContext'
import { todayString, getDayNumber } from '../../lib/dates'
import { getTotalBibleChapters, getTotalReadingPages } from '../../lib/stats'
import { JOURNAL_PROMPTS, DEFAULT_JOURNAL_PROMPT } from '../../lib/constants'

export default function MindCard() {
  const { state, dispatch } = useApp()
  const today = todayString()
  const log = state.logs[today]
  const dayNum = getDayNumber(today) ?? 1
  const bibleChapters = getTotalBibleChapters(state.logs)
  const readingPages = getTotalReadingPages(state.logs)
  const speakingVideos = Object.values(state.logs).filter(l => l.speakingVideo).length
  const prompt = JOURNAL_PROMPTS[dayNum] ?? DEFAULT_JOURNAL_PROMPT

  const readingPct = Math.min(100, Math.round((readingPages / 280) * 100))
  const biblePct = Math.min(100, Math.round((bibleChapters / 31) * 100))

  return (
    <div className="card">
      <div className="card-title">Mind</div>
      <div className="card-sub">Reading, spirit, speaking</div>
      <div className="prog-item">
        <div className="prog-head">
          <div className="prog-name">Atomic Habits</div>
          <div className="prog-pct">{readingPages} / ~280 pages</div>
        </div>
        <div className="prog-bar"><div className="prog-fill purple" style={{ width: `${readingPct}%` }} /></div>
        <div className="prog-note">Goal: finish by Week 4</div>
      </div>
      <div className="prog-item">
        <div className="prog-head">
          <div className="prog-name">Proverbs</div>
          <div className="prog-pct">Ch. {bibleChapters} / 31</div>
        </div>
        <div className="prog-bar"><div className="prog-fill teal" style={{ width: `${biblePct}%` }} /></div>
        <div className="prog-note">1 chapter per day</div>
      </div>
      <div className="habit-row" style={{ marginTop: 4 }}>
        <div className="habit-left">
          <div className="habit-icon">🎤</div>
          <div>
            <div className="habit-name">Weekly Speaking Video</div>
            <div className="habit-freq">2 min · every week · 10 total</div>
          </div>
        </div>
        <div className="habit-right">
          <span className={`streak-badge ${speakingVideos > 0 ? 'active' : 'zero'}`}>{speakingVideos} / 10</span>
          <div
            className={`cb ${log?.speakingVideo ? 'done' : ''}`}
            onClick={() => dispatch({ type: 'TOGGLE_SPEAKING_VIDEO', date: today })}
          >
            {log?.speakingVideo ? '✓' : ''}
          </div>
        </div>
      </div>
      <div className="journal-box">
        <div className="journal-box-label">Tonight's Journal Prompt</div>
        <div className="journal-box-text">"{prompt}"</div>
      </div>
    </div>
  )
}
