import React, { useState, useEffect } from 'react';
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
import {
  AlertCircle,
  User,
  Shield,
  LogIn,
  LogOut,
  LayoutDashboard,
  Search,
  FileText,
  History,
  BookOpen,
  FileCheck,
  Database,
  Activity,
  Menu,
  X,
  Zap,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [initialLoading, setInitialLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Loader
  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 1400);
    return () => clearTimeout(timer);
  }, []);

  // Firebase auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          email: firebaseUser.email || 'officer@precurai.com',
          name: (firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'HSE OFFICER').toUpperCase(),
          uid: firebaseUser.uid,
        };
        setCurrentUser(userData);
        try { localStorage.setItem('precurai_user', JSON.stringify(userData)); } catch { }
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, reportsRes, hseRes] = await Promise.all([
        fetch('/api/dashboard/stats'),
        fetch('/api/reports'),
        fetch('/api/analytics/hse'),
      ]);
      if (statsRes.ok) setStats(await statsRes.json());
      if (reportsRes.ok) setReports(await reportsRes.json());
      if (hseRes?.ok) setHseAnalytics(await hseRes.json());
    } catch (err) {
      console.error('Failed to connect to backend server:', err);
    }
  };

  useEffect(() => { fetchData(); }, [activeTab]);

  const handleSeedData = async () => {
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      if (res.ok) await fetchData();
    } catch (err) {
      console.error('Failed to seed database:', err);
    }
  };

  const handleAnalyzeComplete = (resultData, metadata) => {
    setLatestAnalysisResult(resultData);
    setLatestRequestMetadata(metadata);
    try {
      localStorage.setItem('precurai_latest_result', JSON.stringify(resultData));
      localStorage.setItem('precurai_latest_metadata', JSON.stringify(metadata));
    } catch { }
    setActiveTab('result');
    fetchData();
  };

  const handleUserSignIn = (user) => {
    setCurrentUser(user);
    try { localStorage.setItem('precurai_user', JSON.stringify(user)); } catch { }
    setIsSignInOpen(false);
  };

  const handleUserSignOut = async () => {
    try { await signOut(auth); } catch { }
    setCurrentUser(null);
    try { localStorage.removeItem('precurai_user'); } catch { }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analyze', label: 'Analyze Report', icon: Search },
    ...(latestAnalysisResult ? [{ id: 'result', label: 'Analysis Result', icon: FileText }] : []),
    { id: 'history', label: 'Incident Registry', icon: History },
    { id: 'lsr', label: 'Life-Saving Rules', icon: BookOpen },
    { id: 'pngrb', label: 'PNGRB Regulations', icon: FileCheck },
  ];

  const pageHeaders = {
    dashboard: { title: 'Operational SIF Precursor Dashboard', subtitle: 'Real-time high potential SIF risk detection & safety barrier analytics' },
    analyze: { title: 'Analyze Safety Observation', subtitle: 'Upload safety documents (PDF, DOCX, TXT) or raw observations for SIF intelligence' },
    result: { title: 'SIF Precursor Analysis Result', subtitle: 'Explainable feature attribution, barrier failure analysis, and IOGP Life-Saving Rules' },
    history: { title: 'Safety Reports Registry', subtitle: 'Audit trail of field observations, near-misses, and human supervisor sign-offs' },
    lsr: { title: 'Life-Saving Rules Reference', subtitle: 'Standard IOGP 9 Life-Saving Rules taxonomy and control requirements' },
    pngrb: { title: 'PNGRB Incident Reports', subtitle: 'Official Petroleum & Natural Gas Regulatory Board investigation reports' },
  };

  const currentHeader = pageHeaders[activeTab] || pageHeaders.dashboard;

  if (initialLoading) {
    return <PrecurAiLoader label="Initializing SIF Precursor Intelligence Engine..." />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-[#FFFFFF] font-sans overflow-x-hidden selection:bg-[#2C3480] selection:text-[#FFFFFF]">

      {/* ══════════════════════════════════════
          TOP HEADER — Black & Cobalt Blue Deep (#2C3480)
         ══════════════════════════════════════ */}
      <header className="sticky top-0 z-40 bg-[#000000]/95 backdrop-blur-xl border-b border-[#2C3480]/60 shadow-2xl">

        {/* ── Row 1: Brand bar ── */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-[#2C3480]/30">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
              <div className="absolute inset-0 rounded-xl border border-[#4E5BC9]/40 animate-ping" style={{ animationDuration: '2.5s' }} />
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#3D48A3] via-[#2C3480] to-[#0A0E22] flex items-center justify-center shadow-cobalt-glow border border-[#4E5BC9]">
                <Shield className="w-4.5 h-4.5 text-[#FFFFFF]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-[18px] tracking-tight text-[#FFFFFF] leading-none">
                  Precur<span className="text-[#5B73D1]">Ai</span>
                </span>
                <span className="bg-[#2C3480] text-[#FFFFFF] text-[8px] font-black px-1.5 py-0.5 rounded border border-[#4E5BC9] uppercase tracking-[0.15em] shadow-sm">
                  HSE
                </span>
              </div>
              <p className="text-[10px] text-[#BAC4EB] font-mono hidden sm:block mt-0.5 tracking-wide">
                SIF Precursor Intelligence Platform
              </p>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            {/* AI disclaimer badge */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-semibold bg-[#0A0D18] text-[#FFFFFF] border border-[#2C3480]/80 shadow-sm">
              <AlertCircle className="w-3.5 h-3.5 text-[#5B73D1] shrink-0" />
              <span>AI Decision Support · Final assessment by qualified HSE personnel</span>
            </div>

            {/* Reset data button */}
            <button
              onClick={handleSeedData}
              title="Reset sample dataset"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-[#BAC4EB] hover:text-[#FFFFFF] bg-[#0A0D18] hover:bg-[#161D33] rounded-xl border border-[#2C3480]/60 hover:border-[#4E5BC9] transition-all duration-200 active:scale-95"
            >
              <Database className="w-3.5 h-3.5 text-[#5B73D1]" />
              <span>Reset Data</span>
            </button>

            {/* System status */}
            <div className="hidden sm:flex items-center gap-2 text-[11px] px-3 py-1.5 rounded-xl bg-[#0A0D18] border border-[#2C3480]/60">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5B73D1] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFFFFF]" />
              </span>
              <span className="text-[#FFFFFF] font-semibold font-mono text-[10px]">Operational</span>
            </div>

            {/* Auth */}
            {currentUser ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0A0D18] border border-[#2C3480]">
                <div className="w-6 h-6 rounded-full bg-[#2C3480] text-[#FFFFFF] flex items-center justify-center font-bold text-xs shadow-sm">
                  <User className="w-3.5 h-3.5" />
                </div>
                <div className="hidden sm:block text-left">
                  <span className="font-bold block text-[#FFFFFF] leading-none text-[11px]">{currentUser.name}</span>
                  <span className="text-[9px] text-[#BAC4EB]">{currentUser.email}</span>
                </div>
                <button
                  onClick={handleUserSignOut}
                  className="p-1 text-[#BAC4EB] hover:text-[#FF3B30] transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSignInOpen(true)}
                className="btn-cobalt flex items-center gap-2 px-4 py-1.5 text-xs font-bold transition active:scale-95 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-xl text-[#BAC4EB] hover:text-[#FFFFFF] hover:bg-[#161D33] transition"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ── Row 2: Horizontal navigation tabs ── */}
        <nav className="hidden md:flex items-center gap-1 px-4 sm:px-6 overflow-x-auto scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                className={`
                  relative flex items-center gap-2 px-4 py-3 text-[11px] font-semibold whitespace-nowrap transition-all duration-200 group
                  ${isActive
                    ? 'text-[#FFFFFF]'
                    : 'text-[#BAC4EB]/70 hover:text-[#FFFFFF]'
                  }
                `}
              >
                <Icon className={`w-3.5 h-3.5 transition-all duration-200 ${isActive ? 'text-[#5B73D1] scale-110' : 'text-[#64748B] group-hover:text-[#FFFFFF]'}`} />
                {item.label}
                {/* Active underline glow with electric Cobalt Blue */}
                <span className={`absolute bottom-0 left-2 right-2 h-[2.5px] rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#2C3480] via-[#5B73D1] to-[#FFFFFF] opacity-100 shadow-[0_0_12px_rgba(91,115,209,0.9)]'
                    : 'bg-transparent opacity-0'
                }`} />
              </button>
            );
          })}
        </nav>

        {/* ── Mobile dropdown nav ── */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-[#2C3480]/60 bg-[#000000] px-3 py-2 flex flex-col gap-1 animate-fade-in">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-left transition-all ${
                    isActive
                      ? 'btn-cobalt'
                      : 'text-[#BAC4EB] hover:text-[#FFFFFF] hover:bg-[#0A0D18]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#FFFFFF]' : 'text-[#BAC4EB]'}`} />
                  {item.label}
                </button>
              );
            })}
            <div className="border-t border-[#2C3480]/40 mt-1 pt-2 flex flex-col gap-1">
              <button
                onClick={handleSeedData}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-[#BAC4EB] hover:text-[#FFFFFF] bg-[#0A0D18] transition"
              >
                <Database className="w-3.5 h-3.5 text-[#5B73D1]" />
                Reset Sample Data
              </button>
            </div>
          </nav>
        )}
      </header>

      {/* ══════════════════════════════════════
          PAGE TITLE BAR
         ══════════════════════════════════════ */}
      <div className="bg-[#05070E] border-b border-[#2C3480]/40 px-6 py-4 animate-fade-in">
        <h1 className="text-[15px] font-bold tracking-tight text-[#FFFFFF]">{currentHeader.title}</h1>
        <p className="text-[11px] text-[#BAC4EB]/80 mt-0.5 font-medium">{currentHeader.subtitle}</p>
      </div>

      {/* ══════════════════════════════════════
          MAIN CONTENT
         ══════════════════════════════════════ */}
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
          <AnalyzeReport onAnalyzeComplete={handleAnalyzeComplete} />
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

      {/* ══════════════════════════════════════
          FOOTER
         ══════════════════════════════════════ */}
      <footer className="py-4 px-6 border-t border-[#2C3480]/60 bg-[#000000] text-xs flex flex-col sm:flex-row items-center justify-between gap-2 text-[#BAC4EB]">
        <span>PrecurAi &copy; 2026 — AI-powered SIF Precursor Detection &amp; HSE Intelligence</span>
        <div className="flex items-center gap-1.5 font-medium">
          <span>Developer:</span>
          <a
            href="https://github.com/adityaahamana18"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#5B73D1] hover:text-[#FFFFFF] font-semibold hover:underline transition-colors"
          >
            Aditya Ahamana
          </a>
        </div>
      </footer>

      {/* ══════════════════════════════════════
          MODALS
         ══════════════════════════════════════ */}
      {selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onReviewSubmitted={() => fetchData()}
        />
      )}

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
