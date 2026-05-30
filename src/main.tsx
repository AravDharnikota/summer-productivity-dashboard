import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import App from './App'
import LockScreen from './components/LockScreen'
import './styles/global.css'
import './styles/layout.css'
import './styles/components.css'
import './styles/today.css'
import './styles/overview.css'
import './styles/calendar.css'
import './styles/review.css'

function Root() {
  const [unlocked, setUnlocked] = useState(
    sessionStorage.getItem('unlocked') === '1'
  )

  if (!unlocked) return <LockScreen onUnlock={() => setUnlocked(true)} />

  return (
    <BrowserRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
)
