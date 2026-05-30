import { useState } from 'react'

export default function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)

  function attempt() {
    if (input === import.meta.env.VITE_APP_PASSWORD) {
      sessionStorage.setItem('unlocked', '1')
      onUnlock()
    } else {
      setError(true)
      setInput('')
    }
  }

  return (
    <div className="lock-screen">
      <div className="lock-card">
        <div className="lock-logo">S</div>
        <div className="lock-title">Lock-In</div>
        <div className="lock-sub">Enter password to continue</div>
        <input
          className={`lock-input${error ? ' lock-input-error' : ''}`}
          type="password"
          placeholder="Password"
          value={input}
          autoFocus
          onChange={e => { setInput(e.target.value); setError(false) }}
          onKeyDown={e => e.key === 'Enter' && attempt()}
        />
        {error && <div className="lock-error">Incorrect password</div>}
        <button className="lock-btn" onClick={attempt}>Unlock</button>
      </div>
    </div>
  )
}
