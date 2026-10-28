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
  Search,
  Eye,
  CheckCircle2,
  Clock,
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

function AnimatedNumber({ value, duration = 1000 }) {
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
    backgroundColor: 'rgba(11, 15, 25, 0.95)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: '10px',
    fontSize: '11px',
    color: '#F4F7FB',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6)',
  },
  itemStyle: { color: '#94A3B8' },
  labelStyle: { color: '#00E5FF', fontWeight: 700 },
};

function renderCustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#F4F7FB" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
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
        Loading intelligence dashboard...
      </div>
    );
  }

  const hasReports = stats.total_reports > 0;

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
      badge: 'Active Registry',
      badgeColor: 'text-[#00E5FF] bg-[#00E5FF]/10 border-[#00E5FF]/30',
      icon: <ShieldCheck className="w-4 h-4 text-[#00E5FF]" />,
    },
    {
      label: 'High SIF Precursors',
      value: stats.high_sif_count,
      badge: 'Immediate Action',
      badgeColor: 'text-[#FF4757] bg-[#FF4757]/10 border-[#FF4757]/30',
      icon: <AlertOctagon className="w-4 h-4 text-[#FF4757]" />,
    },
    {
      label: 'Medium Precursors',
      value: stats.medium_sif_count,
      badge: 'Warning',
      badgeColor: 'text-[#FFB020] bg-[#FFB020]/10 border-[#FFB020]/30',
      icon: <AlertTriangle className="w-4 h-4 text-[#FFB020]" />,
    },
    {
      label: 'Routine Observations',
      value: stats.low_sif_count,
      badge: 'Controlled',
      badgeColor: 'text-[#2EE59D] bg-[#2EE59D]/10 border-[#2EE59D]/30',
      icon: <CheckCircle2 className="w-4 h-4 text-[#2EE59D]" />,
    },
  ];

  const priorityReports = (stats.recent_reports || []).filter((r) => {
    if (queueFilter !== 'ALL' && (r.sif_potential || '').toUpperCase() !== queueFilter) return false;
    if (queueSearch && !(r.title || r.text || '').toLowerCase().includes(queueSearch.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in font-sans text-[#F4F7FB]">
      
      {/* ── Top Header Banner ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0F1626]/80 border border-white/[0.08] shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-[#F4F7FB]">
              Safety Intelligence Dashboard
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] text-[10px] font-mono font-semibold border border-[#00E5FF]/30">
              Live Feed
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] max-w-xl">
            Real-time SIF precursor detection, missing barrier analytics, and standard IOGP Life-Saving Rules attribution.
          </p>
        </div>

        <button
          onClick={onNavigateToAnalyze}
          className="btn-cinematic-cyan inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold shrink-0 active:scale-95 transition-all cursor-pointer"
        >
          <span>Analyze Safety Report</span>
          <ArrowUpRight className="w-4 h-4 text-[#080C14]" />
        </button>
      </div>

      {/* ── 4 KPI Metric Cards (Refined Linear-style) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card, i) => (
          <div
            key={card.label}
            className="p-5 rounded-2xl bg-[#0F1626]/70 border border-white/[0.08] hover:border-white/[0.2] transition-all duration-200 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#94A3B8]">{card.label}</span>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/[0.03] border border-white/[0.06]">
                {card.icon}
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-2xl font-black text-[#F4F7FB] font-mono tracking-tight">
                <AnimatedNumber value={card.value} duration={800 + i * 100} />
              </span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${card.badgeColor}`}>
                {card.badge}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Charts Row 1: SIF Donut & LSR Bar Chart ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* SIF Donut Chart */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-[#0F1626]/70 border border-white/[0.08] flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-[#F4F7FB] uppercase tracking-wider">SIF Potential Ratio</h4>
            <p className="text-[11px] text-[#94A3B8] mt-0.5">Distribution across recorded safety observations</p>
          </div>

          <div className="h-44 flex items-center justify-center my-2">
            {!hasReports ? (
              <p className="text-xs text-[#94A3B8]">No reports analyzed yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sifDistributionData}
                    cx="50%" cy="50%"
                    innerRadius={46} outerRadius={72}
                    paddingAngle={4}
                    dataKey="value"
                    labelLine={false}
                    label={renderCustomLabel}
                    strokeWidth={0}
                    isAnimationActive={true}
                    animationDuration={900}
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
                    formatter={(val) => [val, 'Reports']}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="flex justify-around border-t border-white/[0.08] pt-3 text-[11px]">
            {sifDistributionData.map((d) => (
              <span key={d.name} className="flex items-center gap-1.5 text-[#F4F7FB] font-medium">
                <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                {d.name.replace(' SIF', '')}
              </span>
            ))}
          </div>
        </div>

        {/* Life-Saving Rules Bar Chart */}
        <div className="lg:col-span-8 p-5 rounded-2xl bg-[#0F1626]/70 border border-white/[0.08] flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-[#F4F7FB] uppercase tracking-wider">Life-Saving Rules Violation Frequency</h4>
            <p className="text-[11px] text-[#94A3B8] mt-0.5">Standard IOGP safeguards associated with reported near-misses</p>
          </div>

          <div className="h-48 my-2">
            {lsrChartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-[#94A3B8]">
                No Life-Saving Rules mapped yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={lsrChartData} margin={{ top: 8, right: 8, left: -22, bottom: 20 }}>
                  <defs>
                    <linearGradient id="cyanBarGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00E5FF" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#00E5FF" stopOpacity={0.3} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#64748B"
                    fontSize={10}
                    angle={-15}
                    textAnchor="end"
                    tick={{ fill: '#94A3B8' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#64748B"
                    fontSize={10}
                    tick={{ fill: '#94A3B8' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    {...tooltipStyle}
                    formatter={(val, name, props) => [val, props.payload.fullName || name]}
                  />
                  <Bar
                    dataKey="Incidents"
                    fill="url(#cyanBarGrad)"
                    radius={[6, 6, 0, 0]}
                    isAnimationActive={true}
                    animationDuration={800}
                    maxBarSize={44}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="text-[10px] text-[#94A3B8] text-right border-t border-white/[0.08] pt-2 font-mono">
            IOGP 459 Standard Safeguard Mapping
          </div>
        </div>
      </div>

      {/* ── Priority Report Queue Table ── */}
      <div className="p-6 rounded-2xl bg-[#0F1626]/70 border border-white/[0.08] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
          <div>
            <h3 className="text-sm font-bold text-[#F4F7FB] flex items-center gap-2">
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
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  queueFilter === lvl
                    ? 'bg-[#00E5FF] text-[#080C14] font-bold shadow-sm'
                    : 'bg-white/[0.03] text-[#94A3B8] border border-white/[0.06] hover:text-[#F4F7FB]'
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
              <tr className="border-b border-white/[0.06] text-[#64748B] uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Ref ID</th>
                <th className="py-2.5 px-3">Observation Summary</th>
                <th className="py-2.5 px-3">Location</th>
                <th className="py-2.5 px-3">Life-Saving Rule</th>
                <th className="py-2.5 px-3 text-center">SIF Severity</th>
                <th className="py-2.5 px-3 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
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
                    sif === 'HIGH' ? 'bg-[#FF4757]/15 text-[#FF4757] border-[#FF4757]/30' :
                    sif === 'MEDIUM' ? 'bg-[#FFB020]/15 text-[#FFB020] border-[#FFB020]/30' :
                    'bg-[#2EE59D]/15 text-[#2EE59D] border-[#2EE59D]/30';

                  return (
                    <tr key={rep.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="py-3 px-3 font-mono font-semibold text-[#00E5FF]">
                        #{rep.id}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-medium text-[#F4F7FB] truncate max-w-[280px]">
                          {rep.title || 'Safety Observation'}
                        </div>
                        <div className="text-[11px] text-[#94A3B8] truncate max-w-[280px]">
                          {rep.text}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-[#94A3B8]">
                        {rep.location || 'General Plant'}
                      </td>
                      <td className="py-3 px-3 text-[#8B5CF6] text-[11px]">
                        {rep.life_saving_rule || 'General Control'}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badgeColor}`}>
                          {sif}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => onSelectReport(rep)}
                          className="btn-ghost-dark inline-flex items-center gap-1 px-3 py-1 text-xs hover:border-[#00E5FF] hover:text-[#00E5FF] transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
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
