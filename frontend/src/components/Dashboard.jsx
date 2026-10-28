import React, { useState, useEffect, useRef } from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  ShieldCheck,
  ArrowUpRight,
  Layers,
  Activity,
  TrendingUp,
  FileText,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Area,
  AreaChart,
  Legend,
} from 'recharts';

// ── Custom animated number ticker ────────────────────────────────────────────
function AnimatedNumber({ value, duration = 1200 }) {
  const [display, setDisplay] = useState(0);
  const startRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const start = performance.now();
    const from = display;
    const to = value;

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span>{display}</span>;
}

// ── Custom tooltip shared style ───────────────────────────────────────────────
const tooltipStyle = {
  contentStyle: {
    backgroundColor: '#0F172A',
    borderColor: '#334155',
    borderRadius: '10px',
    fontSize: '11px',
    color: '#f1f5f9',
    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
  },
  itemStyle: { color: '#94a3b8' },
  labelStyle: { color: '#e2e8f0', fontWeight: 700 },
};

// ── Animated donut segment (custom ActiveShape) ───────────────────────────────
function renderCustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

// ── Gradient bar custom shape ─────────────────────────────────────────────────
function GradientBar(props) {
  const { x, y, width, height, fill } = props;
  if (!height || height <= 0) return null;
  return (
    <rect
      x={x} y={y} width={width} height={height}
      rx={5} ry={5}
      fill={fill}
      style={{ filter: 'drop-shadow(0 2px 8px rgba(56,189,248,0.25))' }}
    />
  );
}

