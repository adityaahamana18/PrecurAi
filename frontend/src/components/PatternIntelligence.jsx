import React, { useState } from 'react';
import {
  Share2,
  AlertTriangle,
  Shield,
  Activity,
  Layers,
  Search,
  Filter,
  CheckCircle,
  TrendingUp,
  Cpu,
  Info,
  Maximize2,
  ChevronRight,
} from 'lucide-react';

const NODES_DATA = [
  // Hazards (Red)
  { id: 'h1', type: 'hazard', label: 'Fall from Height (>2m)', frequency: 28, sif: 'HIGH', x: 120, y: 100, color: '#FF4757', desc: 'Working on elevated grating or scaffolding without tethering.' },
  { id: 'h2', type: 'hazard', label: 'Pressurized Gas Leak', frequency: 22, sif: 'HIGH', x: 120, y: 220, color: '#FF4757', desc: 'Hydrocarbon gas release during hot tapping or flanged joints.' },
  { id: 'h3', type: 'hazard', label: 'Electrical Arc Exposure', frequency: 16, sif: 'HIGH', x: 120, y: 340, color: '#FF4757', desc: 'Unverified 415V switchgear with live busbars during inspection.' },
  { id: 'h4', type: 'hazard', label: 'Toxic Atmosphere (H2S)', frequency: 14, sif: 'HIGH', x: 120, y: 460, color: '#FF4757', desc: 'Dangerous gas concentration in bottom sump without forced ventilation.' },

  // Failed Barriers (Amber)
  { id: 'b1', type: 'barrier', label: 'Fall Arrest Harness Missing', frequency: 24, sif: 'HIGH', x: 380, y: 80, color: '#FFB020', desc: 'Operative untethered on beam edge; anchor point unrated.' },
  { id: 'b2', type: 'barrier', label: 'LOTO Lockout Incomplete', frequency: 19, sif: 'HIGH', x: 380, y: 200, color: '#FFB020', desc: 'Isolation breaker tagged but zero-energy test not conducted.' },
  { id: 'b3', type: 'barrier', label: 'Gas Test Certificate Expired', frequency: 18, sif: 'HIGH', x: 380, y: 320, color: '#FFB020', desc: 'Pre-entry multi-gas detector calibration certificate 6 hours overdue.' },
  { id: 'b4', type: 'barrier', label: 'Exclusion Barricade Missing', frequency: 15, sif: 'MEDIUM', x: 380, y: 440, color: '#FFB020', desc: 'Red danger tape missing under 15-ton crane lift envelope.' },

  // Activities (Cyan)
  { id: 'a1', type: 'activity', label: 'Scaffold Pipe Dismantling', frequency: 21, sif: 'HIGH', x: 640, y: 90, color: '#00E5FF', desc: 'Overhead structural scaffolding modifications during wind gusts.' },
  { id: 'a2', type: 'activity', label: 'Switchgear Servicing', frequency: 17, sif: 'HIGH', x: 640, y: 210, color: '#00E5FF', desc: 'MCC panel internal wiring maintenance during night shift.' },
  { id: 'a3', type: 'activity', label: 'Separator Vessel Cleaning', frequency: 15, sif: 'HIGH', x: 640, y: 330, color: '#00E5FF', desc: 'Internal sludge desludging inside hydrocarbon separator vessel.' },
  { id: 'a4', type: 'activity', label: 'Heavy Header Rigging', frequency: 20, sif: 'HIGH', x: 640, y: 450, color: '#00E5FF', desc: 'Tandem crane lift of 48-inch pipeline manifold.' },

  // Life-Saving Rules (Violet)
  { id: 'r1', type: 'rule', label: 'LSR #8: Working at Height', frequency: 32, sif: 'RULE', x: 900, y: 110, color: '#8B5CF6', desc: 'Protect yourself against a fall whenever working at height.' },
  { id: 'r2', type: 'rule', label: 'LSR #4: Energy Isolation', frequency: 26, sif: 'RULE', x: 900, y: 230, color: '#8B5CF6', desc: 'Verify isolation and zero energy before work begins.' },
  { id: 'r3', type: 'rule', label: 'LSR #2: Confined Space', frequency: 21, sif: 'RULE', x: 900, y: 350, color: '#8B5CF6', desc: 'Obtain authorization before entering a confined space.' },
  { id: 'r4', type: 'rule', label: 'LSR #7: Safe Mechanical Lifting', frequency: 24, sif: 'RULE', x: 900, y: 470, color: '#8B5CF6', desc: 'Plan lifting operations and control the area.' },
];

