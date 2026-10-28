import React, { useEffect, useState } from 'react';
import { Shield, Sparkles } from 'lucide-react';

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
      setProgress((p) => Math.min(p + Math.random() * 14, 98));
    }, 150);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#120817] select-none overflow-hidden">
      {/* Sunset radial glows */}
      <div className="absolute w-[600px] h-[600px] bg-plum-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute w-[360px] h-[360px] bg-coral-500/12 rounded-full blur-[90px] pointer-events-none translate-y-12" />

      {/* Main content */}
      <div className="relative flex flex-col items-center z-10">

        {/* Radar ring assembly */}
        <div className="relative w-36 h-36 flex items-center justify-center mb-8">
          {/* Outermost ping */}
          <div className="absolute inset-0 rounded-full border border-coral-500/20 animate-ping" style={{ animationDuration: '3s' }} />

          {/* Outer slow pulse */}
          <div className="absolute inset-2 rounded-full border border-apricot-500/20 animate-ping" style={{ animationDuration: '2.2s', animationDelay: '0.4s' }} />

          {/* Rotating radar sweep with sunset coral/gold conic gradient */}
          <div
            className="absolute inset-4 rounded-full animate-radar"
            style={{
              background: 'conic-gradient(from 0deg, transparent 0%, rgba(237,148,119,0.3) 15%, transparent 22%)',
            }}
          />

          {/* Static dashed ring */}
          <div className="absolute inset-4 rounded-full border border-dashed border-plum-700/60" />

          {/* Counter-spin ring */}
          <div
            className="absolute inset-6 rounded-full border-2 border-transparent border-t-coral-400 border-r-plum-500 animate-radar"
            style={{ animationDirection: 'reverse', animationDuration: '4s' }}
          />

          {/* Center shield in sunset gradient */}
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-coral-500 via-plum-600 to-velvet-900 border border-coral-400/40 flex items-center justify-center shadow-xl shadow-coral-500/25">
            <Shield className="w-8 h-8 text-white" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-apricot-300 animate-pulse" />
          </div>

          {/* Radar Blip dots */}
          {[{ deg: 35, dist: 42 }, { deg: 150, dist: 38 }, { deg: 260, dist: 44 }].map(({ deg, dist }, i) => {
            const r = Math.PI * deg / 180;
            return (
              <div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full bg-apricot-400 animate-pulse"
                style={{
                  left: `calc(50% + ${dist * Math.cos(r)}px)`,
                  top:  `calc(50% + ${dist * Math.sin(r)}px)`,
                  transform: 'translate(-50%, -50%)',
                  animationDelay: `${i * 0.4}s`,
                  animationDuration: `${1.5 + i * 0.3}s`,
                  boxShadow: '0 0 8px rgba(251,198,124,0.9)',
                }}
              />
            );
          })}
        </div>

        {/* Brand name */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2.5 mb-1.5">
            <h1 className="text-3xl font-black tracking-tight text-white">
              Precur<span className="text-transparent bg-clip-text bg-gradient-to-r from-coral-400 to-apricot-300">Ai</span>
            </h1>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white bg-gradient-to-r from-coral-500 to-plum-600 border border-coral-400/40 px-2 py-0.5 rounded-md shadow-sm">
              HSE
            </span>
          </div>
          <p className="text-[11px] text-plum-300 font-medium tracking-widest uppercase">
            Industrial SIF Intelligence &amp; Safety Analytics
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-64 mb-4">
          <div className="flex justify-between text-[10px] text-plum-400 mb-1.5 font-mono">
            <span>NEURAL KERNEL</span>
            <span className="text-apricot-400">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-1.5 bg-velvet-950 rounded-full overflow-hidden border border-plum-800/60">
            <div
              className="h-full bg-gradient-to-r from-plum-600 via-coral-500 to-apricot-400 rounded-full transition-all duration-150"
              style={{ width: `${progress}%`, boxShadow: '0 0 10px rgba(237,148,119,0.7)' }}
            />
          </div>
        </div>

        {/* Boot log terminal */}
        <div className="w-64 bg-velvet-950/90 border border-plum-800/80 rounded-xl p-3 font-mono text-[10px] space-y-0.5 min-h-[54px] shadow-inner">
          <div className="flex items-start gap-2 text-apricot-300">
            <span className="text-plum-500 shrink-0">›</span>
            <span>{BOOT_LINES[lineIdx]}</span>
          </div>
          <div className="flex items-center gap-2 text-coral-400">
            <span className="text-plum-500 shrink-0">›</span>
            <span>_</span>
            <span className="animate-pulse">ready{dots}</span>
          </div>
        </div>

        {/* Version tag */}
        <p className="mt-5 text-[10px] text-plum-400/70 font-mono tracking-widest">
          v2.0.0-precurai · IOGP LSR · PNGRB
        </p>
      </div>
    </div>
  );
}