export default function Dashboard({ stats, hseAnalytics, onSelectReport, onNavigateToAnalyze }) {
  const [pieActive, setPieActive] = useState(null);

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-500 text-sm animate-pulse">
        Loading dashboard…
      </div>
    );
  }

  const hasReports = stats.total_reports > 0;

  // ── Data prep ──────────────────────────────────────────────────────────────
  const sifDistributionData = [
    { name: 'HIGH SIF',   value: stats.high_sif_count,   color: '#ef4444' },
    { name: 'MEDIUM SIF', value: stats.medium_sif_count, color: '#f59e0b' },
    { name: 'LOW SIF',    value: stats.low_sif_count,    color: '#10b981' },
  ];

  const lsrChartData = (stats.lsr_violation_breakdown || []).slice(0, 6).map((item) => ({
    name: item.lsr_name.length > 16 ? item.lsr_name.slice(0, 16) + '…' : item.lsr_name,
    fullName: item.lsr_name,
    Incidents: item.count,
  }));

  const deptData = (hseAnalytics?.observations_by_department || []).slice(0, 6).map((item) => ({
    name: item.department,
    Count: item.count,
  }));

  // Synthetic monthly trend (real data would come from API)
  const monthlyTrend = [
    { month: 'Jan', High: 2, Medium: 4, Low: 6 },
    { month: 'Feb', High: 3, Medium: 5, Low: 7 },
    { month: 'Mar', High: 1, Medium: 3, Low: 5 },
    { month: 'Apr', High: 4, Medium: 6, Low: 8 },
    { month: 'May', High: 2, Medium: 4, Low: 9 },
    { month: 'Jun', High: 5, Medium: 7, Low: 10 },
    { month: 'Jul', High: 3, Medium: 5, Low: 8 },
    { month: 'Aug', High: stats.high_sif_count, Medium: stats.medium_sif_count, Low: stats.low_sif_count },
  ];

  // ── KPI cards config ───────────────────────────────────────────────────────
  const kpiCards = [
    {
      label: 'Reports Analyzed',
      value: stats.total_reports,
      badge: 'Processed',
      badgeClass: 'text-sky-300 bg-sky-950/80 border-sky-800',
      border: 'border-l-sky-500',
      icon: <ShieldCheck className="w-4 h-4" />,
      iconBg: 'bg-sky-950/80 text-sky-400 border-sky-800/60',
    },
    {
      label: 'High SIF Potential',
      value: stats.high_sif_count,
      badge: 'Critical Alert',
      badgeClass: 'text-red-300 bg-red-950/80 border-red-800',
      border: 'border-l-red-500',
      icon: <AlertOctagon className="w-4 h-4" />,
      iconBg: 'bg-red-950/80 text-red-400 border-red-800/60',
    },
    {
      label: 'Medium SIF Precursors',
      value: stats.medium_sif_count,
      badge: 'Warning',
      badgeClass: 'text-amber-300 bg-amber-950/80 border-amber-800',
      border: 'border-l-amber-500',
      icon: <AlertTriangle className="w-4 h-4" />,
      iconBg: 'bg-amber-950/80 text-amber-400 border-amber-800/60',
    },
    {
      label: 'Low SIF Risk',
      value: stats.low_sif_count,
      badge: 'Routine',
      badgeClass: 'text-emerald-300 bg-emerald-950/80 border-emerald-800',
      border: 'border-l-emerald-500',
      icon: <ShieldCheck className="w-4 h-4" />,
      iconBg: 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60',
    },
  ];

  return (
    <div className="space-y-7 animate-fade-in">
      {/* ── Banner ── */}
      <div className="bg-gradient-to-r from-[#0F1929] to-[#111827] border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-sky-400" />
            Operational SIF Precursor Dashboard
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
            PrecurAi converts safety field observations and near-miss narratives into explainable SIF precursor intelligence and standard IOGP Life-Saving Rules.
          </p>
        </div>
        <button
          onClick={onNavigateToAnalyze}
          className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition-all shadow-md hover:shadow-sky-900/50 hover:scale-105 active:scale-95 shrink-0"
        >
          <span>Analyze Safety Report</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* ── Section header ── */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-sky-400" />
          Precursor Analytics Overview
        </h3>
        <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded border border-slate-700">
          Validated Records
        </span>
      </div>

      {/* ── KPI cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card, i) => (
          <div
            key={card.label}
            className={`corp-card p-4 rounded-2xl border-l-4 ${card.border} hover:scale-[1.02] transition-transform duration-200 cursor-default`}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{card.label}</span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${card.iconBg}`}>
                {card.icon}
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-white">
                <AnimatedNumber value={card.value} duration={900 + i * 120} />
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${card.badgeClass}`}>
                {card.badge}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Charts row 1: Donut + LSR Bar ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* SIF Distribution Donut */}
        <div className="lg:col-span-4 corp-card p-5 rounded-2xl flex flex-col gap-3">
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">SIF Potential Distribution</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Ratio of classified safety observations</p>
          </div>

          <div className="h-48 flex items-center justify-center">
            {!hasReports ? (
              <p className="text-xs text-slate-500">No reports analyzed yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    <filter id="glow-red">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                      <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <filter id="glow-amber">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                      <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <filter id="glow-emerald">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                      <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                  </defs>
                  <Pie
                    data={sifDistributionData}
                    cx="50%" cy="50%"
                    innerRadius={46} outerRadius={74}
                    paddingAngle={4}
                    dataKey="value"
                    labelLine={false}
                    label={renderCustomLabel}
                    strokeWidth={0}
                    isAnimationActive={true}
                    animationBegin={0}
                    animationDuration={1200}
                    animationEasing="ease-out"
                    activeIndex={pieActive}
                    onMouseEnter={(_, i) => setPieActive(i)}
                    onMouseLeave={() => setPieActive(null)}
                  >
                    {sifDistributionData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        opacity={pieActive === null || pieActive === index ? 1 : 0.45}
                        style={{ transition: 'opacity 0.2s' }}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    {...tooltipStyle}
                    formatter={(val) => [val, 'Count']}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Legend dots */}
          <div className="flex justify-around border-t border-slate-800 pt-3 text-[11px]">
            {sifDistributionData.map((d) => (
              <span key={d.name} className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                {d.name.replace(' SIF', '')}
              </span>
            ))}
          </div>
        </div>

        {/* Life-Saving Rules Bar Chart */}
        <div className="lg:col-span-8 corp-card p-5 rounded-2xl flex flex-col gap-3">
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Life-Saving Rules Violation Frequency</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">IOGP safety barrier violations per rule category</p>
          </div>

          <div className="h-52">
            {lsrChartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">
                No Life-Saving Rules mapped yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={lsrChartData} margin={{ top: 8, right: 8, left: -22, bottom: 24 }}>
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity={1} />
                      <stop offset="100%" stopColor="#0369a1" stopOpacity={0.7} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 4" stroke="#1e293b" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#475569"
                    fontSize={9}
                    angle={-20}
                    textAnchor="end"
                    tick={{ fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#475569"
                    fontSize={10}
                    tick={{ fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    {...tooltipStyle}
                    formatter={(val, name, props) => [val, props.payload.fullName || name]}
                    cursor={{ fill: 'rgba(148,163,184,0.08)' }}
                  />
                  <Bar
                    dataKey="Incidents"
                    fill="url(#barGrad)"
                    radius={[6, 6, 0, 0]}
                    shape={<GradientBar fill="url(#barGrad)" />}
                    isAnimationActive={true}
                    animationBegin={200}
                    animationDuration={1000}
                    animationEasing="ease-out"
                    maxBarSize={48}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="text-[10px] text-slate-500 text-right border-t border-slate-800 pt-2 font-mono">
            Deterministic IOGP standard taxonomy
          </div>
        </div>
      </div>

      {/* ── Charts row 2: Area trend + Dept bar ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* Monthly SIF Trend — smooth area chart */}
        <div className="lg:col-span-7 corp-card p-5 rounded-2xl flex flex-col gap-3">
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Monthly SIF Precursor Trend</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Risk level distribution over time</p>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrend} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaHigh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="areaMed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="areaLow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 4" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="month" stroke="#475569" fontSize={10} tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip {...tooltipStyle} cursor={{ stroke: '#334155', strokeDasharray: '3 3' }} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: '10px', paddingTop: '8px', color: '#94a3b8' }}
                />
                <Area type="monotone" dataKey="High"   stroke="#ef4444" strokeWidth={2} fill="url(#areaHigh)" dot={false} activeDot={{ r: 5, fill: '#ef4444' }} isAnimationActive animationDuration={1200} animationEasing="ease-out" />
                <Area type="monotone" dataKey="Medium" stroke="#f59e0b" strokeWidth={2} fill="url(#areaMed)"  dot={false} activeDot={{ r: 5, fill: '#f59e0b' }} isAnimationActive animationDuration={1400} animationEasing="ease-out" />
                <Area type="monotone" dataKey="Low"    stroke="#10b981" strokeWidth={2} fill="url(#areaLow)"  dot={false} activeDot={{ r: 5, fill: '#10b981' }} isAnimationActive animationDuration={1600} animationEasing="ease-out" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department breakdown */}
        <div className="lg:col-span-5 corp-card p-5 rounded-2xl flex flex-col gap-3">
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Observations by Department</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Field report concentration per unit</p>
          </div>
          <div className="h-52">
            {deptData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">
                No department data available.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptData} layout="vertical" margin={{ top: 0, right: 12, left: 4, bottom: 0 }}>
                  <defs>
                    <linearGradient id="deptGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#a78bfa" stopOpacity={1} />
                      <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.7} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 4" stroke="#1e293b" horizontal={false} />
                  <XAxis type="number" stroke="#475569" fontSize={10} tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis
                    type="category" dataKey="name" stroke="#475569"
                    fontSize={9} tick={{ fill: '#94a3b8' }} width={60}
                    axisLine={false} tickLine={false}
                  />
                  <Tooltip {...tooltipStyle} cursor={{ fill: 'rgba(148,163,184,0.08)' }} />
                  <Bar
                    dataKey="Count"
                    fill="url(#deptGrad)"
                    radius={[0, 6, 6, 0]}
                    isAnimationActive animationDuration={1100} animationEasing="ease-out"
                    maxBarSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
