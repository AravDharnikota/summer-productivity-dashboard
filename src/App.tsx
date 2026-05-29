import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'
import Today from './pages/Today'
import Overview from './pages/Overview'
import Calendar from './pages/Calendar'

export default function App() {
  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        <Topbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Today />} />
            <Route path="/overview" element={<Overview />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}
