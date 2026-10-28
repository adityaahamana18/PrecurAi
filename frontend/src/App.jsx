import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import AnalyzeReport from './components/AnalyzeReport';
import AnalysisResult from './components/AnalysisResult';
import ReportsHistory from './components/ReportsHistory';
import LifeSavingRules from './components/LifeSavingRules';
import PNGRBReports from './components/PNGRBReports';
import ReportDetailModal from './components/ReportDetailModal';
import SignIn1 from './components/ui/modern-stunning-sign-in';
import { AlertCircle, User, ShieldCheck, Sun, Moon, LogIn, LogOut } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false); // Clean light corporate theme default
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('precurai_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [stats, setStats] = useState(null);
  const [hseAnalytics, setHseAnalytics] = useState(null);
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);

  // Real-time analysis result state with localStorage persistence
  const [latestAnalysisResult, setLatestAnalysisResult] = useState(() => {
    try {
      const saved = localStorage.getItem('precurai_latest_result');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [latestRequestMetadata, setLatestRequestMetadata] = useState(() => {
    try {
      const saved = localStorage.getItem('precurai_latest_metadata');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const fetchData = async () => {
    try {
      const [statsRes, reportsRes, hseRes] = await Promise.all([
        fetch('/api/dashboard/stats'),
        fetch('/api/reports'),
        fetch('/api/analytics/hse')
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (reportsRes.ok) {
        const reportsData = await reportsRes.json();
        setReports(reportsData);
      }

      if (hseRes && hseRes.ok) {
        const hseData = await hseRes.json();
        setHseAnalytics(hseData);
      }
    } catch (err) {
      console.error("Failed to connect to backend server:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleSeedData = async () => {
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error("Failed to seed database:", err);
    }
  };

  const handleAnalyzeComplete = (resultData, metadata) => {
    setLatestAnalysisResult(resultData);
    setLatestRequestMetadata(metadata);
    try {
      localStorage.setItem('precurai_latest_result', JSON.stringify(resultData));
      localStorage.setItem('precurai_latest_metadata', JSON.stringify(metadata));
    } catch (e) {
      console.warn("LocalStorage save error:", e);
    }
    setActiveTab('result');
    fetchData();
  };

  const pageHeaders = {
    dashboard: {
      title: 'HSE Executive Dashboard',
      subtitle: 'AI-assisted SIF precursor intelligence and HSE safety analytics'
    },
    analyze: {
      title: 'Analyze Safety Report',
      subtitle: 'Upload safety documents (PDF, DOCX, TXT) or paste observation narratives'
    },
    result: {
      title: 'SIF Precursor Analysis Result',
      subtitle: 'Traceable risk assessment, evidence highlights, and decision support'
    },
    history: {
      title: 'Safety Reports History',
      subtitle: 'Historical registry of analyzed safety observations and human sign-offs'
    },
    lsr: {
      title: 'Life-Saving Rules Reference',
      subtitle: 'Standard IOGP 9 Life-Saving Rules taxonomy and control requirements'
    },
    pngrb: {
      title: 'Incident Reports',
      subtitle: 'Official petroleum & natural gas regulatory board incident documentation'
    },
    signin: {
      title: 'Authentication Portal',
      subtitle: 'Secure sign-in for authorized HSE personnel and safety supervisors'
    }
  };

  const handleUserSignIn = (user) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('precurai_user', JSON.stringify(user));
    } catch (e) {
      console.warn("Storage save failed:", e);
    }
    setActiveTab('dashboard');
  };

  const handleUserSignOut = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('precurai_user');
    } catch (e) {
      console.warn("Storage removal failed:", e);
    }
  };

  const currentHeader = pageHeaders[activeTab] || pageHeaders.dashboard;

  return (
    <div className={`min-h-screen flex ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'} font-sans transition-colors duration-150`}>
      {/* Sidebar Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onSeedData={handleSeedData}
        hasActiveResult={!!latestAnalysisResult}
        user={currentUser}
        onSignOut={handleUserSignOut}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Header Bar */}
        <header className={`sticky top-0 z-30 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border-b px-6 py-3 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors`}>
          <div>
            <h1 className={`text-base font-bold tracking-tight ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
              {currentHeader.title}
            </h1>
            <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {currentHeader.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {/* Mandatory Advisory Disclaimer Banner */}
            <div className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border ${
              darkMode ? 'bg-amber-950/60 text-amber-300 border-amber-800/80' : 'bg-amber-50 text-amber-900 border-amber-200'
            }`}>
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>AI Decision Support • Final assessment by qualified HSE personnel</span>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg border transition ${
                darkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white' : 'bg-slate-100 border-slate-300 text-slate-700 hover:text-slate-900'
              }`}
              title="Toggle theme mode"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* User Profile Info */}
            <div className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg border ${
              darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="w-7 h-7 rounded-full bg-sky-700 text-white flex items-center justify-center text-xs font-bold">
                <User className="w-4 h-4" />
              </div>
              <div className="text-left text-xs">
                <span className={`font-bold block leading-none ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                  {currentUser?.name || 'HSE Officer'}
                </span>
                <span className={`text-[10px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {currentUser?.email || 'Operations'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6 animate-fade-in transition-all duration-300">
          {activeTab === 'dashboard' && (
            <Dashboard
              stats={stats}
              hseAnalytics={hseAnalytics}
              onSelectReport={(rep) => setSelectedReport(rep)}
              onNavigateToAnalyze={() => setActiveTab('analyze')}
            />
          )}

          {activeTab === 'analyze' && (
            <AnalyzeReport
              onAnalyzeComplete={handleAnalyzeComplete}
            />
          )}

          {activeTab === 'result' && (
            <AnalysisResult
              resultData={latestAnalysisResult}
              requestMetadata={latestRequestMetadata}
              onBackToAnalyze={() => setActiveTab('analyze')}
              onNavigateToDashboard={() => setActiveTab('dashboard')}
            />
          )}

          {activeTab === 'history' && (
            <ReportsHistory
              reports={reports}
              onSelectReport={(rep) => setSelectedReport(rep)}
              onRefresh={fetchData}
            />
          )}

          {activeTab === 'lsr' && <LifeSavingRules />}

          {activeTab === 'pngrb' && <PNGRBReports />}

          {activeTab === 'signin' && (
            <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
              <SignIn1
                brandName="PrecurAi"
                tagline="AI-Powered SIF Precursor Detection & HSE Intelligence"
                onSuccess={handleUserSignIn}
              />
            </div>
          )}
        </main>

        {/* Global Page Footer */}
        <footer className={`py-4 px-6 border-t text-xs flex flex-col sm:flex-row items-center justify-between gap-2 ${
          darkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
        }`}>
          <div>
            <span>PrecurAi &copy; 2026 — AI-powered SIF Precursor Detection & HSE Intelligence</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <span>Developer:</span>
            <a
              href="https://github.com/adityaahamana18"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-600 dark:text-sky-400 font-semibold hover:underline"
            >
              Aditya Ahamana
            </a>
          </div>
        </footer>
      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onReviewSubmitted={() => fetchData()}
        />
      )}
    </div>
  );
}
