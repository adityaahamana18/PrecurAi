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
  Activity
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onSeedData, hasActiveResult, user, onSignOut, onOpenSignIn }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'analyze', label: 'Analyze Safety Report', icon: Search },
    ...(hasActiveResult ? [{ id: 'result', label: 'Analysis Result', icon: FileText }] : []),
    { id: 'history', label: 'Incident Registry', icon: History },
    { id: 'lsr', label: 'Life-Saving Rules', icon: BookOpen },
    { id: 'pngrb', label: 'PNGRB Regulations', icon: FileCheck },
  ];

  return (
    <aside className="w-64 bg-[#0D131F] text-slate-200 flex flex-col shrink-0 border-r border-slate-800/90 select-none min-h-screen relative z-20">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/90 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-sky-600 to-slate-800 text-white flex items-center justify-center font-bold shadow-md shadow-sky-950/80 border border-sky-500/30">
          <Shield className="w-5 h-5 text-sky-200" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-base tracking-wider text-white">
              Precur<span className="text-sky-400">Ai</span>
            </span>
            <span className="bg-sky-950 text-sky-400 text-[9px] font-bold px-1.5 py-0.5 rounded border border-sky-800/80 uppercase tracking-wider">
              HSE
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">SIF Intelligence Platform</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-2 pt-1">
          Navigation
        </span>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-950/60 font-bold translate-x-1'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70 hover:translate-x-0.5'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {isActive && (
                <ChevronRight className="w-3.5 h-3.5 opacity-80" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer Controls */}
      <div className="p-3 border-t border-slate-800/90 space-y-2 bg-[#0A0E17]">
        {user ? (
          <button
            onClick={onSignOut}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 rounded-lg border border-rose-800/60 transition"
            title="Sign out of session"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span>Sign Out ({user.name || 'User'})</span>
          </button>
        ) : (
          <button
            onClick={onOpenSignIn}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg shadow-sm transition active:scale-98"
            title="Open sign in popup"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In to Platform</span>
          </button>
        )}

        <button
          onClick={onSeedData}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 rounded-lg border border-slate-700/80 transition"
          title="Reset sample dataset"
        >
          <Database className="w-3.5 h-3.5 text-sky-400" />
          <span>Reset Sample Data</span>
        </button>

        <div className="flex items-center justify-between px-2.5 py-1.5 text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
          <span>Engine Status:</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Operational
          </span>
        </div>

        <div className="flex items-center justify-between px-2.5 py-1 text-[11px] text-slate-400 border-t border-slate-800/80 pt-1.5">
          <span>Developer:</span>
          <span className="text-sky-400 font-medium">Aditya Ahamana</span>
        </div>
      </div>
    </aside>
  );
}
