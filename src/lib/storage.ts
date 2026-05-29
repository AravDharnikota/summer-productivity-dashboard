import type { AppState } from '../types'

const KEY = 'lockin-dashboard-v1'

export function loadState(): AppState | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    console.error('Failed to save state to localStorage')
  }
}
