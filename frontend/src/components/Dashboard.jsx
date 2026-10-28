import React from 'react';
import { AlertOctagon, AlertTriangle, ShieldCheck, Clock, ArrowUpRight, ChevronRight, Activity, TrendingUp, BarChart2, Database, Layers, FileText } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export default function Dashboard({ stats, hseAnalytics, onSelectReport, onNavigateToAnalyze }) {
  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-sky-700 mr-3"></div>
        <span className="text-xs font-semibold">Loading SIF Intelligence Dashboard...</span>
      </div>
    );
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

  const activityData = (stats.top_activities_breakdown || []).slice(0, 5);

  const deptData = (hseAnalytics?.observations_by_department || []).slice(0, 5).map(item => ({
    name: item.department,
    Count: item.count
  }));

  const trainingGapData = (hseAnalytics?.department_training_gaps || []).slice(0, 5).map(item => ({
    name: item.department,
    Expired: item.expired_count,
    Pending: item.pending_count
  }));

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner with Vibrant Animated Gradient Border */}
      <div className="relative overflow-hidden rounded-2xl p-[1.5px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-2xl">
        <div className="bg-[#0F172A]/90 backdrop-blur-xl p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-md shadow-indigo-500/30">
                <Activity className="w-5 h-5 text-white animate-pulse" />
              </span>
              <span className="gradient-text-vibrant text-2xl font-extrabold tracking-wide">
                Operational SIF Intelligence Center
              </span>
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Real-time deep precursor classification converting field narratives into actionable SIF barriers, IOGP Life-Saving Rules, and high-energy hazard exposure alerts.
            </p>
          </div>
          <button
            onClick={onNavigateToAnalyze}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:brightness-110 text-white font-bold px-5 py-3 rounded-xl text-xs transition-all shadow-lg shadow-purple-600/30 shrink-0 transform hover:scale-105 active:scale-95 animate-neon-glow"
          >
            <span>Launch Safety Analyzer</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SECTION 1: PRECURAI AI ANALYSIS */}
      <div className="space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <h3 className="text-sm font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 uppercase tracking-widest flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            Active Precursor Metrics
          </h3>
          <span className="text-[11px] font-bold text-cyan-300 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-800/60 shadow-sm flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
            Real-time HSE Telemetry
          </span>
        </div>

        {/* 4 Compact Top KPI Cards with Vibrant Neon Glass Styles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Reports Analyzed */}
          <div className="glass-card-colorful p-5 rounded-2xl group border-l-4 border-l-indigo-500">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Observations</span>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600/30 to-blue-500/30 text-indigo-400 flex items-center justify-center border border-indigo-500/30 shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-white group-hover:text-indigo-400 transition-colors">{stats.total_reports}</span>
              <span className="text-[11px] font-bold text-indigo-400 bg-indigo-950/60 px-2.5 py-0.5 rounded-full border border-indigo-800/60">Processed</span>
            </div>
          </div>

          {/* High SIF Potential Card */}
          <div className="glass-card-colorful p-5 rounded-2xl group border-l-4 border-l-rose-500 hover:border-rose-400">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400">High SIF Exposure</span>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600/30 to-red-500/30 text-rose-400 flex items-center justify-center border border-rose-500/30 shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <AlertOctagon className="w-5 h-5 animate-bounce-subtle" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-white group-hover:text-rose-400 transition-colors">{stats.high_sif_count}</span>
              <span className="text-[10px] font-bold text-rose-300 bg-rose-950/80 px-2.5 py-0.5 rounded-full border border-rose-700/80 animate-pulse shadow-sm shadow-rose-950">
                Critical Alert
              </span>
            </div>
          </div>

          {/* Medium SIF Potential Card */}
          <div className="glass-card-colorful p-5 rounded-2xl group border-l-4 border-l-amber-500 hover:border-amber-400">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Medium SIF Precursors</span>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600/30 to-orange-500/30 text-amber-400 flex items-center justify-center border border-amber-500/30 shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-white group-hover:text-amber-400 transition-colors">{stats.medium_sif_count}</span>
              <span className="text-[10px] font-bold text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-700/80">
                Warning Threshold
              </span>
            </div>
          </div>

          {/* Low SIF Potential Card */}
          <div className="glass-card-colorful p-5 rounded-2xl group border-l-4 border-l-emerald-500 hover:border-emerald-400">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Low Risk Observations</span>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600/30 to-teal-500/30 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-white group-hover:text-emerald-400 transition-colors">{stats.low_sif_count}</span>
              <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-700/80">
                Safe Operations
              </span>
            </div>
          </div>
        </div>

        {/* Charts Grid: SIF Distribution & LSR Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* SIF Distribution Pie Chart */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex flex-col justify-between shadow-xs">
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">SIF Potential Distribution</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Ratio of classified safety reports</p>
            </div>

            <div className="h-48 my-2 flex items-center justify-center">
              {!hasReports ? (
                <div className="text-center text-xs text-slate-400 py-6">
                  No safety reports analyzed yet in PrecurAi.
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
                      contentStyle={{ backgroundColor: '#1E293B', borderColor: '#475569', borderRadius: '6px', color: '#F8FAFC', fontSize: '11px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="flex justify-center gap-3 text-xs font-medium border-t border-slate-100 dark:border-slate-800 pt-2.5">
              {sifDistributionData.map(item => (
                <div key={item.name} className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-slate-600 dark:text-slate-300">{item.name}:</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bar Chart: Life-Saving Rule Distribution */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">Life-Saving Rule Mapping</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Relevant IOGP Life-Saving Rules identified from analyzed reports</p>
              </div>
              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                IOGP Standards
              </span>
            </div>

            <div className="h-52 flex items-center justify-center">
              {lsrChartData.length === 0 ? (
                <div className="text-center text-xs text-slate-400 py-6">
                  No Life-Saving Rules mapped yet. Analyze a safety report to record distributions.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={lsrChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 10 }} angle={-15} textAnchor="end" />
                    <YAxis tick={{ fill: '#64748B', fontSize: 10 }} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1E293B', borderColor: '#475569', borderRadius: '6px', color: '#F8FAFC', fontSize: '11px' }}
                      formatter={(value, name, props) => [value, props.payload.fullName]}
                    />
                    <Bar dataKey="Incidents" fill="#0369A1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Top Hazards & Activities Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Top Hazards List */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4 text-sky-700 dark:text-sky-400" />
                Top Field Hazards Identified
              </h4>
              <span className="text-[11px] text-slate-500">Frequency</span>
            </div>

            <div className="space-y-2">
              {(!stats.top_hazards_breakdown || stats.top_hazards_breakdown.length === 0) ? (
                <p className="text-xs text-slate-400 py-4 text-center">No field hazards recorded yet in analyzed reports.</p>
              ) : (
                stats.top_hazards_breakdown.slice(0, 5).map((h, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800/80">
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-400 text-[11px] font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{h.hazard}</span>
                    </div>
                    <span className="text-xs font-mono font-semibold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                      {h.count} reports
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Top Operational Activities */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-sky-700 dark:text-sky-400" />
                Top Operational Activities
              </h4>
              <span className="text-[11px] text-slate-500">Activity Count</span>
            </div>

            <div className="space-y-2">
              {activityData.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No operational activities recorded yet in analyzed reports.</p>
              ) : (
                activityData.map((act, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800/80">
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 text-[11px] font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{act.name}</span>
                    </div>
                    <span className="text-xs font-mono font-semibold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                      {act.count} reports
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* High-Risk Precursor Watchlist */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-3 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-red-600 dark:text-red-400" />
              High-Risk SIF Precursor Watchlist
            </h4>
            <span className="text-[11px] text-slate-500">Requires HSE Officer Review</span>
          </div>

          <div className="space-y-2">
            {(!stats.recent_high_risk_reports || stats.recent_high_risk_reports.length === 0) ? (
              <p className="text-xs text-slate-400 py-4 text-center">No high SIF precursor reports currently recorded.</p>
            ) : (
              stats.recent_high_risk_reports.map(report => (
                <div
                  key={report.id}
                  onClick={() => onSelectReport(report)}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-950 border border-red-200 dark:border-red-900/50 hover:border-red-400 rounded-lg cursor-pointer transition"
                >
                  <div className="space-y-0.5 max-w-2xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-red-200 dark:border-red-900/50">
                        HIGH SIF
                      </span>
                      <span className="text-xs text-slate-500 font-mono">{report.report_number}</span>
                      <span className="text-xs text-slate-500">• {report.location}</span>
                    </div>

                    <h5 className="text-xs font-bold text-slate-900 dark:text-slate-200 group-hover:text-sky-700 dark:group-hover:text-sky-400 transition">
                      {report.title}
                    </h5>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 font-sans">
                      {report.report_text}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50">
                        {report.life_saving_rule}
                      </span>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        Status: <span className="text-slate-800 dark:text-slate-200 font-semibold">{report.review_status}</span>
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-700 dark:group-hover:text-sky-400 transition" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* SECTION 2: HSE OPERATIONAL ANALYTICS (SUPPORTING CONTEXT FROM CLEAN HSE CSVs) */}
      {hseAnalytics && (
        <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-widest flex items-center gap-2">
                <Database className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                HSE Operational Analytics
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Supporting field operational context from clean field registers (Safety Observations, Incident Register, Training Records). Separately presented from AI SIF analysis.
              </p>
            </div>
            <span className="text-[10px] font-mono text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-900/50">
              Clean Field Registers
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Department Observations */}
            <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs">
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Field Observations by Department</span>
                <span className="text-[10px] font-normal text-slate-500">300 total records</span>
              </h4>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={deptData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                    <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 10 }} />
                    <YAxis tick={{ fill: '#64748B', fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#475569', borderRadius: '6px', fontSize: '11px' }} />
                    <Bar dataKey="Count" fill="#D97706" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Department Training Compliance Gaps */}
            <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs">
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Department Training Gaps (Expired / Pending)</span>
                <span className="text-[10px] font-normal text-slate-500">300 training records</span>
              </h4>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trainingGapData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                    <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 10 }} />
                    <YAxis tick={{ fill: '#64748B', fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#475569', borderRadius: '6px', fontSize: '11px' }} />
                    <Bar dataKey="Expired" fill="#DC2626" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Pending" fill="#0284C7" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
