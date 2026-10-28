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
  Zap,
  Filter,
  Search,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
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
  AreaChart,
  Area,
  Legend,
} from 'recharts';

function AnimatedNumber({ value, duration = 1200 }) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const start = performance.now();
    const from = display;
    const to = value;

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
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

const tooltipStyle = {
  contentStyle: {
    backgroundColor: '#070B14',
    borderColor: 'rgba(0, 229, 255, 0.4)',
    borderRadius: '12px',
    fontSize: '11px',
    color: '#F4F7FB',
    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.9), 0 0 20px rgba(0, 229, 255, 0.25)',
  },
  itemStyle: { color: '#94A3B8' },
  labelStyle: { color: '#00E5FF', fontWeight: 800 },
};

function renderCustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#F4F7FB" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={800}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

export default function Dashboard({ stats, hseAnalytics, onSelectReport, onNavigateToAnalyze }) {
  const [pieActive, setPieActive] = useState(null);
  const [queueFilter, setQueueFilter] = useState('ALL');
  const [queueSearch, setQueueSearch] = useState('');

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-48 text-[#94A3B8] text-sm animate-pulse">
        Loading operational intelligence command dashboard...
      </div>
    );
  }

  const hasReports = stats.total_reports > 0;

  // Cinematic Master Palette Colors
  const sifDistributionData = [
    { name: 'HIGH SIF',   value: stats.high_sif_count,   color: '#FF4757' },
    { name: 'MEDIUM SIF', value: stats.medium_sif_count, color: '#FFB020' },
    { name: 'LOW SIF',    value: stats.low_sif_count,    color: '#2EE59D' },
  ];

  const lsrChartData = (stats.lsr_violation_breakdown || []).slice(0, 6).map((item) => ({
    name: item.lsr_name.length > 15 ? item.lsr_name.slice(0, 15) + '…' : item.lsr_name,
    fullName: item.lsr_name,
    Incidents: item.count,
  }));

  const deptData = (hseAnalytics?.observations_by_department || []).slice(0, 6).map((item) => ({
    name: item.department,
    Count: item.count,
  }));

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

  const kpiCards = [
    {
      label: 'Reports Processed',
      value: stats.total_reports,
      badge: 'Continuous',
      badgeClass: 'text-[#00E5FF] bg-[#00E5FF]/10 border-[#00E5FF]/40',
      border: 'border-l-[#00E5FF]',
      icon: <ShieldCheck className="w-4 h-4" />,
      iconBg: 'bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/40',
    },
    {
      label: 'High SIF Precursors',
      value: stats.high_sif_count,
      badge: 'Critical Review',
      badgeClass: 'text-[#FF4757] bg-[#FF4757]/15 border-[#FF4757]/40',
      border: 'border-l-[#FF4757]',
      icon: <AlertOctagon className="w-4 h-4" />,
      iconBg: 'bg-[#FF4757]/15 text-[#FF4757] border-[#FF4757]/40',
    },
    {
      label: 'Medium SIF Warning',
      value: stats.medium_sif_count,
      badge: 'Cautionary',
      badgeClass: 'text-[#FFB020] bg-[#FFB020]/15 border-[#FFB020]/40',
      border: 'border-l-[#FFB020]',
      icon: <AlertTriangle className="w-4 h-4" />,
      iconBg: 'bg-[#FFB020]/15 text-[#FFB020] border-[#FFB020]/40',
    },
    {
      label: 'Low SIF / Routine',
      value: stats.low_sif_count,
      badge: 'Baseline',
      badgeClass: 'text-[#2EE59D] bg-[#2EE59D]/15 border-[#2EE59D]/40',
      border: 'border-l-[#2EE59D]',
      icon: <CheckCircle2 className="w-4 h-4" />,
      iconBg: 'bg-[#2EE59D]/15 text-[#2EE59D] border-[#2EE59D]/40',
    },
  ];

  const priorityReports = (stats.recent_reports || []).filter((r) => {
    if (queueFilter !== 'ALL' && (r.sif_potential || '').toUpperCase() !== queueFilter) return false;
    if (queueSearch && !(r.title || r.text || '').toLowerCase().includes(queueSearch.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-7 animate-fade-in font-sans text-[#F4F7FB]">
      
      {/* ── Executive Command Banner ── */}
      <div className="cinematic-card p-6 rounded-2xl border border-[#00E5FF]/20 bg-[#0D1424]/90 shadow-cinematic flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#00E5FF]/15 via-[#8B5CF6]/10 to-transparent blur-3xl pointer-events-none" />

        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#00E5FF] to-[#8B5CF6] flex items-center justify-center text-[#070B14] shadow-cyan-glow font-bold">
              <Activity className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-black text-[#F4F7FB] tracking-tight">
              Operational SIF Precursor Command Center
            </h2>
          </div>
          <p className="text-xs text-[#94A3B8] leading-relaxed max-w-2xl">
            PrecurAi translates field observations, near-miss narratives, and facility inspections into explainable SIF precursor intelligence and IOGP Life-Saving Rules.
          </p>
        </div>

        <button
          onClick={onNavigateToAnalyze}
          className="btn-cinematic-cyan light-sweep-btn inline-flex items-center gap-2 px-6 py-3 text-xs shadow-cyan-glow shrink-0 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <span>Analyze Safety Report</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* ── Section Title ── */}
      <div className="flex items-center justify-between border-b border-[#00E5FF]/20 pb-2">
        <h3 className="text-xs font-bold text-[#F4F7FB] uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#00E5FF]" />
          Precursor Analytics Telemetry
        </h3>
        <span className="text-[10px] font-mono text-[#00E5FF] bg-[#070B14] px-2.5 py-0.5 rounded border border-[#00E5FF]/30">
          Neural Telemetry Active · Real-Time
        </span>
      </div>

      {/* ── 4 KPI Metric Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card, i) => (
          <div
            key={card.label}
            className={`cinematic-card p-5 rounded-2xl border-l-4 ${card.border} hover:scale-[1.02] transition-all duration-200 cursor-default shadow-cinematic bg-[#0D1424]/90`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">{card.label}</span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${card.iconBg}`}>
                {card.icon}
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-2xl font-black text-[#F4F7FB] font-mono tracking-tight">
                <AnimatedNumber value={card.value} duration={900 + i * 120} />
              </span>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border ${card.badgeClass}`}>
                {card.badge}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Charts Row 1: SIF Donut & LSR Bar Chart ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* SIF Donut Chart */}
        <div className="lg:col-span-4 cinematic-card p-5 rounded-2xl flex flex-col gap-3 border border-[#00E5FF]/20 bg-[#0D1424]/90 shadow-cinematic">
          <div>
            <h4 className="text-xs font-bold text-[#F4F7FB] uppercase tracking-wider">SIF Potential Distribution</h4>
            <p className="text-[11px] text-[#94A3B8] mt-0.5">Ratio of classified safety observations</p>
          </div>

          <div className="h-48 flex items-center justify-center">
            {!hasReports ? (
              <p className="text-xs text-[#94A3B8]">No reports analyzed yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
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

          <div className="flex justify-around border-t border-[#00E5FF]/15 pt-3 text-[11px]">
            {sifDistributionData.map((d) => (
              <span key={d.name} className="flex items-center gap-1.5 text-[#F4F7FB] font-semibold">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                {d.name.replace(' SIF', '')}
              </span>
            ))}
          </div>
        </div>

        {/* Life-Saving Rules Bar Chart */}
        <div className="lg:col-span-8 cinematic-card p-5 rounded-2xl flex flex-col gap-3 border border-[#00E5FF]/20 bg-[#0D1424]/90 shadow-cinematic">
          <div>
            <h4 className="text-xs font-bold text-[#F4F7FB] uppercase tracking-wider">Life-Saving Rules Violation Frequency</h4>
            <p className="text-[11px] text-[#94A3B8] mt-0.5">IOGP safety barrier violations per rule category</p>
          </div>

          <div className="h-52">
            {lsrChartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-[#94A3B8]">
                No Life-Saving Rules mapped yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={lsrChartData} margin={{ top: 8, right: 8, left: -22, bottom: 24 }}>
                  <defs>
                    <linearGradient id="cyanBarGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00E5FF" stopOpacity={1} />
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 4" stroke="rgba(0,229,255,0.15)" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#00E5FF"
                    fontSize={9}
                    angle={-20}
                    textAnchor="end"
                    tick={{ fill: '#94A3B8' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#00E5FF"
                    fontSize={10}
                    tick={{ fill: '#94A3B8' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    {...tooltipStyle}
                    formatter={(val, name, props) => [val, props.payload.fullName || name]}
                    cursor={{ fill: 'rgba(0,229,255,0.08)' }}
                  />
                  <Bar
                    dataKey="Incidents"
                    fill="url(#cyanBarGrad)"
                    radius={[6, 6, 0, 0]}
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
          <div className="text-[10px] text-[#94A3B8] text-right border-t border-[#00E5FF]/15 pt-2 font-mono">
            Deterministic IOGP standard taxonomy
          </div>
        </div>
      </div>

      {/* ── Charts Row 2: Monthly Trend & Dept Breakdown ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Monthly SIF Trend */}
        <div className="lg:col-span-7 cinematic-card p-5 rounded-2xl flex flex-col gap-3 border border-[#00E5FF]/20 bg-[#0D1424]/90 shadow-cinematic">
          <div>
            <h4 className="text-xs font-bold text-[#F4F7FB] uppercase tracking-wider">Monthly SIF Precursor Trend</h4>
            <p className="text-[11px] text-[#94A3B8] mt-0.5">Risk level frequency over timeline</p>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrend} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaHigh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF4757" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#FF4757" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="areaMed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFB020" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#FFB020" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="areaLow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2EE59D" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2EE59D" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 4" stroke="rgba(0,229,255,0.15)" vertical={false} />
                <XAxis dataKey="month" stroke="#00E5FF" fontSize={10} tick={{ fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis stroke="#00E5FF" fontSize={10} tick={{ fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <Tooltip {...tooltipStyle} cursor={{ stroke: '#00E5FF', strokeDasharray: '3 3' }} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: '10px', paddingTop: '8px', color: '#94A3B8' }}
                />
                <Area type="monotone" dataKey="High"   stroke="#FF4757" strokeWidth={2.5} fill="url(#areaHigh)" dot={false} activeDot={{ r: 5, fill: '#FF4757' }} isAnimationActive animationDuration={1200} />
                <Area type="monotone" dataKey="Medium" stroke="#FFB020" strokeWidth={2.5} fill="url(#areaMed)"  dot={false} activeDot={{ r: 5, fill: '#FFB020' }} isAnimationActive animationDuration={1400} />
                <Area type="monotone" dataKey="Low"    stroke="#2EE59D" strokeWidth={2.5} fill="url(#areaLow)"  dot={false} activeDot={{ r: 5, fill: '#2EE59D' }} isAnimationActive animationDuration={1600} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Breakdown */}
        <div className="lg:col-span-5 cinematic-card p-5 rounded-2xl flex flex-col gap-3 border border-[#00E5FF]/20 bg-[#0D1424]/90 shadow-cinematic">
          <div>
            <h4 className="text-xs font-bold text-[#F4F7FB] uppercase tracking-wider">Observations by Department</h4>
            <p className="text-[11px] text-[#94A3B8] mt-0.5">Field observation distribution per plant unit</p>
          </div>
          <div className="h-52">
            {deptData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-[#94A3B8]">
                No department data available.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptData} layout="vertical" margin={{ top: 0, right: 12, left: 4, bottom: 0 }}>
                  <defs>
                    <linearGradient id="deptGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#00E5FF" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 4" stroke="rgba(0,229,255,0.15)" horizontal={false} />
                  <XAxis type="number" stroke="#00E5FF" fontSize={10} tick={{ fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis
                    type="category" dataKey="name" stroke="#00E5FF"
                    fontSize={9} tick={{ fill: '#94A3B8' }} width={60}
                    axisLine={false} tickLine={false}
                  />
                  <Tooltip {...tooltipStyle} cursor={{ fill: 'rgba(0,229,255,0.08)' }} />
                  <Bar
                    dataKey="Count"
                    fill="url(#deptGrad)"
                    radius={[0, 6, 6, 0]}
                    isAnimationActive animationDuration={1100}
                    maxBarSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* ── Priority Report Queue Table ── */}
      <div className="cinematic-card p-6 rounded-2xl border border-[#00E5FF]/20 bg-[#0D1424]/90 shadow-cinematic space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#00E5FF]/15 pb-4">
          <div>
            <h3 className="text-base font-bold text-[#F4F7FB] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#00E5FF]" />
              Priority Safety Observation Queue
            </h3>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Field observations triaged by high-energy precursor severity for supervisor review.
            </p>
          </div>

          {/* Search & Severity Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
              <input
                type="text"
                placeholder="Search queue..."
                value={queueSearch}
                onChange={(e) => setQueueSearch(e.target.value)}
                className="dark-input pl-8 pr-3 py-1.5 text-xs text-[#F4F7FB] w-40"
              />
            </div>
            {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setQueueFilter(lvl)}
                className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg transition-all ${
                  queueFilter === lvl
                    ? 'bg-[#00E5FF] text-[#070B14] shadow-[0_0_12px_rgba(0,229,255,0.4)]'
                    : 'bg-[#070B14] text-[#94A3B8] border border-[#00E5FF]/20 hover:text-[#F4F7FB]'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Queue Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#00E5FF]/15 text-[#64748B] font-mono uppercase text-[10px]">
                <th className="py-2.5 px-3">Report ID</th>
                <th className="py-2.5 px-3">Title / Summary</th>
                <th className="py-2.5 px-3">Facility Location</th>
                <th className="py-2.5 px-3">Life-Saving Rule</th>
                <th className="py-2.5 px-3 text-center">SIF Severity</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#00E5FF]/10 font-sans">
              {priorityReports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-[#94A3B8]">
                    No observations match filter criteria.
                  </td>
                </tr>
              ) : (
                priorityReports.slice(0, 5).map((rep) => {
                  const sif = (rep.sif_potential || 'LOW').toUpperCase();
                  const badgeColor =
                    sif === 'HIGH' ? 'bg-[#FF4757]/20 text-[#FF4757] border-[#FF4757]/40' :
                    sif === 'MEDIUM' ? 'bg-[#FFB020]/20 text-[#FFB020] border-[#FFB020]/40' :
                    'bg-[#2EE59D]/20 text-[#2EE59D] border-[#2EE59D]/40';

                  return (
                    <tr key={rep.id} className="hover:bg-[#111A2E]/50 transition-colors group">
                      <td className="py-3 px-3 font-mono font-bold text-[#00E5FF]">
                        #{rep.id}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-[#F4F7FB] truncate max-w-[280px]">
                          {rep.title || 'Safety Observation'}
                        </div>
                        <div className="text-[11px] text-[#94A3B8] truncate max-w-[280px]">
                          {rep.text}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-[#94A3B8]">
                        {rep.location || 'General Plant'}
                      </td>
                      <td className="py-3 px-3 text-[#8B5CF6] font-mono text-[11px]">
                        {rep.life_saving_rule || 'General Control'}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${badgeColor}`}>
                          {sif}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => onSelectReport(rep)}
                          className="btn-ghost-dark inline-flex items-center gap-1 px-3 py-1 text-xs hover:border-[#00E5FF] hover:text-[#00E5FF] transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
