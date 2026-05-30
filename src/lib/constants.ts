import type { Habit, Hackathon } from '../types'

export const START_DATE = '2026-05-30'
export const END_DATE = '2026-08-14'
export const TOTAL_DAYS = 77

export const OFF_DAYS = [
  '2026-06-06',
  '2026-06-07',
  '2026-06-16',
  '2026-07-11',
  '2026-07-19',
]

export const HACKATHONS: Hackathon[] = [
  {
    name: 'SF Horizons',
    dates: ['2026-06-19', '2026-06-20', '2026-06-21'],
  },
  {
    name: 'Kove Hacks',
    dates: ['2026-07-24', '2026-07-25', '2026-07-26'],
  },
  {
    name: 'Horizons Toronto',
    dates: ['2026-08-07', '2026-08-08', '2026-08-09'],
  },
]

export const HABITS: Habit[] = [
  { id: 'prayer', label: 'Prayer (10–15 min)', freq: 'every day', icon: '🙏' },
  { id: 'meditation', label: 'Meditation (10 min)', freq: 'every day', icon: '🧘' },
  { id: 'coldShower', label: 'Cold Shower', freq: 'every day', icon: '🚿' },
  { id: 'amSkincare', label: 'AM Skincare', freq: 'every day', icon: '✨' },
  { id: 'noSugar', label: 'No Sugar / No Junk', freq: 'every day · 120g+ protein', icon: '🥗' },
  { id: 'journal', label: 'Journal', freq: 'every night', icon: '📓' },
  { id: 'pmSkincare', label: 'PM Skincare', freq: 'every day', icon: '🌙' },
  { id: 'sleep10pm', label: 'Sleep by 10pm', freq: 'every day', icon: '😴' },
]

export const GYM_SCHEDULE: Record<number, 'GYM' | 'CARDIO' | 'REST'> = {
  0: 'REST',
  1: 'GYM',
  2: 'CARDIO',
  3: 'GYM',
  4: 'CARDIO',
  5: 'GYM',
  6: 'CARDIO',
}

export const JOURNAL_PROMPTS: Record<number, string> = {
  1: 'Day 1. Who are you today — and who do you commit to becoming by August 14th? Be specific.',
  7: 'Week 1 done. What did you build, learn, and discover about yourself this week?',
  14: 'Two weeks in. Are your habits becoming automatic yet? What still needs work?',
  21: 'Three weeks. Rate your discipline 1–10 and explain exactly why.',
  28: 'One month complete. Look at your Day 1 photo. What has changed — physically, mentally, spiritually?',
  35: 'Halfway to Week 10. What would the version of you from Day 1 think of who you are right now?',
  42: 'Six weeks done. Is the AI Teacher project on track to ship v1 by Aug 14? What needs to happen?',
  49: 'Seven weeks. Describe the person you are becoming in 10th grade. Make it specific and vivid.',
  56: 'Eight weeks. What are the two things you are most proud of this summer?',
  63: 'Nine weeks. Final stretch — what does a perfect last two weeks look like?',
  70: 'Day 70 of 77. Read your Day 1 entry. Who were you then, and who are you now?',
  77: "Day 77. You made it. Write the full story of this summer. Don't hold back.",
}

export const DEFAULT_JOURNAL_PROMPT =
  'What did you accomplish today? What are you grateful for? What will you do better tomorrow?'
