import React, { useEffect, useState } from 'react';

const BOOT_LINES = [
  'Loading safety intelligence core...',
  'Calibrating IOGP Life-Saving Rules...',
  'Synchronizing regulatory registry...',
  'PrecurAi operational.',
];

export default function PrecurAiLoader({ label = 'Initializing SIF Precursor Intelligence Engine...' }) {
  const [lineIdx, setLineIdx] = useState(0);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    const id = setInterval(() => {
      setLineIdx((i) => (i + 1) % BOOT_LINES.length);
    }, 320);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 20, 98));
    }, 120);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#080C14] select-none overflow-hidden font-sans text-[#F4F7FB]">
      
      {/* ── Soft Ambient Glow ── */}
      <div className="absolute w-[500px] h-[500px] bg-[#00E5FF]/08 rounded-full blur-[140px] pointer-events-none" />

      {/* ── Main Loading Assembly ── */}
      <div className="relative flex flex-col items-center z-10 space-y-6">

        {/* Breathing Logo */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          <div className="absolute inset-0 rounded-3xl border border-[#00E5FF]/30 animate-ping" style={{ animationDuration: '3s' }} />
          <div className="w-20 h-20 rounded-2xl bg-[#0F1626] border border-white/[0.12] flex items-center justify-center shadow-2xl p-2.5">
            <img src="/logo.png" alt="PrecurAi Logo" className="w-full h-full object-contain drop-shadow-[0_0_16px_rgba(0,229,255,0.7)]" />
          </div>
        </div>

        {/* Brand */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-black tracking-tight text-[#F4F7FB]">
            Precur<span className="text-[#00E5FF]">Ai</span>
          </h1>
          <p className="text-xs text-[#94A3B8]">
            SIF Precursor Intelligence Platform
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-64 bg-white/[0.04] h-1.5 rounded-full overflow-hidden border border-white/[0.08] p-0.5">
          <div
            className="h-full rounded-full bg-[#00E5FF] transition-all duration-150 ease-out shadow-[0_0_8px_#00E5FF]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Status Text */}
        <div className="text-xs text-[#94A3B8] font-mono tracking-wide h-4">
          {BOOT_LINES[lineIdx]}
        </div>

      </div>

    </div>
  );
}
