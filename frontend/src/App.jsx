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
import { auth, onAuthStateChanged, signOut } from './lib/firebase';
import { AlertCircle, User, ShieldCheck, Sun, Moon, LogIn, LogOut, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(true); // Default to gorgeous dark vibrant animated theme
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
  const [isSignInOpen, setIsSignInOpen] = useState(false);

  // Sync Firebase authentication state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          email: firebaseUser.email || "officer@precurai.com",
          name: (firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "HSE OFFICER").toUpperCase(),
          uid: firebaseUser.uid
        };
        setCurrentUser(userData);
        try {
          localStorage.setItem('precurai_user', JSON.stringify(userData));
        } catch (e) {
          console.warn("Storage save error:", e);
        }
      }
    });

    return () => unsubscribe();
  }, []);

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
      title: 'Operational SIF Precursor Dashboard',
      subtitle: 'Real-time high potential SIF risk detection & predictive safety metrics'
    },
    analyze: {
      title: 'AI Multi-Format Safety Analyzer',
      subtitle: 'Upload safety logs (PDF, DOCX, TXT) or raw observations for deep neural intelligence'
    },
    result: {
      title: 'SIF Precursor Analysis Intelligence',
      subtitle: 'Explainable feature attribution, barrier failure analysis & IOGP Life-Saving Rules'
    },
    history: {
      title: 'Field Safety Observation Registry',
      subtitle: 'Full historical audit trail of near-misses, unsafe acts, and verified outcomes'
    },
    lsr: {
      title: 'IOGP Standard Life-Saving Rules',
      subtitle: 'International Association of Oil & Gas Producers standard safety barriers'
    },
    pngrb: {
      title: 'PNGRB Regulatory Ingestion Pipeline',
      subtitle: 'Official Petroleum & Natural Gas Regulatory Board formal incident investigations'
    }
  };

  const handleUserSignIn = (user) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('precurai_user', JSON.stringify(user));
    } catch (e) {
      console.warn("Storage save failed:", e);
    }
    setIsSignInOpen(false);
  };

  const handleUserSignOut = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn("Firebase sign out note:", e);
    }
    setCurrentUser(null);
    try {
      localStorage.removeItem('precurai_user');
    } catch (e) {
      console.warn("Storage removal failed:", e);
    }
  };

  const currentHeader = pageHeaders[activeTab] || pageHeaders.dashboard;

  return (
    <div className="min-h-screen flex bg-[#0A0D14] text-slate-100 font-serif relative overflow-x-hidden">
      {/* Dynamic Animated Ambient Glow Spots */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none animate-float-card" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[160px] pointer-events-none animate-float-reverse" />
      <div className="fixed top-1/2 right-10 w-[400px] h-[400px] bg-cyan-600/15 rounded-full blur-[130px] pointer-events-none" />

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
        onOpenSignIn={() => setIsSignInOpen(true)}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden relative z-10">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-[#0F172A]/85 backdrop-blur-xl border-b border-slate-800/80 px-8 py-4 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent flex items-center gap-2">
              {currentHeader.title}
              <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" />
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {currentHeader.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {/* Advisory Disclaimer Badge */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 shadow-sm animate-pulse">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>AI Decision Support • IOGP Certified Workflows</span>
            </div>

            {/* User Profile Info / Sign In Trigger */}
            {currentUser ? (
              <div className="flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 shadow-md">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center text-xs font-bold shadow-md shadow-purple-500/30">
                  <User className="w-4 h-4" />
                </div>
                <div className="text-left text-xs">
                  <span className="font-bold block text-white">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {currentUser.email}
                  </span>
                </div>
                <button
                  onClick={handleUserSignOut}
                  className="ml-1 p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700/60 rounded-lg transition"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSignInOpen(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:brightness-110 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all transform hover:scale-105 active:scale-95 animate-neon-glow"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In with Firebase</span>
              </button>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-8 max-w-7xl w-full mx-auto space-y-8 animate-fade-in transition-all duration-300">
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
        </main>

        {/* Global Page Footer */}
        <footer className="py-6 px-8 border-t border-slate-800/80 bg-[#0B0F19]/90 text-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span>PrecurAi &copy; 2026 — Next-Gen AI SIF Precursor Intelligence</span>
          </div>
          <div className="flex items-center gap-2 font-medium">
            <span>Built & Engineered by:</span>
            <a
              href="https://github.com/adityaahamana18"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold bg-gradient-to-r from-cyan-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent hover:underline text-sm"
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

      {/* Sign In Popup Modal */}
      {isSignInOpen && (
        <SignIn1
          isModal={true}
          brandName="PrecurAi Intelligence"
          tagline="Next-Gen AI SIF Precursor Detection & Prevention"
          onClose={() => setIsSignInOpen(false)}
          onSuccess={handleUserSignIn}
        />
      )}
    </div>
  );
}
