import { useApp } from '../../context/AppContext'
import { getTotalGymSessions, getTotalBibleChapters, getTotalReadingPages } from '../../lib/stats'

export default function MilestonesCard() {
  const { state } = useApp()
  const gymSessions = getTotalGymSessions(state.logs)
  const bibleChapters = getTotalBibleChapters(state.logs)
  const readingPages = getTotalReadingPages(state.logs)
  const speakingVideos = Object.values(state.logs).filter(l => l.speakingVideo).length
  const journalEntries = Object.values(state.logs).filter(l => l.journalEntry.trim().length > 0).length

  const milestones = [
    { text: '50+ gym sessions',              tag: `${gymSessions} / 50`,  done: gymSessions >= 50,    type: 'count' },
    { text: 'Run 2 miles continuously',      tag: 'pending',              done: false,                type: 'pending' },
    { text: 'Finish Atomic Habits',          tag: `${readingPages}/280p`, done: readingPages >= 280,  type: 'count' },
    { text: 'Finish HTWFAIP / Like Switch',  tag: 'Week 8',               done: false,                type: 'pending' },
    { text: 'Proverbs cover to cover',       tag: `Ch ${bibleChapters}/31`, done: bibleChapters >= 31, type: 'count' },
    { text: '10 speaking videos',            tag: `${speakingVideos}/10`, done: speakingVideos >= 10, type: 'count' },
    { text: '70 journal entries',            tag: `${journalEntries}/70`, done: journalEntries >= 70, type: 'count' },
    { text: 'Modern AI course complete',     tag: 'stretch',              done: false,                type: 'stretch' },
    { text: 'Claude/AI mastery course',      tag: 'stretch',              done: false,                type: 'stretch' },
  ]

  return (
    <div className="card">
      <div className="card-title">Personal Milestones</div>
      <div className="card-sub">End of summer targets</div>
      {milestones.map((m, i) => (
        <div key={i} className="milestone">
          <div className={`milestone-dot ${m.done ? 'done' : 'open'}`} />
          <div className="milestone-text">{m.text}</div>
          <span className={`milestone-tag ${m.done ? 'active' : m.type === 'stretch' ? 'stretch' : 'pending'}`}>
            {m.tag}
          </span>
        </div>
      ))}
    </div>
  )
}
