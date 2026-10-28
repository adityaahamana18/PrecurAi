import React from 'react';
import { 
  AlertOctagon, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowUpRight, 
  Layers, 
  Activity, 
  TrendingUp, 
  BarChart2, 
  FileText 
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export default function Dashboard({ stats, hseAnalytics, onSelectReport, onNavigateToAnalyze }) {
  if (!stats) {
    return null;
  }

  const hasReports = stats.total_reports > 0;

  const sifDistributionData = [
    { name: 'HIGH SIF', value: stats.high_sif_count, color: '#DC2626' },
    { name: 'MEDIUM SIF', value: stats.medium_sif_count, color: '#D97706' },
    { name: 'LOW SIF', value: stats.low_sif_count, color: '#059669' },
  ];

  const lsrChartData = (stats.lsr_violation_breakdown || []).slice(0, 6).map(item => ({
    name: item.lsr_name.length > 18 ? item.lsr_name.slice(0, 18) + '...' : item.lsr_name,
    fullName: item.lsr_name,
    Incidents: item.count
  }));

  const deptData = (hseAnalytics?.observations_by_department || []).slice(0, 5).map(item => ({
    name: item.department,
    Count: item.count
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Executive Clean Header Banner */}
      <div className="bg-[#111827] border border-slate-800 p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
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
          className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold px-4 py-2 rounded-lg text-xs transition-all shadow-sm shrink-0 active:scale-98"
        >
          <span>Analyze Safety Report</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* SECTION 1: PRECURAI AI ANALYSIS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-400" />
            Precursor Analytics Overview
          </h3>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded border border-slate-700">
            Validated Records
          </span>
        </div>

        {/* 4 Professional Top KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Reports Analyzed */}
          <div className="corp-card p-4 rounded-xl group border-l-4 border-l-sky-600">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Reports Analyzed</span>
              <div className="w-8 h-8 rounded-lg bg-sky-950/80 text-sky-400 flex items-center justify-center border border-sky-800/60">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-white">{stats.total_reports}</span>
              <span className="text-[11px] font-medium text-slate-400">Processed</span>
            </div>
          </div>

          {/* High SIF Potential Card */}
          <div className="corp-card p-4 rounded-xl group border-l-4 border-l-red-600">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-red-400">High SIF Potential</span>
              <div className="w-8 h-8 rounded-lg bg-red-950/80 text-red-400 flex items-center justify-center border border-red-800/60">
                <AlertOctagon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-white">{stats.high_sif_count}</span>
              <span className="text-[10px] font-bold text-red-300 bg-red-950/80 px-2 py-0.5 rounded border border-red-800">
                Critical Alert
              </span>
            </div>
          </div>

          {/* Medium SIF Potential Card */}
          <div className="corp-card p-4 rounded-xl group border-l-4 border-l-amber-600">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Medium SIF Precursors</span>
              <div className="w-8 h-8 rounded-lg bg-amber-950/80 text-amber-400 flex items-center justify-center border border-amber-800/60">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-white">{stats.medium_sif_count}</span>
              <span className="text-[10px] font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                Warning
              </span>
            </div>
          </div>

          {/* Low SIF Potential Card */}
          <div className="corp-card p-4 rounded-xl group border-l-4 border-l-emerald-600">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Low SIF Risk</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-950/80 text-emerald-400 flex items-center justify-center border border-emerald-800/60">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-white">{stats.low_sif_count}</span>
              <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                Routine
              </span>
            </div>
          </div>
        </div>

        {/* Charts Grid: SIF Distribution & LSR Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* SIF Distribution Pie Chart */}
          <div className="lg:col-span-4 corp-card p-4 rounded-xl flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">SIF Potential Distribution</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Ratio of classified safety observations</p>
            </div>

            <div className="h-48 my-2 flex items-center justify-center">
              {!hasReports ? (
                <div className="text-center text-xs text-slate-400 py-6">
                  No safety reports analyzed yet.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sifDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {sifDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '11px', color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="flex justify-around border-t border-slate-800 pt-3 text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span> High SIF
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Med SIF
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Low SIF
              </span>
            </div>
          </div>

          {/* Life-Saving Rules Chart */}
          <div className="lg:col-span-8 corp-card p-4 rounded-xl flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Life-Saving Rules Mapped</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Frequency of IOGP safety barrier violations</p>
            </div>

            <div className="h-48 my-2">
              {lsrChartData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  No Life-Saving Rules mapped yet.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={lsrChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} angle={-15} textAnchor="end" />
                    <YAxis stroke="#94A3B8" fontSize={10} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '11px', color: '#fff' }}
                    />
                    <Bar dataKey="Incidents" fill="#0284C7" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="text-[10px] text-slate-400 text-right border-t border-slate-800 pt-2 font-mono">
              Deterministic IOGP standard taxonomy
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
