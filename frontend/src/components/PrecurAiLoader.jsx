import React, { useEffect, useState } from 'react';
import { Shield, Zap, Radio, Terminal, Cpu } from 'lucide-react';

const BOOT_LINES = [
  'INITIALIZING PRECURAI NEURAL RUNTIME v2.4...',
  'CONNECTING TO SIF HIGH-POTENTIAL INFERENCE CORE...',
  'CALIBRATING 9 IOGP LIFE-SAVING RULES TAXONOMY...',
  'STREAMING PNGRB REGULATORY PIPELINE INCIDENTS...',
  'COMMAND INTERFACE SYNCHRONIZED — PRECURAI ACTIVE.',
];

export default function PrecurAiLoader({ label = 'Initializing SIF Precursor Intelligence Engine...' }) {
  const [lineIdx, setLineIdx] = useState(0);
  const [dots, setDots] = useState('');
  const [progress, setProgress] = useState(12);

  useEffect(() => {
    const id = setInterval(() => {
      setLineIdx((i) => (i + 1) % BOOT_LINES.length);
    }, 280);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setDots((d) => (d.length >= 3 ? '' : d + '.'));
    }, 300);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 18, 98));
    }, 120);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070B14] select-none overflow-hidden font-sans text-[#F4F7FB]">
      
      {/* ── Cinematic Glows ── */}
      <div className="absolute w-[650px] h-[650px] bg-[#00E5FF]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] bg-[#8B5CF6]/15 rounded-full blur-[100px] pointer-events-none translate-y-12" />

      {/* ── Main Radar Assembly ── */}
      <div className="relative flex flex-col items-center z-10">

        {/* 3D Rotating Core Radar */}
        <div className="relative w-44 h-44 flex items-center justify-center mb-8">
          {/* Outermost Ping */}
          <div className="absolute inset-0 rounded-full border border-[#00E5FF]/30 animate-ping" style={{ animationDuration: '2.5s' }} />

          {/* Secondary Pulse */}
          <div className="absolute inset-2 rounded-full border border-[#8B5CF6]/30 animate-ping" style={{ animationDuration: '1.8s', animationDelay: '0.4s' }} />

          {/* Rotating Conic Sweep */}
          <div
            className="absolute inset-4 rounded-full animate-core-spin"
            style={{
              background: 'conic-gradient(from 0deg, transparent 0%, rgba(0,229,255,0.4) 15%, transparent 30%)',
            }}
          />

          {/* Static Dashed Ring */}
          <div className="absolute inset-4 rounded-full border border-dashed border-[#00E5FF]/40" />

          {/* Reverse Spin Ring */}
          <div
            className="absolute inset-6 rounded-full border-2 border-transparent border-t-[#00E5FF] border-r-[#8B5CF6] animate-core-reverse"
          />

          {/* Center AI Core */}
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0D1424] via-[#111A2E] to-[#070B14] border-2 border-[#00E5FF] flex items-center justify-center shadow-cyan-glow p-2.5 overflow-hidden">
            <img src="/logo.png" alt="PrecurAi Core Logo" className="w-14 h-14 object-contain drop-shadow-[0_0_16px_rgba(0,229,255,0.95)]" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse shadow-[0_0_10px_#00E5FF]" />
          </div>

          {/* Radar Blip Dots */}
          {[{ deg: 45, dist: 52 }, { deg: 165, dist: 48 }, { deg: 285, dist: 54 }].map(({ deg, dist }, i) => {
            const r = (Math.PI * deg) / 180;
            return (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse"
                style={{
                  left: `calc(50% + ${dist * Math.cos(r)}px)`,
                  top: `calc(50% + ${dist * Math.sin(r)}px)`,
                  transform: 'translate(-50%, -50%)',
                  animationDelay: `${i * 0.4}s`,
                  boxShadow: '0 0 10px #00E5FF, 0 0 20px #8B5CF6',
                }}
              />
            );
          })}
        </div>

        {/* Brand Name Typography */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2.5 mb-1.5">
            <h1 className="text-3xl font-black tracking-tight text-[#F4F7FB]">
              Precur<span className="text-[#00E5FF]">Ai</span>
            </h1>
            <span className="bg-[#00E5FF] text-[#070B14] text-[9px] font-black px-2 py-0.5 rounded-full border border-[#00E5FF] uppercase tracking-[0.2em] shadow-sm">
              HSE AI
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] font-mono tracking-widest uppercase">
            Serious Injury &amp; Fatality Precursor Intelligence
          </p>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="w-72 bg-[#0D1424] h-2 rounded-full overflow-hidden border border-[#00E5FF]/30 mb-4 p-0.5 shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#00E5FF] via-[#8B5CF6] to-[#00E5FF] transition-all duration-150 ease-out shadow-[0_0_12px_#00E5FF]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Live Terminal Telemetry Output */}
        <div className="flex items-center gap-2 text-xs font-mono text-[#00E5FF] max-w-sm text-center">
          <Terminal className="w-3.5 h-3.5 text-[#00E5FF] shrink-0" />
          <span className="truncate">{BOOT_LINES[lineIdx]}</span>
          <span className="w-2 text-left">{dots}</span>
        </div>

      </div>

    </div>
  );
}
