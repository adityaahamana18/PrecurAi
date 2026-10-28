import React from 'react';
import { Shield } from 'lucide-react';

export default function PrecurAiLoader({ label = "Initializing SIF Precursor Neural Engine..." }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#090D16] select-none overflow-hidden">
      {/* Subtle executive radial glow */}
      <div className="absolute w-[450px] h-[450px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative flex flex-col items-center">
        {/* Animated concentric scanning radar rings */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          {/* Outer slow pulse ring */}
          <div className="absolute inset-0 rounded-full border border-sky-500/20 animate-ping opacity-40 duration-1000" />
          
          {/* Middle rotating dash ring */}
          <div className="absolute inset-1 rounded-full border-2 border-transparent border-t-sky-500 border-r-blue-600 animate-spin" style={{ animationDuration: '2.5s' }} />
          
          {/* Reverse counter spin ring */}
          <div className="absolute inset-3 rounded-full border border-slate-700/60 border-b-sky-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '3.5s' }} />

          {/* Center glowing corporate shield brand icon */}
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-b from-sky-600 to-slate-900 border border-sky-400/40 flex items-center justify-center shadow-xl shadow-sky-950/60 transform transition-transform animate-pulse">
            <Shield className="w-8 h-8 text-sky-200" />
          </div>
        </div>

        {/* Brand Name Typography */}
        <div className="mt-8 text-center space-y-1">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-bold tracking-wider text-white">
              Precur<span className="text-sky-400">Ai</span>
            </h1>
            <span className="text-[10px] uppercase font-bold tracking-widest text-sky-300 bg-sky-950/70 border border-sky-800/80 px-2 py-0.5 rounded-md">
              HSE
            </span>
          </div>
          <p className="text-xs text-slate-400 font-normal tracking-wide">
            Industrial SIF Intelligence & Safety Analytics
          </p>
        </div>

        {/* Animated Progress Bar */}
        <div className="w-56 h-1 bg-slate-800/80 rounded-full overflow-hidden mt-6 relative border border-slate-700/40">
          <div className="h-full bg-gradient-to-r from-sky-500 via-blue-500 to-sky-400 rounded-full w-full animate-loader-bar" />
        </div>

        {/* Dynamic status label */}
        <p className="text-[11px] text-slate-400 mt-3 font-medium tracking-wide flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
          <span>{label}</span>
        </p>
      </div>
    </div>
  );
}
