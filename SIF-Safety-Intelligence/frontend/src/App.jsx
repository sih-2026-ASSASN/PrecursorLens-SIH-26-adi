import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

import Dashboard from './pages/Dashboard'
import IngestReports from './pages/IngestReports'
import Reports from './pages/Reports'
import ReportDetails from './pages/ReportDetails'
import Analysis from './pages/Analysis'
import RiskAssessment from './pages/RiskAssessment'
import Analytics from './pages/Analytics'
import FailureAnalysis from './pages/FailureAnalysis'
import SafetyReviews from './pages/SafetyReviews'
import LifeSavingRules from './pages/LifeSavingRules'
import Alerts from './pages/Alerts'
import Settings from './pages/Settings'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-surfacebg overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 animate-fade-in">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/ingest" element={<IngestReports />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/reports/:id" element={<ReportDetails />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/analysis/:reportId" element={<Analysis />} />
            <Route path="/risk" element={<RiskAssessment />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/failures" element={<FailureAnalysis />} />
            <Route path="/reviews" element={<SafetyReviews />} />
            <Route path="/rules" element={<LifeSavingRules />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  )
}
