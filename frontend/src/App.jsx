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
  Menu,
  X,
  Sparkles,
  Share2,
  User,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
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
    const timer = setTimeout(() => setInitialLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Firebase auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          email: firebaseUser.email || 'officer@precurai.com',
          name: (firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'HSE Officer').toUpperCase(),
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
    { id: 'patterns', label: 'Pattern Matrix', icon: Share2 },
    { id: 'pngrb', label: 'PNGRB Regulations', icon: FileCheck },
  ];

  if (initialLoading) {
    return <PrecurAiLoader label="Initializing SIF Precursor Intelligence Engine..." />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#080C14] text-[#F4F7FB] font-sans overflow-x-hidden selection:bg-[#00E5FF] selection:text-[#080C14]">

      {/* ══════════════════════════════════════
          TOP NAVIGATION BAR (Clean, Single Tier)
         ══════════════════════════════════════ */}
      <header className="sticky top-0 z-40 bg-[#080C14]/90 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 h-16">
          
          {/* Brand */}
          <div
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0F1626] to-[#151F36] border border-white/[0.12] flex items-center justify-center p-1 group-hover:border-[#00E5FF]/50 transition-all duration-300">
              <img src="/logo.png" alt="PrecurAi Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-extrabold text-[17px] tracking-tight text-[#F4F7FB]">
                Precur<span className="text-[#00E5FF]">Ai</span>
              </span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-white/[0.08] text-[#00E5FF] shadow-sm'
                      : 'text-[#94A3B8] hover:text-[#F4F7FB] hover:bg-white/[0.03]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#00E5FF]' : 'text-[#64748B]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Reset Data Pill */}
            <button
              onClick={handleSeedData}
              title="Reset Sample Data"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#94A3B8] hover:text-[#00E5FF] bg-white/[0.03] hover:bg-white/[0.06] rounded-lg border border-white/[0.06] transition"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>

            {/* Operational Ping */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.06]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2EE59D] animate-pulse" />
              <span className="text-[11px] font-medium text-[#94A3B8]">Live System</span>
            </div>

            {/* Auth */}
            {currentUser ? (
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08]">
                <div className="w-5 h-5 rounded-full bg-[#00E5FF] text-[#080C14] flex items-center justify-center font-bold text-[10px]">
                  <User className="w-3 h-3" />
                </div>
                <span className="hidden md:block text-xs font-semibold text-[#F4F7FB]">{currentUser.name}</span>
                <button
                  onClick={handleUserSignOut}
                  className="text-[#94A3B8] hover:text-[#FF4757] transition-colors p-0.5"
                  title="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSignInOpen(true)}
                className="btn-cinematic-cyan flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold transition active:scale-95 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-[#080C14]" />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F4F7FB] hover:bg-white/[0.05] transition"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <nav className="lg:hidden border-t border-white/[0.08] bg-[#080C14] px-4 py-3 flex flex-col gap-1.5 animate-fade-in">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-left transition-all ${
                    isActive
                      ? 'bg-[#00E5FF] text-[#080C14] font-bold'
                      : 'text-[#94A3B8] hover:text-[#F4F7FB] hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        )}
      </header>

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
          FOOTER
         ══════════════════════════════════════ */}
      <footer className="py-5 px-6 border-t border-white/[0.08] bg-[#080C14] text-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-[#94A3B8]">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="PrecurAi Logo" className="w-4 h-4 object-contain" />
          <span>PrecurAi &copy; 2026 — AI-Powered SIF Precursor Detection &amp; HSE Intelligence</span>
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
