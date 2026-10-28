import React, { useState, useEffect } from 'react';
import CinematicHero from './components/CinematicHero';
import Dashboard from './components/Dashboard';
import AnalyzeReport from './components/AnalyzeReport';
import AnalysisResult from './components/AnalysisResult';
import ReportsHistory from './components/ReportsHistory';
import LifeSavingRules from './components/LifeSavingRules';
import PatternIntelligence from './components/PatternIntelligence';
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
  Sparkles,
  Share2,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview'); // start at cinematic overview hero
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
    { id: 'overview', label: 'Overview', icon: Sparkles },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analyze', label: 'Analyze Report', icon: Search },
    ...(latestAnalysisResult ? [{ id: 'result', label: 'Analysis Result', icon: FileText }] : []),
    { id: 'history', label: 'Incident Registry', icon: History },
    { id: 'lsr', label: 'Life-Saving Rules', icon: BookOpen },
    { id: 'patterns', label: 'Pattern Intelligence', icon: Share2 },
    { id: 'pngrb', label: 'PNGRB Regulations', icon: FileCheck },
  ];

  const pageHeaders = {
    overview: { title: 'PrecurAi · Next-Gen Safety Intelligence', subtitle: 'Futuristic AI command center for Serious Injury & Fatality precursor detection' },
    dashboard: { title: 'Operational SIF Precursor Dashboard', subtitle: 'Real-time high potential SIF risk detection & safety barrier analytics' },
    analyze: { title: 'Analyze Safety Observation', subtitle: 'Interactive live report evaluation, multi-stage pipeline & document ingestion' },
    result: { title: 'SIF Precursor Analysis Result', subtitle: 'Explainable feature attribution, barrier failure analysis, and IOGP Life-Saving Rules' },
    history: { title: 'Safety Reports Registry', subtitle: 'Audit trail of field observations, near-misses, and human supervisor sign-offs' },
    lsr: { title: 'Life-Saving Rules Reference', subtitle: 'Standard IOGP 9 Life-Saving Rules taxonomy and control requirements' },
    patterns: { title: 'SIF Precursor Pattern Intelligence', subtitle: 'Interactive relationship network linking hazards, barriers, activities & rules' },
    pngrb: { title: 'PNGRB Incident Reports', subtitle: 'Official Petroleum & Natural Gas Regulatory Board investigation reports' },
  };

  const currentHeader = pageHeaders[activeTab] || pageHeaders.dashboard;

  if (initialLoading) {
    return <PrecurAiLoader label="Initializing SIF Precursor Intelligence Engine..." />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#070B14] text-[#F4F7FB] font-sans overflow-x-hidden selection:bg-[#00E5FF] selection:text-[#070B14]">

      {/* ══════════════════════════════════════
          TOP HEADER — Master Cinematic Palette
         ══════════════════════════════════════ */}
      <header className="sticky top-0 z-40 bg-[#070B14]/90 backdrop-blur-xl border-b border-[#00E5FF]/20 shadow-2xl">

        {/* ── Row 1: Brand bar ── */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-[#00E5FF]/10">
          {/* Brand */}
          <div
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
              <div className="absolute inset-0 rounded-xl border border-[#00E5FF]/40 animate-ping" style={{ animationDuration: '3s' }} />
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0D1424] via-[#111A2E] to-[#070B14] flex items-center justify-center shadow-cyan-glow border border-[#00E5FF]/60 group-hover:scale-105 transition-transform">
                <Shield className="w-4.5 h-4.5 text-[#00E5FF]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-[18px] tracking-tight text-[#F4F7FB] leading-none">
                  Precur<span className="text-[#00E5FF]">Ai</span>
                </span>
                <span className="bg-[#00E5FF] text-[#070B14] text-[8px] font-black px-1.5 py-0.5 rounded-full border border-[#00E5FF] uppercase tracking-[0.15em] shadow-sm">
                  AI CORE
                </span>
              </div>
              <p className="text-[10px] text-[#94A3B8] font-mono hidden sm:block mt-0.5 tracking-wide">
                SIF Precursor Intelligence Platform
              </p>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            {/* AI disclaimer badge */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-semibold bg-[#0D1424] text-[#F4F7FB] border border-[#00E5FF]/25 shadow-sm">
              <AlertCircle className="w-3.5 h-3.5 text-[#00E5FF] shrink-0" />
              <span>AI Decision Support · Final assessment by qualified HSE personnel</span>
            </div>

            {/* Reset data button */}
            <button
              onClick={handleSeedData}
              title="Reset sample dataset"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-[#94A3B8] hover:text-[#00E5FF] bg-[#0D1424] hover:bg-[#111A2E] rounded-xl border border-[#00E5FF]/25 hover:border-[#00E5FF]/60 transition-all duration-200 active:scale-95"
            >
              <Database className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>Reset Data</span>
            </button>

            {/* System status */}
            <div className="hidden sm:flex items-center gap-2 text-[11px] px-3 py-1.5 rounded-xl bg-[#0D1424] border border-[#00E5FF]/25">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2EE59D] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2EE59D]" />
              </span>
              <span className="text-[#F4F7FB] font-semibold font-mono text-[10px]">Operational</span>
            </div>

            {/* Auth */}
            {currentUser ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0D1424] border border-[#00E5FF]/30">
                <div className="w-6 h-6 rounded-full bg-[#00E5FF] text-[#070B14] flex items-center justify-center font-bold text-xs shadow-sm">
                  <User className="w-3.5 h-3.5" />
                </div>
                <div className="hidden sm:block text-left">
                  <span className="font-bold block text-[#F4F7FB] leading-none text-[11px]">{currentUser.name}</span>
                  <span className="text-[9px] text-[#94A3B8] font-mono">{currentUser.email}</span>
                </div>
                <button
                  onClick={handleUserSignOut}
                  className="p-1 text-[#94A3B8] hover:text-[#FF4757] transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSignInOpen(true)}
                className="btn-cinematic-cyan flex items-center gap-2 px-4 py-1.5 text-xs font-bold transition active:scale-95 cursor-pointer shadow-cyan-glow"
              >
                <LogIn className="w-3.5 h-3.5 text-[#070B14]" />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-xl text-[#94A3B8] hover:text-[#F4F7FB] hover:bg-[#111A2E] transition"
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
                    ? 'text-[#00E5FF]'
                    : 'text-[#94A3B8] hover:text-[#F4F7FB]'
                  }
                `}
              >
                <Icon className={`w-3.5 h-3.5 transition-all duration-200 ${isActive ? 'text-[#00E5FF] scale-110' : 'text-[#64748B] group-hover:text-[#F4F7FB]'}`} />
                {item.label}
                {/* Active underline glow with electric Cyan & Violet */}
                <span className={`absolute bottom-0 left-2 right-2 h-[2.5px] rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#00E5FF] via-[#8B5CF6] to-[#FFFFFF] opacity-100 shadow-[0_0_12px_rgba(0,229,255,0.9)]'
                    : 'bg-transparent opacity-0'
                }`} />
              </button>
            );
          })}
        </nav>

        {/* ── Mobile dropdown nav ── */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-[#00E5FF]/20 bg-[#070B14] px-3 py-2 flex flex-col gap-1 animate-fade-in">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-left transition-all ${
                    isActive
                      ? 'bg-[#00E5FF] text-[#070B14] shadow-cyan-glow'
                      : 'text-[#94A3B8] hover:text-[#F4F7FB] hover:bg-[#0D1424]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#070B14]' : 'text-[#94A3B8]'}`} />
                  {item.label}
                </button>
              );
            })}
            <div className="border-t border-[#00E5FF]/15 mt-1 pt-2 flex flex-col gap-1">
              <button
                onClick={handleSeedData}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-[#94A3B8] hover:text-[#F4F7FB] bg-[#0D1424] transition"
              >
                <Database className="w-3.5 h-3.5 text-[#00E5FF]" />
                Reset Sample Data
              </button>
            </div>
          </nav>
        )}
      </header>

      {/* ── Page Title Header (Only for non-overview tabs) ── */}
      {activeTab !== 'overview' && (
        <div className="bg-[#05080F] border-b border-[#00E5FF]/15 px-6 py-4 animate-fade-in">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-[16px] font-black tracking-tight text-[#F4F7FB]">{currentHeader.title}</h1>
              <p className="text-[11px] text-[#94A3B8] mt-0.5 font-medium">{currentHeader.subtitle}</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#00E5FF]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-ping" />
              <span>Live System</span>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          MAIN CONTENT
         ══════════════════════════════════════ */}
      <main className="flex-1 w-full mx-auto animate-fade-in transition-all duration-300">
        
        {activeTab === 'overview' && (
          <CinematicHero
            onLaunchDashboard={() => setActiveTab('dashboard')}
            onExplore={() => setActiveTab('patterns')}
            onQuickAnalyze={() => setActiveTab('analyze')}
          />
        )}

        {activeTab === 'dashboard' && (
          <div className="p-6 max-w-7xl mx-auto space-y-6">
            <Dashboard
              stats={stats}
              hseAnalytics={hseAnalytics}
              onSelectReport={(rep) => setSelectedReport(rep)}
              onNavigateToAnalyze={() => setActiveTab('analyze')}
            />
          </div>
        )}

        {activeTab === 'analyze' && (
          <div className="p-6 max-w-7xl mx-auto space-y-6">
            <AnalyzeReport onAnalyzeComplete={handleAnalyzeComplete} />
          </div>
        )}

        {activeTab === 'result' && (
          <div className="p-6 max-w-7xl mx-auto space-y-6">
            <AnalysisResult
              resultData={latestAnalysisResult}
              requestMetadata={latestRequestMetadata}
              onBackToAnalyze={() => setActiveTab('analyze')}
              onNavigateToDashboard={() => setActiveTab('dashboard')}
            />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="p-6 max-w-7xl mx-auto space-y-6">
            <ReportsHistory
              reports={reports}
              onSelectReport={(rep) => setSelectedReport(rep)}
              onRefresh={fetchData}
            />
          </div>
        )}

        {activeTab === 'lsr' && (
          <div className="p-6 max-w-7xl mx-auto space-y-6">
            <LifeSavingRules />
          </div>
        )}

        {activeTab === 'patterns' && (
          <div className="p-6 max-w-7xl mx-auto space-y-6">
            <PatternIntelligence />
          </div>
        )}

        {activeTab === 'pngrb' && (
          <div className="p-6 max-w-7xl mx-auto space-y-6">
            <PNGRBReports />
          </div>
        )}
      </main>

      {/* ══════════════════════════════════════
          FOOTER — Preserving Developer Credit
         ══════════════════════════════════════ */}
      <footer className="py-4 px-6 border-t border-[#00E5FF]/20 bg-[#05080F] text-xs flex flex-col sm:flex-row items-center justify-between gap-2 text-[#94A3B8]">
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-[#00E5FF]" />
          <span>PrecurAi &copy; 2026 — AI-powered SIF Precursor Detection &amp; HSE Intelligence</span>
        </div>
        <div className="flex items-center gap-1.5 font-medium">
          <span>Developer:</span>
          <a
            href="https://github.com/adityaahamana18"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#00E5FF] hover:text-[#FFFFFF] font-semibold hover:underline transition-colors"
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
