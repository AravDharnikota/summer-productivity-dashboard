import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'
import Today from './pages/Today'
import Overview from './pages/Overview'
import Calendar from './pages/Calendar'
import DayPage from './pages/DayPage'
import Review from './pages/Review'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="app">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main">
        <Topbar onMenuClick={() => setSidebarOpen(o => !o)} />
        <div className="content">
          <Routes>
            <Route path="/" element={<Today />} />
            <Route path="/day/:date" element={<DayPage />} />
            <Route path="/overview" element={<Overview />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/review" element={<Review />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}
