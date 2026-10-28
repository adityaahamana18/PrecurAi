import React from 'react';
import { Shield, LayoutDashboard, Search, BookOpen, AlertTriangle, Moon, Sun, Database, FileText, History, FileCheck, ChevronRight, User } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, darkMode, setDarkMode, onSeedData, hasActiveResult }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analyze', label: 'Analyze Safety Report', icon: Search },
    ...(hasActiveResult ? [{ id: 'result', label: 'Analysis Result', icon: FileText }] : []),
    { id: 'history', label: 'Reports History', icon: History },
    { id: 'lsr', label: 'Life-Saving Rules', icon: BookOpen },
    { id: 'pngrb', label: 'Incident Reports', icon: FileCheck },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col shrink-0 border-r border-slate-800 select-none min-h-screen">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-sky-700 text-white flex items-center justify-center font-bold shadow-sm">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-base tracking-tight text-white">PrecurAi</span>
            <span className="bg-sky-500/20 text-sky-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-sky-500/30 uppercase">
              HSE
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">SIF Intelligence Platform</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 block mb-2 pt-2">
          Navigation
        </span>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                isActive
                  ? 'bg-sky-700 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer Controls */}
      <div className="p-3 border-t border-slate-800 space-y-2 bg-slate-950/60">
        <button
          onClick={onSeedData}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700/80 transition"
          title="Reset sample dataset"
        >
          <Database className="w-3.5 h-3.5 text-sky-400" />
          <span>Reset Sample Data</span>
        </button>

        <div className="flex items-center justify-between px-3 py-2 text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
          <span>System Status:</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Active
          </span>
        </div>

        <div className="flex items-center justify-between px-3 py-1.5 text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
          <span>Developer:</span>
          <span className="text-sky-400 font-medium">Aditya Ahamana</span>
        </div>
      </div>
    </aside>
  );
}
