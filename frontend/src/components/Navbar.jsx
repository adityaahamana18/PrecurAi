import React from 'react';
import { 
  Shield, 
  LayoutDashboard, 
  Search, 
  BookOpen, 
  Database, 
  FileText, 
  History, 
  FileCheck, 
  ChevronRight, 
  User, 
  LogIn, 
  LogOut,
  Sparkles,
  Zap
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, darkMode, setDarkMode, onSeedData, hasActiveResult, user, onSignOut, onOpenSignIn }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard, color: 'from-blue-500 to-indigo-600' },
    { id: 'analyze', label: 'AI Risk Analyzer', icon: Search, color: 'from-violet-500 to-purple-600' },
    ...(hasActiveResult ? [{ id: 'result', label: 'Analysis Intel', icon: FileText, color: 'from-pink-500 to-rose-600' }] : []),
    { id: 'history', label: 'Incident Registry', icon: History, color: 'from-amber-500 to-orange-600' },
    { id: 'lsr', label: 'Life-Saving Rules', icon: BookOpen, color: 'from-emerald-500 to-teal-600' },
    { id: 'pngrb', label: 'PNGRB Regulations', icon: FileCheck, color: 'from-cyan-500 to-blue-600' },
  ];

  return (
    <aside className="w-72 bg-gradient-to-b from-[#0F172A] via-[#111827] to-[#0A0D14] text-slate-100 flex flex-col shrink-0 border-r border-slate-800/80 select-none min-h-screen relative z-20 shadow-2xl">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800/80 relative overflow-hidden group">
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl group-hover:bg-pink-500/30 transition-all duration-700" />
        <div className="flex items-center gap-3.5 relative z-10">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center font-bold shadow-lg shadow-purple-500/30 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
            <Shield className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-wide bg-gradient-to-r from-white via-slate-100 to-purple-200 bg-clip-text text-transparent">
                PrecurAi
              </span>
              <span className="bg-gradient-to-r from-pink-500/30 to-purple-500/30 text-pink-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-pink-500/40 uppercase tracking-widest flex items-center gap-1 animate-pulse">
                <Sparkles className="w-2.5 h-2.5 text-pink-400" />
                HSE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">SIF Intelligence Platform</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-3">
          Control Center
        </span>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all duration-300 transform group relative overflow-hidden ${
                isActive
                  ? `bg-gradient-to-r ${item.color} text-white shadow-lg shadow-indigo-500/25 translate-x-1.5`
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60 hover:translate-x-1'
              }`}
            >
              <div className="flex items-center gap-3 relative z-10">
                <div className={`p-1.5 rounded-lg transition-transform duration-300 group-hover:scale-110 ${isActive ? 'bg-white/20' : 'bg-slate-800 text-slate-300'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="tracking-wide text-[13px]">{item.label}</span>
              </div>
              {isActive && (
                <ChevronRight className="w-4 h-4 opacity-90 animate-pulse relative z-10" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer Controls */}
      <div className="p-4 border-t border-slate-800/90 space-y-3 bg-[#080B11]/90">
        {user ? (
          <button
            onClick={onSignOut}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-bold text-rose-300 hover:text-white bg-gradient-to-r from-rose-950/60 to-red-950/60 hover:from-rose-900/80 hover:to-red-900/80 rounded-xl border border-rose-700/50 shadow-md transition-all active:scale-95"
            title="Sign out of session"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Sign Out ({user.name || 'User'})</span>
          </button>
        ) : (
          <button
            onClick={onOpenSignIn}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:brightness-110 rounded-xl shadow-lg shadow-purple-600/30 transition-all active:scale-95 animate-neon-glow"
            title="Open sign in popup"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to Portal</span>
          </button>
        )}

        <button
          onClick={onSeedData}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/90 hover:bg-slate-700 rounded-xl border border-slate-700/80 transition-all hover:border-slate-500 active:scale-95"
          title="Reset sample dataset"
        >
          <Database className="w-3.5 h-3.5 text-cyan-400" />
          <span>Reset Sample Data</span>
        </button>

        <div className="flex items-center justify-between px-3 py-2 text-[11px] text-slate-400 border-t border-slate-800/80 pt-2.5">
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Core Engine:
          </span>
          <span className="text-emerald-400 font-bold flex items-center gap-1.5 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/60">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            Online
          </span>
        </div>

        <div className="flex items-center justify-between px-3 py-1.5 text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
          <span>Lead Developer:</span>
          <span className="font-bold bg-gradient-to-r from-cyan-400 via-sky-400 to-pink-400 bg-clip-text text-transparent">
            Aditya Ahamana
          </span>
        </div>
      </div>
    </aside>
  );
}
