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
    const timer = setTimeout(() => setInitialLoading(false), 1500);
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
    dashboard: { title: 'Operational SIF Precursor Dashboard', subtitle: 'Real-time high potential SIF risk detection and incident metrics' },
    analyze: { title: 'Analyze Safety Report', subtitle: 'Upload safety documents (PDF, DOCX, TXT) or raw observations for SIF intelligence' },
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
    <div className="min-h-screen flex flex-col bg-[#080C14] text-slate-100 font-sans overflow-x-hidden">

      {/* ══════════════════════════════════════
          TOP HEADER — Brand + Nav + Auth
         ══════════════════════════════════════ */}
      <header className="sticky top-0 z-40 bg-[#060A12]/96 backdrop-blur-xl border-b border-slate-800/80 shadow-xl shadow-black/40">

        {/* ── Row 1: Brand bar ── */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-800/50">
          {/* Brand */}
          <div className="flex items-center gap-3">
            {/* Shield icon with radar ring */}
            <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
              <div className="absolute inset-0 rounded-xl border border-sky-500/20 animate-ping" style={{ animationDuration: '3s' }} />
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 via-blue-600 to-slate-900 flex items-center justify-center shadow-lg shadow-sky-950/60 border border-sky-400/25">
                <Shield className="w-4.5 h-4.5 text-sky-100" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-[17px] tracking-tight text-white leading-none">
                  Precur<span className="text-sky-400">Ai</span>
                </span>
                <span className="bg-sky-950/80 text-sky-400 text-[8px] font-black px-1.5 py-0.5 rounded border border-sky-700/60 uppercase tracking-[0.15em]">
                  HSE
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium hidden sm:block mt-0.5 tracking-wide">
                SIF Precursor Intelligence Platform
              </p>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2.5">
            {/* AI disclaimer badge */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-amber-950/30 text-amber-300 border border-amber-800/50">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>AI Decision Support · Final assessment by qualified HSE personnel</span>
            </div>

            {/* Reset data button */}
            <button
              onClick={handleSeedData}
              title="Reset sample dataset"
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-700/80 rounded-lg border border-slate-700/60 transition-all duration-200 hover:border-slate-600"
            >
              <Database className="w-3.5 h-3.5 text-sky-400" />
              <span>Reset Data</span>
            </button>

            {/* System status */}
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded-lg bg-emerald-950/30 border border-emerald-800/40">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
              </span>
              <span className="text-emerald-400 font-semibold">Operational</span>
            </div>

            {/* Auth */}
            {currentUser ? (
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-sky-500 to-blue-700 text-white flex items-center justify-center shadow-sm">
                  <User className="w-3.5 h-3.5" />
                </div>
                <div className="hidden sm:block text-left">
                  <span className="font-bold block text-slate-200 leading-none text-[11px]">{currentUser.name}</span>
                  <span className="text-[9px] text-slate-500">{currentUser.email}</span>
                </div>
                <button
                  onClick={handleUserSignOut}
                  className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSignInOpen(true)}
                className="flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow transition active:scale-95"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/60 transition"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ── Row 2: Horizontal navigation tabs (desktop) ── */}
        <nav className="hidden md:flex items-center gap-0.5 px-4 sm:px-6 overflow-x-auto scrollbar-none">
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
                    ? 'text-white'
                    : 'text-slate-500 hover:text-slate-200'
                  }
                `}
              >
                <Icon className={`w-3.5 h-3.5 transition-all duration-200 ${isActive ? 'text-sky-400 scale-110' : 'text-slate-600 group-hover:text-slate-400'}`} />
                {item.label}
                {/* Active underline glow */}
                <span className={`absolute bottom-0 left-2 right-2 h-[2px] rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-sky-400 opacity-100 shadow-[0_0_8px_rgba(56,189,248,0.7)]'
                    : 'bg-transparent opacity-0'
                }`} />
              </button>
            );
          })}
        </nav>

        {/* ── Mobile dropdown nav ── */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-slate-800/80 bg-[#0D131F] px-3 py-2 flex flex-col gap-1 animate-fade-in">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold text-left transition-all ${
                    isActive
                      ? 'bg-sky-600 text-white shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
            <div className="border-t border-slate-800/80 mt-1 pt-1 flex flex-col gap-1">
              <button
                onClick={handleSeedData}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-700/80 transition"
              >
                <Database className="w-3.5 h-3.5 text-sky-400" />
                Reset Sample Data
              </button>
            </div>
          </nav>
        )}
      </header>

      {/* ══════════════════════════════════════
          PAGE TITLE BAR
         ══════════════════════════════════════ */}
      <div className="bg-[#080C14] border-b border-slate-800/40 px-6 py-4 animate-fade-in">
        <h1 className="text-[15px] font-bold tracking-tight text-white">{currentHeader.title}</h1>
        <p className="text-[11px] text-slate-500 mt-0.5 font-medium">{currentHeader.subtitle}</p>
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
      <footer className="py-4 px-6 border-t border-slate-800/80 bg-[#0A0E17] text-xs flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-400">
        <span>PrecurAi &copy; 2026 — AI-powered SIF Precursor Detection &amp; HSE Intelligence</span>
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