const LINKS_DATA = [
  { source: 'h1', target: 'b1', strength: 8 },
  { source: 'b1', target: 'a1', strength: 7 },
  { source: 'a1', target: 'r1', strength: 9 },

  { source: 'h2', target: 'b2', strength: 6 },
  { source: 'b2', target: 'a2', strength: 8 },
  { source: 'a2', target: 'r2', strength: 9 },

  { source: 'h3', target: 'b2', strength: 7 },
  { source: 'b2', target: 'r2', strength: 8 },

  { source: 'h4', target: 'b3', strength: 9 },
  { source: 'b3', target: 'a3', strength: 8 },
  { source: 'a3', target: 'r3', strength: 9 },

  { source: 'h1', target: 'b4', strength: 4 },
  { source: 'b4', target: 'a4', strength: 8 },
  { source: 'a4', target: 'r4', strength: 9 },
];

const RECURRING_PATTERNS = [
  {
    patternId: 'PAT-01',
    name: 'Elevated Scaffold Untethered Exposure',
    hazard: 'Fall from Height (>2m)',
    failedBarrier: 'Fall Arrest Harness Missing',
    activity: 'Scaffold Pipe Dismantling',
    rule: 'LSR #8: Working at Height',
    reportsCount: 28,
    sifPotential: 'HIGH',
    trend: '+14% vs Q3',
    status: 'Intervention Required',
  },
  {
    patternId: 'PAT-02',
    name: 'Unverified Electrical Live Busbar Work',
    hazard: 'Electrical Arc Exposure',
    failedBarrier: 'LOTO Lockout Incomplete',
    activity: 'Switchgear Servicing',
    rule: 'LSR #4: Energy Isolation',
    reportsCount: 19,
    sifPotential: 'HIGH',
    trend: '+8% vs Q3',
    status: 'Supervisor Action',
  },
  {
    patternId: 'PAT-03',
    name: 'Confined Vessel Entry Gas Overdue',
    hazard: 'Toxic Atmosphere (H2S)',
    failedBarrier: 'Gas Test Certificate Expired',
    activity: 'Separator Vessel Cleaning',
    rule: 'LSR #2: Confined Space',
    reportsCount: 16,
    sifPotential: 'HIGH',
    trend: '-5% vs Q3',
    status: 'Mitigation Active',
  },
  {
    patternId: 'PAT-04',
    name: 'Unbarricaded Rigging Swing Envelope',
    hazard: 'Suspended Load Strike',
    failedBarrier: 'Exclusion Barricade Missing',
    activity: 'Heavy Header Rigging',
    rule: 'LSR #7: Safe Mechanical Lifting',
    reportsCount: 14,
    sifPotential: 'MEDIUM',
    trend: '+2% vs Q3',
    status: 'Audit Flagged',
  },
];

