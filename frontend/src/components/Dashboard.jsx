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
    backgroundColor: '#05070E',
    borderColor: '#2C3480',
    borderRadius: '12px',
    fontSize: '11px',
    color: '#FFFFFF',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.9), 0 0 16px rgba(44, 52, 128, 0.5)',
  },
  itemStyle: { color: '#BAC4EB' },
  labelStyle: { color: '#FFFFFF', fontWeight: 700 },
};

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

function GradientBar(props) {
  const { x, y, width, height, fill } = props;
  if (!height || height <= 0) return null;
  return (
    <rect
      x={x} y={y} width={width} height={height}
      rx={6} ry={6}
      fill={fill}
      style={{ filter: 'drop-shadow(0 2px 10px rgba(78, 91, 201, 0.5))' }}
    />
  );
}

export default function Dashboard({ stats, hseAnalytics, onSelectReport, onNavigateToAnalyze }) {
  const [pieActive, setPieActive] = useState(null);

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-48 text-[#BAC4EB] text-sm animate-pulse">
        Loading operational intelligence dashboard...
      </div>
    );
  }

  const hasReports = stats.total_reports > 0;

  // Cobalt Palette
  const sifDistributionData = [
    { name: 'HIGH SIF',   value: stats.high_sif_count,   color: '#FF3B30' },
    { name: 'MEDIUM SIF', value: stats.medium_sif_count, color: '#FF9500' },
    { name: 'LOW SIF',    value: stats.low_sif_count,    color: '#34C759' },
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
      label: 'Reports Analyzed',
      value: stats.total_reports,
      badge: 'Processed',
      badgeClass: 'text-[#FFFFFF] bg-[#2C3480]/30 border-[#4E5BC9]',
      border: 'border-l-[#2C3480]',
      icon: <ShieldCheck className="w-4 h-4" />,
      iconBg: 'bg-[#2C3480]/30 text-[#FFFFFF] border-[#4E5BC9]',
    },
    {
      label: 'High SIF Potential',
      value: stats.high_sif_count,
      badge: 'Critical Alert',
      badgeClass: 'text-[#FF3B30] bg-[#FF3B30]/15 border-[#FF3B30]/40',
      border: 'border-l-[#FF3B30]',
      icon: <AlertOctagon className="w-4 h-4" />,
      iconBg: 'bg-[#FF3B30]/15 text-[#FF3B30] border-[#FF3B30]/40',
    },
    {
      label: 'Medium SIF Precursors',
      value: stats.medium_sif_count,
      badge: 'Warning',
      badgeClass: 'text-[#FF9500] bg-[#FF9500]/15 border-[#FF9500]/40',
      border: 'border-l-[#FF9500]',
      icon: <AlertTriangle className="w-4 h-4" />,
      iconBg: 'bg-[#FF9500]/15 text-[#FF9500] border-[#FF9500]/40',
    },
    {
      label: 'Low SIF Risk',
      value: stats.low_sif_count,
      badge: 'Routine',
      badgeClass: 'text-[#34C759] bg-[#34C759]/15 border-[#34C759]/40',
      border: 'border-l-[#34C759]',
      icon: <ShieldCheck className="w-4 h-4" />,
      iconBg: 'bg-[#34C759]/15 text-[#34C759] border-[#34C759]/40',
    },
  ];

  return (
    <div className="space-y-7 animate-fade-in font-sans">
      {/* Executive Black & Cobalt Banner */}
      <div className="corp-card p-6 rounded-2xl border border-[#2C3480] shadow-cobalt-glow flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#2C3480]/35 via-[#4E5BC9]/15 to-transparent blur-3xl pointer-events-none" />

        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#2C3480] to-[#5B73D1] flex items-center justify-center text-[#FFFFFF] shadow-sm">
              <Activity className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-[#FFFFFF] tracking-tight">
              Operational SIF Precursor Dashboard
            </h2>
          </div>
          <p className="text-xs text-[#BAC4EB] leading-relaxed max-w-2xl">
            PrecurAi translates safety observations and near-miss narratives into explainable SIF precursor intelligence and standard IOGP Life-Saving Rules.
          </p>
        </div>

        <button
          onClick={onNavigateToAnalyze}
          className="btn-cobalt inline-flex items-center gap-2 px-5 py-2.5 text-xs shadow-cobalt-glow shrink-0 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <span>Analyze Safety Report</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-[#2C3480]/50 pb-2">
        <h3 className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#5B73D1]" />
          Precursor Analytics Overview
        </h3>
        <span className="text-[10px] font-mono text-[#BAC4EB] bg-[#0A0D18] px-2.5 py-0.5 rounded border border-[#2C3480]/70">
          Neural Telemetry Active
        </span>
      </div>

      {/* Hardcore KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card, i) => (
          <div
            key={card.label}
            className={`corp-card p-5 rounded-2xl border-l-4 ${card.border} hover:scale-[1.02] transition-all duration-200 cursor-default shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#BAC4EB]">{card.label}</span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${card.iconBg}`}>
                {card.icon}
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-2xl font-black text-[#FFFFFF] font-mono tracking-tight">
                <AnimatedNumber value={card.value} duration={900 + i * 120} />
              </span>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border ${card.badgeClass}`}>
                {card.badge}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* SIF Donut */}
        <div className="lg:col-span-4 corp-card p-5 rounded-2xl flex flex-col gap-3 border border-[#2C3480]">
          <div>
            <h4 className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider">SIF Potential Distribution</h4>
            <p className="text-[11px] text-[#BAC4EB] mt-0.5">Ratio of classified safety observations</p>
          </div>

          <div className="h-48 flex items-center justify-center">
            {!hasReports ? (
              <p className="text-xs text-[#BAC4EB]">No reports analyzed yet.</p>
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

          <div className="flex justify-around border-t border-[#2C3480]/60 pt-3 text-[11px]">
            {sifDistributionData.map((d) => (
              <span key={d.name} className="flex items-center gap-1.5 text-[#FFFFFF] font-semibold">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                {d.name.replace(' SIF', '')}
              </span>
            ))}
          </div>
        </div>

        {/* Life-Saving Rules Bar Chart */}
        <div className="lg:col-span-8 corp-card p-5 rounded-2xl flex flex-col gap-3 border border-[#2C3480]">
          <div>
            <h4 className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider">Life-Saving Rules Violation Frequency</h4>
            <p className="text-[11px] text-[#BAC4EB] mt-0.5">IOGP safety barrier violations per rule category</p>
          </div>

          <div className="h-52">
            {lsrChartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-[#BAC4EB]">
                No Life-Saving Rules mapped yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={lsrChartData} margin={{ top: 8, right: 8, left: -22, bottom: 24 }}>
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4E5BC9" stopOpacity={1} />
                      <stop offset="100%" stopColor="#2C3480" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 4" stroke="rgba(44,52,128,0.3)" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#5B73D1"
                    fontSize={9}
                    angle={-20}
                    textAnchor="end"
                    tick={{ fill: '#BAC4EB' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#5B73D1"
                    fontSize={10}
                    tick={{ fill: '#BAC4EB' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    {...tooltipStyle}
                    formatter={(val, name, props) => [val, props.payload.fullName || name]}
                    cursor={{ fill: 'rgba(44,52,128,0.1)' }}
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
          <div className="text-[10px] text-[#BAC4EB] text-right border-t border-[#2C3480]/60 pt-2 font-mono">
            Deterministic IOGP standard taxonomy
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Monthly SIF Trend */}
        <div className="lg:col-span-7 corp-card p-5 rounded-2xl flex flex-col gap-3 border border-[#2C3480]">
          <div>
            <h4 className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider">Monthly SIF Precursor Trend</h4>
            <p className="text-[11px] text-[#BAC4EB] mt-0.5">Risk level frequency over timeline</p>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrend} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaHigh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF3B30" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#FF3B30" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="areaMed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF9500" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#FF9500" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="areaLow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34C759" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#34C759" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 4" stroke="rgba(44,52,128,0.3)" vertical={false} />
                <XAxis dataKey="month" stroke="#5B73D1" fontSize={10} tick={{ fill: '#BAC4EB' }} axisLine={false} tickLine={false} />
                <YAxis stroke="#5B73D1" fontSize={10} tick={{ fill: '#BAC4EB' }} axisLine={false} tickLine={false} />
                <Tooltip {...tooltipStyle} cursor={{ stroke: '#2C3480', strokeDasharray: '3 3' }} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: '10px', paddingTop: '8px', color: '#BAC4EB' }}
                />
                <Area type="monotone" dataKey="High"   stroke="#FF3B30" strokeWidth={2.5} fill="url(#areaHigh)" dot={false} activeDot={{ r: 5, fill: '#FF3B30' }} isAnimationActive animationDuration={1200} />
                <Area type="monotone" dataKey="Medium" stroke="#FF9500" strokeWidth={2.5} fill="url(#areaMed)"  dot={false} activeDot={{ r: 5, fill: '#FF9500' }} isAnimationActive animationDuration={1400} />
                <Area type="monotone" dataKey="Low"    stroke="#34C759" strokeWidth={2.5} fill="url(#areaLow)"  dot={false} activeDot={{ r: 5, fill: '#34C759' }} isAnimationActive animationDuration={1600} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Breakdown */}
        <div className="lg:col-span-5 corp-card p-5 rounded-2xl flex flex-col gap-3 border border-[#2C3480]">
          <div>
            <h4 className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider">Observations by Department</h4>
            <p className="text-[11px] text-[#BAC4EB] mt-0.5">Field observation distribution per unit</p>
          </div>
          <div className="h-52">
            {deptData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-[#BAC4EB]">
                No department data available.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptData} layout="vertical" margin={{ top: 0, right: 12, left: 4, bottom: 0 }}>
                  <defs>
                    <linearGradient id="deptGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#2C3480" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#4E5BC9" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 4" stroke="rgba(44,52,128,0.3)" horizontal={false} />
                  <XAxis type="number" stroke="#5B73D1" fontSize={10} tick={{ fill: '#BAC4EB' }} axisLine={false} tickLine={false} />
                  <YAxis
                    type="category" dataKey="name" stroke="#5B73D1"
                    fontSize={9} tick={{ fill: '#BAC4EB' }} width={60}
                    axisLine={false} tickLine={false}
                  />
                  <Tooltip {...tooltipStyle} cursor={{ fill: 'rgba(44,52,128,0.1)' }} />
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
    </div>
  );
}
