import React, { useEffect, useState } from 'react';
import { Shield, Radio, Zap } from 'lucide-react';

const BOOT_LINES = [
  'Connecting to SIF Precursor Neural Engine...',
  'Loading IOGP Life-Saving Rules taxonomy...',
  'Initializing barrier failure classifier...',
  'Calibrating confidence scoring model...',
  'Fetching PNGRB incident reference database...',
  'System ready — PrecurAi HSE Intelligence online.',
];

export default function PrecurAiLoader({ label = 'Initializing SIF Precursor Intelligence Engine...' }) {
  const [lineIdx, setLineIdx] = useState(0);
  const [dots, setDots] = useState('');
  const [progress, setProgress] = useState(0);

  // Cycle boot lines
  useEffect(() => {
    const id = setInterval(() => {
      setLineIdx((i) => (i + 1) % BOOT_LINES.length);
    }, 320);
    return () => clearInterval(id);
  }, []);

  // Animate dots
  useEffect(() => {
    const id = setInterval(() => {
      setDots((d) => (d.length >= 3 ? '' : d + '.'));
    }, 380);
    return () => clearInterval(id);
  }, []);

  // Fake progress
  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 12, 95));
    }, 150);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#060A12] select-none overflow-hidden">
      {/* Subtle background grid */}
      <div className="absolute inset-0 bg-grid-dark opacity-30 pointer-events-none" />

      {/* Radial background glow */}
      <div className="absolute w-[600px] h-[600px] bg-sky-600/8 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute w-[300px] h-[300px] bg-blue-700/6 rounded-full blur-[80px] pointer-events-none translate-y-12" />

      {/* ── Main content ── */}
      <div className="relative flex flex-col items-center z-10">

        {/* Radar ring assembly */}
        <div className="relative w-36 h-36 flex items-center justify-center mb-8">
          {/* Outermost ping */}
          <div className="absolute inset-0 rounded-full border border-sky-500/10 animate-ping" style={{ animationDuration: '3s' }} />

          {/* Outer slow pulse */}
          <div className="absolute inset-2 rounded-full border border-sky-500/15 animate-ping" style={{ animationDuration: '2.2s', animationDelay: '0.4s' }} />

          {/* Rotating radar sweep (conic gradient) */}
          <div
            className="absolute inset-4 rounded-full animate-radar"
            style={{
              background: 'conic-gradient(from 0deg, transparent 0%, rgba(56,189,248,0.25) 15%, transparent 20%)',
            }}
          />

          {/* Static dashed ring */}
          <div className="absolute inset-4 rounded-full border border-dashed border-sky-800/50" />

          {/* Counter-spin ring */}
          <div
            className="absolute inset-6 rounded-full border-2 border-transparent border-t-sky-400/70 border-r-blue-500/50 animate-radar"
            style={{ animationDirection: 'reverse', animationDuration: '4s' }}
          />

          {/* Inner tick marks (static) */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 144 144">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
              const r = Math.PI * deg / 180;
              const x1 = 72 + 50 * Math.cos(r);
              const y1 = 72 + 50 * Math.sin(r);
              const x2 = 72 + 56 * Math.cos(r);
              const y2 = 72 + 56 * Math.sin(r);
              return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(56,189,248,0.3)" strokeWidth="1.5" />;
            })}
            {/* Cross hairs */}
            <line x1="52" y1="72" x2="92" y2="72" stroke="rgba(56,189,248,0.12)" strokeWidth="1" />
            <line x1="72" y1="52" x2="72" y2="92" stroke="rgba(56,189,248,0.12)" strokeWidth="1" />
          </svg>

          {/* Center shield */}
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-600 via-blue-700 to-slate-900 border border-sky-400/30 flex items-center justify-center shadow-xl shadow-sky-950/60">
            <Shield className="w-8 h-8 text-sky-100" />
            {/* Corner accent dots */}
            <span className="absolute top-1.5 right-1.5 w-1 h-1 rounded-full bg-sky-400 animate-pulse" />
          </div>

          {/* Blip dots on radar */}
          {[{ deg: 35, dist: 42 }, { deg: 150, dist: 38 }, { deg: 260, dist: 44 }].map(({ deg, dist }, i) => {
            const r = Math.PI * deg / 180;
            return (
              <div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse"
                style={{
                  left: `calc(50% + ${dist * Math.cos(r)}px)`,
                  top:  `calc(50% + ${dist * Math.sin(r)}px)`,
                  transform: 'translate(-50%, -50%)',
                  animationDelay: `${i * 0.4}s`,
                  animationDuration: `${1.5 + i * 0.3}s`,
                  opacity: 0.7,
                  boxShadow: '0 0 6px rgba(56,189,248,0.9)',
                }}
              />
            );
          })}
        </div>

        {/* Brand name */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2.5 mb-1">
            <h1 className="text-3xl font-black tracking-tight text-white">
              Precur<span className="text-sky-400">Ai</span>
            </h1>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-sky-300 bg-sky-950/80 border border-sky-700/60 px-2 py-0.5 rounded-md">
              HSE
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium tracking-widest uppercase">
            Industrial SIF Intelligence &amp; Safety Analytics
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-64 mb-4">
          <div className="flex justify-between text-[10px] text-slate-500 mb-1.5 font-mono">
            <span>SYSTEM BOOT</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
            <div
              className="h-full bg-gradient-to-r from-sky-600 via-blue-400 to-sky-500 rounded-full transition-all duration-150"
              style={{ width: `${progress}%`, boxShadow: '0 0 8px rgba(56,189,248,0.6)' }}
            />
          </div>
        </div>

        {/* Boot log terminal */}
        <div className="w-64 bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 font-mono text-[10px] space-y-0.5 min-h-[54px]">
          <div className="flex items-start gap-2 text-emerald-400">
            <span className="text-slate-600 shrink-0">›</span>
            <span>{BOOT_LINES[lineIdx]}</span>
          </div>
          <div className="flex items-center gap-2 text-sky-500">
            <span className="text-slate-600 shrink-0">›</span>
            <span className="text-sky-400">_</span>
            <span className="animate-pulse">ready{dots}</span>
          </div>
        </div>

        {/* Version tag */}
        <p className="mt-5 text-[10px] text-slate-600 font-mono tracking-widest">
          v2.0.0-precurai · IOGP LSR · PNGRB
        </p>
      </div>
    </div>
  );
}
