import React, { useState, useEffect } from 'react';
import {
  Shield,
  Activity,
  AlertTriangle,
  Zap,
  ArrowRight,
  Eye,
  CheckCircle2,
  Cpu,
  Layers,
  Terminal,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export default function CinematicHero({ onExplore, onLaunchDashboard, onQuickAnalyze }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [counter, setCounter] = useState(0);

  // Parallax tracking
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 20; // -10 to +10 deg/px
    const y = (clientY / innerHeight - 0.5) * 20;
    setMousePos({ x, y });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prev) => (prev + 1) % 100);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative min-h-[calc(100vh-140px)] flex flex-col justify-between overflow-hidden py-8 px-4 sm:px-6 lg:px-8 bg-[#070B14]"
    >
      {/* ── Background Cyber Grid & Atmospheric Glows ── */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-[#00E5FF]/10 via-[#8B5CF6]/15 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[#00E5FF]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-[#8B5CF6]/10 rounded-full blur-[90px] pointer-events-none" />

      {/* ── Top Micro-pill Badge ── */}
      <div className="relative z-10 flex justify-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0D1424]/90 border border-[#00E5FF]/30 backdrop-blur-md shadow-[0_0_20px_rgba(0,229,255,0.15)] animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E5FF] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00E5FF]" />
          </span>
          <span className="text-[11px] font-mono tracking-wider font-semibold text-[#00E5FF] uppercase">
            Next-Gen Industrial Safety Intelligence
          </span>
          <span className="text-gray-500 text-xs">|</span>
          <span className="text-[11px] text-[#F4F7FB]/75 font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#8B5CF6]" />
            SIF Precursor AI v2.4
          </span>
        </div>
      </div>

      {/* ── Main Hero Content Grid ── */}
      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center flex-1">
        
        {/* Left Column: Typography & CTAs (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-center text-left space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[#00E5FF] uppercase tracking-[0.2em]">
              <Terminal className="w-4 h-4 text-[#00E5FF]" />
              <span>Real-Time Precursor Extraction</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black tracking-tight text-[#F4F7FB] leading-[1.08]">
              Detect What Could Happen <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-[#8B5CF6] to-[#FFFFFF] drop-shadow-[0_0_30px_rgba(0,229,255,0.35)]">
                Before It Happens.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#94A3B8] max-w-2xl font-normal leading-relaxed pt-2">
              AI-powered safety intelligence that transforms incident reports into explainable SIF insights, 
              helping safety teams identify critical precursors and prioritize human review.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={onLaunchDashboard}
              className="btn-cinematic-cyan light-sweep-btn flex items-center gap-3 px-7 py-3.5 text-sm cursor-pointer active:scale-95 group shadow-cyan-glow"
            >
              <Activity className="w-4 h-4 text-[#070B14] group-hover:rotate-12 transition-transform duration-300" />
              <span>Launch AI Dashboard</span>
              <ArrowRight className="w-4 h-4 text-[#070B14] group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onExplore}
              className="btn-ghost-dark flex items-center gap-2.5 px-6 py-3.5 text-sm cursor-pointer active:scale-95 hover:border-[#8B5CF6]/60 hover:text-[#F4F7FB] group"
            >
              <Eye className="w-4 h-4 text-[#8B5CF6] group-hover:scale-110 transition-transform" />
              <span>Explore Intelligence</span>
            </button>

            <button
              onClick={onQuickAnalyze}
              className="px-4 py-3 text-xs font-mono text-[#94A3B8] hover:text-[#00E5FF] transition-colors flex items-center gap-1.5"
            >
              <span>Try Live Demo</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bottom Live Metric Badges */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#00E5FF]/15 max-w-xl">
            <div>
              <div className="text-2xl font-black font-mono text-[#F4F7FB]">
                94<span className="text-[#00E5FF]">%</span>
              </div>
              <div className="text-[11px] text-[#64748B] font-medium uppercase tracking-wider mt-0.5">
                SIF Detection Precision
              </div>
            </div>
            <div>
              <div className="text-2xl font-black font-mono text-[#F4F7FB]">
                9 <span className="text-[#8B5CF6]">IOGP</span>
              </div>
              <div className="text-[11px] text-[#64748B] font-medium uppercase tracking-wider mt-0.5">
                Life-Saving Rules
              </div>
            </div>
            <div>
              <div className="text-2xl font-black font-mono text-[#2EE59D]">
                &lt; 140<span className="text-xs font-normal text-[#94A3B8]">ms</span>
              </div>
              <div className="text-[11px] text-[#64748B] font-medium uppercase tracking-wider mt-0.5">
                Analysis Latency
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 3D-Inspired AI Intelligence Core Visual (5 cols) */}
        <div
          className="lg:col-span-5 relative flex items-center justify-center min-h-[440px]"
          style={{
            transform: `perspective(1000px) rotateY(${mousePos.x * 0.4}deg) rotateX(${-mousePos.y * 0.4}deg)`,
            transition: 'transform 0.15s ease-out',
          }}
        >
          {/* Subtle Facility Silhouette Backing */}
          <div className="absolute inset-x-8 bottom-4 h-32 opacity-15 pointer-events-none flex items-end justify-between overflow-hidden">
            <div className="w-12 h-24 bg-gradient-to-t from-[#00E5FF] to-transparent rounded-t-sm" />
            <div className="w-8 h-32 bg-gradient-to-t from-[#8B5CF6] to-transparent rounded-t-sm" />
            <div className="w-16 h-16 bg-gradient-to-t from-[#00E5FF] to-transparent rounded-t-sm" />
            <div className="w-10 h-28 bg-gradient-to-t from-[#8B5CF6] to-transparent rounded-t-sm" />
            <div className="w-14 h-20 bg-gradient-to-t from-[#00E5FF] to-transparent rounded-t-sm" />
          </div>

          {/* SVG AI Intelligence Core Graphic */}
          <div className="relative w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center">
            
            {/* Outer Ring 1 (Clockwise) */}
            <div className="absolute inset-0 rounded-full border border-dashed border-[#00E5FF]/25 animate-core-spin" />
            
            {/* Outer Ring 2 (Counter-Clockwise with glowing nodules) */}
            <div className="absolute inset-6 rounded-full border border-[#8B5CF6]/35 animate-core-reverse">
              <span className="absolute -top-1.5 left-1/2 w-3 h-3 bg-[#00E5FF] rounded-full shadow-[0_0_12px_#00E5FF]" />
              <span className="absolute -bottom-1.5 right-1/4 w-2.5 h-2.5 bg-[#8B5CF6] rounded-full shadow-[0_0_10px_#8B5CF6]" />
            </div>

            {/* Middle Ring 3 (Radar Sweep) */}
            <div className="absolute inset-14 rounded-full border border-[#00E5FF]/40 bg-[#0D1424]/40 backdrop-blur-sm overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00E5FF]/15 to-transparent animate-radar-sweep" />
            </div>

            {/* Inner Ring 4 (Hexagonal Pulsing AI Matrix) */}
            <div className="absolute inset-24 rounded-full border border-[#00E5FF]/60 flex items-center justify-center bg-gradient-to-br from-[#0D1424] via-[#111A2E] to-[#070B14] shadow-[0_0_40px_rgba(0,229,255,0.3)] animate-pulse-glow">
              <div className="relative flex flex-col items-center justify-center">
                <Cpu className="w-12 h-12 text-[#00E5FF] drop-shadow-[0_0_16px_rgba(0,229,255,0.8)]" />
                <span className="text-[10px] font-mono font-bold text-[#F4F7FB] mt-2 tracking-widest uppercase">
                  SIF CORE
                </span>
                <span className="text-[8px] font-mono text-[#00E5FF] font-semibold">
                  EVALUATING
                </span>
              </div>
            </div>

            {/* Orbiting Risk Signal Nodes */}
            <div className="absolute top-2 left-6 animate-float-slow">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0D1424]/90 border border-[#FF4757]/60 shadow-[0_0_14px_rgba(255,71,87,0.35)] backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-[#FF4757] animate-ping" />
                <span className="text-[10px] font-mono font-bold text-[#FF4757]">SIF: HIGH RISK</span>
              </div>
            </div>

            <div className="absolute bottom-4 right-2 animate-float-slow" style={{ animationDelay: '1.2s' }}>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0D1424]/90 border border-[#FFB020]/60 shadow-[0_0_14px_rgba(255,176,32,0.35)] backdrop-blur-md">
                <AlertTriangle className="w-3 h-3 text-[#FFB020]" />
                <span className="text-[10px] font-mono font-bold text-[#FFB020]">Missing Barrier</span>
              </div>
            </div>

            <div className="absolute top-1/2 -right-6 animate-float-slow" style={{ animationDelay: '2.1s' }}>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0D1424]/90 border border-[#00E5FF]/60 shadow-[0_0_14px_rgba(0,229,255,0.3)] backdrop-blur-md">
                <Shield className="w-3 h-3 text-[#00E5FF]" />
                <span className="text-[10px] font-mono font-bold text-[#00E5FF]">LSR #8: Height</span>
              </div>
            </div>

            <div className="absolute -bottom-6 left-10 animate-float-slow" style={{ animationDelay: '0.6s' }}>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0D1424]/95 border border-[#8B5CF6]/50 shadow-[0_0_16px_rgba(139,92,246,0.35)] backdrop-blur-md">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2EE59D]" />
                <span className="text-[10px] font-medium text-[#F4F7FB]">Audit Trail Logged</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* ── Bottom Floating Ticker Bar ── */}
      <div className="relative z-10 max-w-7xl mx-auto w-full pt-8">
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-3 rounded-2xl bg-[#0D1424]/60 border border-[#00E5FF]/20 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2EE59D] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#2EE59D]" />
            </span>
            <span className="text-xs font-mono font-semibold text-[#F4F7FB]">
              Active Ingestion Stream:
            </span>
            <span className="text-xs font-mono text-[#00E5FF]">
              Refinery Unit 04 · High Pressure Gas Pipeline · Flare Knockout Drum
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-[#94A3B8]">
            <span className="flex items-center gap-1 text-[#00E5FF]">
              <Layers className="w-3.5 h-3.5" />
              Multi-Source Ingestion (PDF, DOCX, TXT)
            </span>
            <span className="hidden sm:inline">|</span>
            <span className="text-[#8B5CF6]">
              IOGP 9 Life-Saving Rules Integrated
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
