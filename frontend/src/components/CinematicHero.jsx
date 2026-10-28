import React, { useState } from 'react';
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
  ChevronRight,
  Flame,
  Search,
} from 'lucide-react';

const INTERACTIVE_DEMOS = [
  {
    id: 'height',
    tab: 'Fall at Height',
    hazard: 'Fall from Height (>2m)',
    failedBarrier: 'Fall Arrest Harness Not Tethered',
    rule: 'LSR #8: Working at Height',
    sif: 'HIGH',
    sifColor: '#FF4757',
    confidence: '96%',
    snippet: '"Technician was working at height without proper fall protection. The required safety barrier was missing."',
  },
  {
    id: 'gas',
    tab: 'Gas Containment',
    hazard: 'High-Pressure Hydrocarbon Gas Release',
    failedBarrier: 'Pre-Entry Atmospheric Gas Test Overdue',
    rule: 'LSR #2: Confined Space',
    sif: 'HIGH',
    sifColor: '#FF4757',
    confidence: '94%',
    snippet: '"During vessel maintenance, worker prepared to enter confined space without verifying atmospheric gas test."',
  },
  {
    id: 'loto',
    tab: 'Energy Isolation',
    hazard: 'Pressurized Pipe Residual Energy',
    failedBarrier: 'LOTO Zero-Energy State Not Verified',
    rule: 'LSR #3: Energy Isolation',
    sif: 'HIGH',
    sifColor: '#FF4757',
    confidence: '92%',
    snippet: '"Technician opened valve V-104 before energy isolation was verified. Gauge showed 140 PSI residual pressure."',
  },
];

export default function CinematicHero({ onExplore, onLaunchDashboard, onQuickAnalyze }) {
  const [activeDemo, setActiveDemo] = useState(INTERACTIVE_DEMOS[0]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 16;
    const y = (clientY / innerHeight - 0.5) * 16;
    setMousePos({ x, y });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative min-h-[calc(100vh-120px)] flex flex-col justify-between overflow-hidden py-10 px-4 sm:px-6 lg:px-8 bg-[#080C14]"
    >
      {/* ── Ambient Background Lighting ── */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-[#00E5FF]/08 via-[#8B5CF6]/08 to-transparent rounded-full blur-[130px] pointer-events-none" />

      {/* ── Main Hero Grid ── */}
      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center flex-1 my-auto">
        
        {/* Left Column: Typography & CTAs (6 cols) */}
        <div className="lg:col-span-6 flex flex-col justify-center text-left space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md w-fit">
            <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
            <span className="text-xs font-semibold text-[#F4F7FB]/90 tracking-wide">
              AI-Powered Industrial Safety Intelligence
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#F4F7FB] leading-[1.08]">
              Detect What Could Happen <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#8B5CF6]">
                Before It Happens.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#94A3B8] max-w-xl font-normal leading-relaxed pt-1">
              PrecurAi converts raw safety observation narratives into explainable SIF precursor intelligence, 
              identifying missing barriers and mapping standard IOGP Life-Saving Rules before incidents escalate.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onLaunchDashboard}
              className="btn-cinematic-cyan shimmer-btn flex items-center gap-2.5 px-6 py-3.5 text-xs tracking-wider uppercase font-bold cursor-pointer active:scale-95 group shadow-cyan-glow"
            >
              <Activity className="w-4 h-4 text-[#080C14]" />
              <span>Launch Dashboard</span>
              <ArrowRight className="w-4 h-4 text-[#080C14] group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onQuickAnalyze}
              className="btn-ghost-dark flex items-center gap-2.5 px-6 py-3.5 text-xs tracking-wider uppercase font-bold cursor-pointer active:scale-95 group"
            >
              <Search className="w-4 h-4 text-[#00E5FF]" />
              <span>Analyze Report</span>
            </button>
          </div>

          {/* Refined Metric Tickers */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/[0.08] max-w-lg">
            <div>
              <div className="text-2xl font-black font-mono text-[#F4F7FB]">
                94<span className="text-[#00E5FF]">%</span>
              </div>
              <div className="text-xs text-[#94A3B8] mt-0.5">
                Critical Precision
              </div>
            </div>
            <div>
              <div className="text-2xl font-black font-mono text-[#F4F7FB]">
                9 <span className="text-[#8B5CF6]">Rules</span>
              </div>
              <div className="text-xs text-[#94A3B8] mt-0.5">
                IOGP Taxonomy
              </div>
            </div>
            <div>
              <div className="text-2xl font-black font-mono text-[#2EE59D]">
                &lt; 140<span className="text-xs font-normal text-[#94A3B8]">ms</span>
              </div>
              <div className="text-xs text-[#94A3B8] mt-0.5">
                Inference Latency
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Live Safety Intelligence Simulator (6 cols) */}
        <div
          className="lg:col-span-6 relative flex flex-col justify-center"
          style={{
            transform: `perspective(1000px) rotateY(${mousePos.x * 0.3}deg) rotateX(${-mousePos.y * 0.3}deg)`,
            transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Card Container */}
          <div className="cinematic-card p-6 rounded-2xl border border-white/[0.1] bg-[#0E1424]/90 shadow-2xl relative space-y-5">
            
            {/* Top Interactive Tabs */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#00E5FF]/15 border border-[#00E5FF]/40 flex items-center justify-center p-1">
                  <img src="/logo.png" alt="PrecurAi Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#F4F7FB]">Live SIF Precursor Intelligence</div>
                  <div className="text-[10px] text-[#94A3B8]">Interactive Scenario Demonstration</div>
                </div>
              </div>

              {/* Status Pill */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[10px] font-mono text-[#00E5FF]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
                <span>Live Model Active</span>
              </div>
            </div>

            {/* Scenario Switcher Pills */}
            <div className="flex items-center gap-2 p-1 rounded-xl bg-[#080C14] border border-white/[0.08]">
              {INTERACTIVE_DEMOS.map((demo) => (
                <button
                  key={demo.id}
                  onClick={() => setActiveDemo(demo)}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 text-center ${
                    activeDemo.id === demo.id
                      ? 'bg-[#00E5FF] text-[#080C14] font-bold shadow-[0_0_12px_rgba(0,229,255,0.4)]'
                      : 'text-[#94A3B8] hover:text-[#F4F7FB]'
                  }`}
                >
                  {demo.tab}
                </button>
              ))}
            </div>

            {/* Observation Narrative Box */}
            <div className="p-3.5 rounded-xl bg-[#080C14] border border-white/[0.06] text-xs text-[#F4F7FB] leading-relaxed italic transition-all duration-300">
              {activeDemo.snippet}
            </div>

            {/* Extracted Intelligence Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <span className="text-[10px] uppercase font-bold text-[#FF4757] tracking-wider block mb-1">
                  High-Energy Hazard
                </span>
                <p className="font-semibold text-[#F4F7FB]">{activeDemo.hazard}</p>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <span className="text-[10px] uppercase font-bold text-[#FFB020] tracking-wider block mb-1">
                  Failed / Missing Barrier
                </span>
                <p className="font-semibold text-[#F4F7FB]">{activeDemo.failedBarrier}</p>
              </div>
            </div>

            {/* Classification & Rule Footer */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#00E5FF]/05 border border-[#00E5FF]/20">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#8B5CF6] tracking-wider block">
                  Life-Saving Rule
                </span>
                <span className="text-xs font-bold text-[#F4F7FB]">
                  {activeDemo.rule}
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider block">
                  SIF Potential
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#FF4757]/15 border border-[#FF4757]/40 text-[#FF4757] text-xs font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF4757] animate-ping" />
                  {activeDemo.sif} RISK
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
