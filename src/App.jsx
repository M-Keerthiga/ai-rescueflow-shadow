import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext.jsx';
import SafetyBanner from './components/layout/SafetyBanner.jsx';
import Header from './components/layout/Header.jsx';
import Sidebar from './components/layout/Sidebar.jsx';

import CommandCenter from './pages/CommandCenter.jsx';
import AIShadowRisk from './pages/AIShadowRisk.jsx';
import AIShadowWhatIf from './pages/AIShadowWhatIf.jsx';
import RescueFlowAnalysis from './pages/RescueFlowAnalysis.jsx';
import RescueFlowReport from './pages/RescueFlowReport.jsx';
import Analytics from './pages/Analytics.jsx';
import SettingsPage from './pages/Settings.jsx';
import PoliceDashboard from './pages/PoliceDashboard.jsx';

import ErrorBoundary from './components/common/ErrorBoundary.jsx';

export default function App() {
  return (
    <ErrorBoundary fallbackTitle="APPLICATION INITIALIZATION ERROR">
      <AppProvider>
        <Router>
          <div className="min-h-screen bg-[#060a12] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
            <SafetyBanner />
            <Header />

            <div className="flex flex-1 overflow-hidden">
              <Sidebar />

              <main className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full">
                <ErrorBoundary fallbackTitle="PAGE RENDERING ISSUE">
                  <Routes>
                    <Route path="/" element={<CommandCenter />} />
                    <Route path="/shadow/prediction" element={<AIShadowRisk />} />
                    <Route path="/shadow/what-if" element={<AIShadowWhatIf />} />
                    <Route path="/rescue/analysis" element={<RescueFlowAnalysis />} />
                    <Route path="/rescue/history" element={<RescueFlowReport />} />
                    <Route path="/police" element={<PoliceDashboard />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="*" element={<CommandCenter />} />
                  </Routes>
                </ErrorBoundary>
              </main>
            </div>
          </div>
        </Router>
      </AppProvider>
    </ErrorBoundary>
  );
}
