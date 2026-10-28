import React, { useEffect, useState } from 'react';
import { Shield, Zap, Radio } from 'lucide-react';

const BOOT_LINES = [
  'INITIALIZING COBALT NEURAL RUNTIME...',
  'CONNECTING TO SIF HIGH-POTENTIAL ENGINE...',
  'CALIBRATING 9 IOGP SAFETY CONTROLS...',
  'STREAMING PNGRB OFFICIAL PIPELINE INCIDENTS...',
  'COBALT CORE ACTIVE — INDUSTRIAL HSE INTELLIGENCE ONLINE.',
];

export default function PrecurAiLoader({ label = 'Initializing SIF Precursor Intelligence Engine...' }) {
  const [lineIdx, setLineIdx] = useState(0);
  const [dots, setDots] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setLineIdx((i) => (i + 1) % BOOT_LINES.length);
    }, 300);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setDots((d) => (d.length >= 3 ? '' : d + '.'));
    }, 350);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 15, 98));
    }, 140);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#000000] select-none overflow-hidden font-sans">
      {/* High-Contrast Cobalt Radial Energy Glows */}
      <div className="absolute w-[650px] h-[650px] bg-[#2C3480]/25 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute w-[340px] h-[340px] bg-[#4E5BC9]/20 rounded-full blur-[80px] pointer-events-none translate-y-12" />

      {/* Main Assembly */}
      <div className="relative flex flex-col items-center z-10">

        {/* Hardcore Cobalt Radar Assembly */}
        <div className="relative w-40 h-40 flex items-center justify-center mb-8">
          {/* Outermost Ping */}
          <div className="absolute inset-0 rounded-full border border-[#2C3480]/40 animate-ping" style={{ animationDuration: '2.5s' }} />

          {/* Secondary Pulse */}
          <div className="absolute inset-2 rounded-full border border-[#4E5BC9]/30 animate-ping" style={{ animationDuration: '1.8s', animationDelay: '0.3s' }} />

          {/* Hardcore Rotating Conic Radar Sweep */}
          <div
            className="absolute inset-4 rounded-full animate-radar"
            style={{
              background: 'conic-gradient(from 0deg, transparent 0%, rgba(78,91,201,0.45) 15%, transparent 25%)',
            }}
          />

          {/* Static Dashed Ring */}
          <div className="absolute inset-4 rounded-full border border-dashed border-[#2C3480]/70" />

          {/* Counter-Spin Electric Ring */}
          <div
            className="absolute inset-6 rounded-full border-2 border-transparent border-t-[#FFFFFF] border-r-[#4E5BC9] animate-radar"
            style={{ animationDirection: 'reverse', animationDuration: '3.5s' }}
          />

          {/* Center Cobalt Brand Shield */}
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3D48A3] via-[#2C3480] to-[#0A0D22] border-2 border-[#4E5BC9] flex items-center justify-center shadow-cobalt-glow">
            <Shield className="w-8 h-8 text-[#FFFFFF] drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#FFFFFF] animate-pulse shadow-[0_0_8px_#FFFFFF]" />
          </div>

          {/* Radar Blip Dots */}
          {[{ deg: 40, dist: 46 }, { deg: 160, dist: 42 }, { deg: 280, dist: 48 }].map(({ deg, dist }, i) => {
            const r = (Math.PI * deg) / 180;
            return (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-[#FFFFFF] animate-pulse"
                style={{
                  left: `calc(50% + ${dist * Math.cos(r)}px)`,
                  top: `calc(50% + ${dist * Math.sin(r)}px)`,
                  transform: 'translate(-50%, -50%)',
                  animationDelay: `${i * 0.4}s`,
                  boxShadow: '0 0 10px #FFFFFF, 0 0 20px #4E5BC9',
                }}
              />
            );
          })}
        </div>

        {/* Brand Name Typography */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2.5 mb-1.5">
            <h1 className="text-3xl font-black tracking-tight text-[#FFFFFF]">
              Precur<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4E5BC9] to-[#8B9DE0]">Ai</span>
            </h1>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#FFFFFF] bg-[#2C3480] border border-[#4E5BC9] px-2 py-0.5 rounded-md shadow-cobalt-glow">
              HSE
            </span>
          </div>
          <p className="text-[11px] text-[#BAC4EB] font-mono tracking-widest uppercase">
            Industrial SIF Intelligence &amp; Safety Analytics
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-72 mb-4">
          <div className="flex justify-between text-[10px] text-[#BAC4EB] mb-1.5 font-mono">
            <span className="font-bold">SYSTEM BOOT</span>
            <span className="text-[#FFFFFF] font-bold">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-[#05070E] rounded-full overflow-hidden border border-[#2C3480]/80 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-[#2C3480] via-[#4E5BC9] to-[#FFFFFF] rounded-full transition-all duration-150"
              style={{ width: `${progress}%`, boxShadow: '0 0 14px rgba(78,91,201,0.9)' }}
            />
          </div>
        </div>

        {/* Terminal Boot Log */}
        <div className="w-72 bg-[#05070E]/95 border border-[#2C3480] rounded-xl p-3 font-mono text-[10px] space-y-1 min-h-[56px] shadow-inner">
          <div className="flex items-start gap-2 text-[#FFFFFF]">
            <span className="text-[#4E5BC9] font-bold shrink-0">›</span>
            <span>{BOOT_LINES[lineIdx]}</span>
          </div>
          <div className="flex items-center gap-2 text-[#4E5BC9]">
            <span className="text-[#4E5BC9] font-bold shrink-0">›</span>
            <span className="text-[#FFFFFF]">_</span>
            <span className="animate-pulse text-[#BAC4EB]">active{dots}</span>
          </div>
        </div>

        {/* System Tag */}
        <p className="mt-5 text-[10px] text-[#64748B] font-mono tracking-widest">
          v2.0.0-COBALT · IOGP LSR · PNGRB
        </p>
      </div>
    </div>
  );
}