export default function PatternIntelligence() {
  const [selectedNode, setSelectedNode] = useState(NODES_DATA[0]);
  const [filterType, setFilterType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNodes = NODES_DATA.filter((node) => {
    if (filterType !== 'ALL' && node.type !== filterType.toLowerCase()) return false;
    if (searchQuery && !node.label.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const isConnected = (sourceId, targetId) => {
    if (!selectedNode) return false;
    if (sourceId === selectedNode.id || targetId === selectedNode.id) return true;
    return false;
  };

  return (
    <div className="space-y-8 animate-fade-in text-[#F4F7FB]">
      
      {/* ── Section Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0F1626]/70 border border-white/[0.08] backdrop-blur-xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-[#00E5FF] uppercase tracking-wider">
            <Share2 className="w-4 h-4 text-[#00E5FF]" />
            <span>Interactive Risk Network Graph</span>
          </div>
          <h2 className="text-2xl font-black text-[#F4F7FB] tracking-tight">
            SIF Precursor Pattern Intelligence
          </h2>
          <p className="text-sm text-[#94A3B8]">
            Multi-dimensional relationship graph linking High-Energy Hazards ↔ Failed Barriers ↔ Field Activities ↔ IOGP Life-Saving Rules.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {['ALL', 'HAZARD', 'BARRIER', 'ACTIVITY', 'RULE'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-lg transition-all ${
                filterType === t
                  ? 'bg-[#00E5FF] text-[#070B14] shadow-md'
                  : 'bg-[#111A2E]/80 text-[#94A3B8] hover:text-[#F4F7FB] border border-white/[0.08]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ── Interactive SVG Relationship Network Graph ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* SVG Canvas Area (8 cols) */}
        <div className="lg:col-span-8 p-4 rounded-2xl bg-[#0F1626]/70 border border-white/[0.08] backdrop-blur-xl shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-4 text-xs font-mono text-[#94A3B8]">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#FF4757]" /> Hazard</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#FFB020]" /> Failed Barrier</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#00E5FF]" /> Activity</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" /> Life-Saving Rule</span>
            </div>
            <span className="text-[11px] font-mono text-[#00E5FF] flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5" /> Click Node to Inspect
            </span>
          </div>

          <div className="relative w-full h-[540px] overflow-x-auto bg-[#070B14]/70 rounded-xl border border-[#00E5FF]/10">
            <svg className="w-[1050px] h-[540px]">
              <defs>
                <linearGradient id="link-grad-cyan" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="link-grad-amber" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FF4757" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#FFB020" stopOpacity="0.8" />
                </linearGradient>
              </defs>

              {/* Connecting Lines */}
              {LINKS_DATA.map((link, idx) => {
                const sNode = NODES_DATA.find((n) => n.id === link.source);
                const tNode = NODES_DATA.find((n) => n.id === link.target);
                if (!sNode || !tNode) return null;
                const active = isConnected(link.source, link.target);

                return (
                  <g key={`link-${idx}`}>
                    <line
                      x1={sNode.x}
                      y1={sNode.y}
                      x2={tNode.x}
                      y2={tNode.y}
                      stroke={active ? '#00E5FF' : 'rgba(0, 229, 255, 0.15)'}
                      strokeWidth={active ? 3 : 1.5}
                      strokeDasharray={active ? '6,3' : 'none'}
                      className={active ? 'animate-particle-flow' : ''}
                    />
                    {active && (
                      <circle
                        cx={(sNode.x + tNode.x) / 2}
                        cy={(sNode.y + tNode.y) / 2}
                        r={4}
                        fill="#00E5FF"
                        className="animate-ping"
                      />
                    )}
                  </g>
                );
              })}

              {/* Node Circles */}
              {NODES_DATA.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                return (
                  <g
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className="cursor-pointer group"
                  >
                    {/* Pulsing ring on selected */}
                    {isSelected && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={28}
                        fill="none"
                        stroke={node.color}
                        strokeWidth={2}
                        strokeDasharray="4,2"
                        className="animate-core-spin"
                      />
                    )}

                    {/* Node Core */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={18}
                      fill="#0D1424"
                      stroke={node.color}
                      strokeWidth={isSelected ? 3.5 : 2}
                      className="transition-all duration-300 group-hover:scale-125"
                      style={{ filter: `drop-shadow(0 0 8px ${node.color}80)` }}
                    />

                    {/* Inner dot */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={6}
                      fill={node.color}
                    />

                    {/* Label */}
                    <text
                      x={node.x}
                      y={node.y + 32}
                      textAnchor="middle"
                      fill="#F4F7FB"
                      fontSize={11}
                      fontWeight={isSelected ? 'bold' : 'normal'}
                      className="select-none pointer-events-none"
                    >
                      {node.label}
                    </text>
                    <text
                      x={node.x}
                      y={node.y + 45}
                      textAnchor="middle"
                      fill={node.color}
                      fontSize={9}
                      fontFamily="monospace"
                      className="select-none pointer-events-none"
                    >
                      {node.frequency} observations
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Node Detail & Telemetry Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {selectedNode ? (
            <div className="p-6 rounded-2xl bg-[#0F1626]/80 border border-white/[0.08] backdrop-blur-xl shadow-xl space-y-5 animate-fade-in">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <span
                  className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase rounded-md"
                  style={{
                    backgroundColor: `${selectedNode.color}20`,
                    color: selectedNode.color,
                    border: `1px solid ${selectedNode.color}60`,
                  }}
                >
                  {selectedNode.type} NODE
                </span>
                <span className="text-xs font-mono text-[#94A3B8]">
                  ID: {selectedNode.id.toUpperCase()}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-[#F4F7FB]">
                  {selectedNode.label}
                </h3>
                <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
                  {selectedNode.desc}
                </p>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-[#080C14] border border-white/[0.08]">
                  <div className="text-[10px] text-[#64748B] font-mono uppercase">Incident Frequency</div>
                  <div className="text-xl font-bold font-mono text-[#F4F7FB] mt-0.5">
                    {selectedNode.frequency}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#080C14] border border-white/[0.08]">
                  <div className="text-[10px] text-[#64748B] font-mono uppercase">Credible SIF</div>
                  <div className="text-xl font-bold font-mono text-[#FF4757] mt-0.5">
                    {selectedNode.sif}
                  </div>
                </div>
              </div>

              {/* Connected Precursors */}
              <div>
                <div className="text-xs font-mono font-semibold text-[#00E5FF] uppercase tracking-wider mb-2">
                  Connected Precursor Pathways
                </div>
                <div className="space-y-2">
                  {LINKS_DATA.filter((l) => l.source === selectedNode.id || l.target === selectedNode.id).map((link, idx) => {
                    const otherId = link.source === selectedNode.id ? link.target : link.source;
                    const other = NODES_DATA.find((n) => n.id === otherId);
                    if (!other) return null;
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedNode(other)}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-[#080C14] hover:bg-[#111A2E] border border-white/[0.06] hover:border-cyan-400/30 cursor-pointer transition-all text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: other.color }}
                          />
                          <span className="font-medium text-[#F4F7FB] truncate max-w-[180px]">
                            {other.label}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-[#00E5FF]">
                          Weight: {link.strength}/10
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-[#00E5FF] flex items-center gap-2">
                <Info className="w-4 h-4 shrink-0" />
                <span>Precursor pathway maps directly into supervisory checklist verification.</span>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-[#0F1626]/80 border border-white/[0.08] text-center text-[#94A3B8]">
              Select a node in the graph to inspect relationship attributes.
            </div>
          )}
        </div>
      </div>

      {/* ── Recurring Precursor Pattern Matrix ── */}
      <div className="p-6 rounded-2xl bg-[#0F1626]/70 border border-white/[0.08] backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.08] pb-4">
          <div>
            <h3 className="text-lg font-bold text-[#F4F7FB] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#00E5FF]" />
              Recurring Precursor Pattern Frequency Matrix
            </h3>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Aggregated multi-incident patterns showing critical barrier failure co-occurrences.
            </p>
          </div>
          <span className="text-xs font-mono text-[#00E5FF] bg-[#080C14] px-3 py-1.5 rounded-lg border border-white/[0.08]">
            4 Critical Chains Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] text-[#64748B] font-mono uppercase text-[11px]">
                <th className="py-3 px-4">Pattern ID</th>
                <th className="py-3 px-4">Precursor Pathway</th>
                <th className="py-3 px-4">High-Energy Hazard</th>
                <th className="py-3 px-4">Failed Barrier</th>
                <th className="py-3 px-4">IOGP Rule</th>
                <th className="py-3 px-4 text-center">Incidents</th>
                <th className="py-3 px-4 text-center">SIF Severity</th>
                <th className="py-3 px-4">Quarterly Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] font-sans">
              {RECURRING_PATTERNS.map((p) => (
                <tr
                  key={p.patternId}
                  className="hover:bg-[#111A2E]/60 transition-colors group"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-[#00E5FF]">
                    {p.patternId}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#F4F7FB]">
                    {p.name}
                  </td>
                  <td className="py-3.5 px-4 text-[#FF4757]">
                    {p.hazard}
                  </td>
                  <td className="py-3.5 px-4 text-[#FFB020]">
                    {p.failedBarrier}
                  </td>
                  <td className="py-3.5 px-4 text-[#8B5CF6] font-mono text-[11px]">
                    {p.rule}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-center text-[#F4F7FB]">
                    {p.reportsCount}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FF4757]/20 text-[#FF4757] border border-[#FF4757]/40">
                      {p.sifPotential}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs font-mono text-[#00E5FF]">
                    {p.trend}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

