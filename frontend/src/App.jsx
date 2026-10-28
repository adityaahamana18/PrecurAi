import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import AnalyzeReport from './components/AnalyzeReport';
import AnalysisResult from './components/AnalysisResult';
import ReportsHistory from './components/ReportsHistory';
import LifeSavingRules from './components/LifeSavingRules';
import PNGRBReports from './components/PNGRBReports';
import ReportDetailModal from './components/ReportDetailModal';
import PrecurAiLoader from './components/PrecurAiLoader';
import SignIn1 from './components/ui/modern-stunning-sign-in';
import { auth, onAuthStateChanged, signOut } from './lib/firebase';
import { AlertCircle, User, ShieldCheck, LogIn, LogOut } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [initialLoading, setInitialLoading] = useState(true);

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

  // Initial loader animation display (1.5 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

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
      subtitle: 'Real-time high potential SIF risk detection and incident metrics'
    },
    analyze: {
      title: 'Analyze Safety Report',
      subtitle: 'Upload safety documents (PDF, DOCX, TXT) or raw observations for SIF intelligence'
    },
    result: {
      title: 'SIF Precursor Analysis Result',
      subtitle: 'Explainable feature attribution, barrier failure analysis, and IOGP Life-Saving Rules'
    },
    history: {
      title: 'Safety Reports Registry',
      subtitle: 'Audit trail of field observations, near-misses, and human supervisor sign-offs'
    },
    lsr: {
      title: 'Life-Saving Rules Reference',
      subtitle: 'Standard IOGP 9 Life-Saving Rules taxonomy and control requirements'
    },
    pngrb: {
      title: 'PNGRB Incident Reports',
      subtitle: 'Official Petroleum & Natural Gas Regulatory Board investigation reports'
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

  if (initialLoading) {
    return <PrecurAiLoader label="Initializing SIF Precursor Intelligence Engine..." />;
  }

  return (
    <div className="min-h-screen flex bg-[#0B0F17] text-slate-100 font-serif relative overflow-x-hidden">
      {/* Sidebar Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSeedData={handleSeedData}
        hasActiveResult={!!latestAnalysisResult}
        user={currentUser}
        onSignOut={handleUserSignOut}
        onOpenSignIn={() => setIsSignInOpen(true)}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden relative z-10">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-[#0E1522]/90 backdrop-blur-md border-b border-slate-800/90 px-6 py-3 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
          <div>
            <h1 className="text-base font-bold tracking-wide text-white">
              {currentHeader.title}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {currentHeader.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {/* Advisory Disclaimer Badge */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-950/40 text-amber-300 border border-amber-800/60 shadow-xs">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
              <span>AI Decision Support • Final assessment by qualified HSE personnel</span>
            </div>

            {/* User Profile Info / Sign In Trigger */}
            {currentUser ? (
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700">
                <div className="w-7 h-7 rounded-full bg-sky-700 text-white flex items-center justify-center text-xs font-bold">
                  <User className="w-4 h-4" />
                </div>
                <div className="text-left text-xs">
                  <span className="font-bold block text-slate-200">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {currentUser.email}
                  </span>
                </div>
                <button
                  onClick={handleUserSignOut}
                  className="ml-1 p-1 text-slate-400 hover:text-red-400 transition"
                  title="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSignInOpen(true)}
                className="flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition active:scale-98"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
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
        </main>

        {/* Global Page Footer */}
        <footer className="py-4 px-6 border-t border-slate-800/80 bg-[#0A0E17] text-xs flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-400">
          <div>
            <span>PrecurAi &copy; 2026 — AI-powered SIF Precursor Detection & HSE Intelligence</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <span>Developer:</span>
            <a
              href="https://github.com/adityaahamana18"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 font-semibold hover:underline"
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
          brandName="PrecurAi"
          tagline="SIF Precursor Intelligence Platform"
          onClose={() => setIsSignInOpen(false)}
          onSuccess={handleUserSignIn}
        />
      )}
    </div>
  );
}
