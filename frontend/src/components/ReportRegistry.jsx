import React, { useState } from 'react';
import { Search, Filter, AlertOctagon, AlertTriangle, ShieldCheck, Eye, RefreshCw, BookOpen, Clock } from 'lucide-react';

export default function ReportRegistry({ reports, onSelectReport, onRefresh }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sifFilter, setSifFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredReports = (reports || []).filter(report => {
    const effectiveSif = report.final_sif_level || report.sif_potential;
    const matchesSif = sifFilter === 'ALL' || effectiveSif === sifFilter;
    const matchesStatus = statusFilter === 'ALL' || report.review_status === statusFilter;

    const term = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || (
      report.title.toLowerCase().includes(term) ||
      report.report_number.toLowerCase().includes(term) ||
      report.report_text.toLowerCase().includes(term) ||
      report.location.toLowerCase().includes(term) ||
      (report.life_saving_rule && report.life_saving_rule.toLowerCase().includes(term))
    );

    return matchesSif && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/60 border border-slate-700/60 p-5 rounded-2xl">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-sky-400" />
            Safety Precursor Observation Registry
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Central repository of analyzed field reports with HSE audit history
          </p>
        </div>
        <button
          onClick={onRefresh}
          className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-3.5 py-2 rounded-xl border border-slate-700 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Registry</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-800/70 border border-slate-700/60 p-4 rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        {/* Search Box */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search report #, title, hazard, location..."
            className="w-full bg-slate-900/90 border border-slate-700 focus:border-sky-500 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition"
          />
        </div>

        {/* SIF Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs text-slate-400 font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            SIF:
          </span>
          {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map(level => (
            <button
              key={level}
              onClick={() => setSifFilter(level)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                sifFilter === level
                  ? level === 'HIGH'
                    ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
                    : level === 'MEDIUM'
                    ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                    : level === 'LOW'
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                    : 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                  : 'bg-slate-900/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {level}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900/90 border border-slate-700 focus:border-sky-500 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending Review</option>
            <option value="REVIEWED">Reviewed</option>
            <option value="OVERRIDDEN">Overridden</option>
          </select>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-700/80">
              <tr>
                <th className="py-3.5 px-4">Report #</th>
                <th className="py-3.5 px-4">Title & Location</th>
                <th className="py-3.5 px-4">SIF Potential</th>
                <th className="py-3.5 px-4">Life-Saving Rule</th>
                <th className="py-3.5 px-4">Confidence</th>
                <th className="py-3.5 px-4">HSE Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-700/50">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No safety reports matched your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredReports.map(report => {
                  const effectiveSif = report.final_sif_level || report.sif_potential;
                  const isOverridden = !!report.final_sif_level;

                  return (
                    <tr
                      key={report.id}
                      className="hover:bg-slate-700/30 transition group cursor-pointer"
                      onClick={() => onSelectReport(report)}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-sky-400 shrink-0">
                        {report.report_number}
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-semibold text-slate-200 group-hover:text-sky-300 transition truncate">
                          {report.title}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate mt-0.5">
                          {report.location} • {report.unit_department}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-black text-[10px] uppercase px-2 py-0.5 rounded border inline-flex items-center gap-1 ${
                              effectiveSif === 'HIGH'
                                ? 'bg-red-500/20 text-red-300 border-red-500/40'
                                : effectiveSif === 'MEDIUM'
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            }`}
                          >
                            {effectiveSif === 'HIGH' && <AlertOctagon className="w-3 h-3 text-red-400" />}
                            {effectiveSif === 'MEDIUM' && <AlertTriangle className="w-3 h-3 text-amber-400" />}
                            {effectiveSif === 'LOW' && <ShieldCheck className="w-3 h-3 text-emerald-400" />}
                            {effectiveSif}
                          </span>
                          {isOverridden && (
                            <span className="text-[9px] bg-slate-700 text-amber-300 px-1 py-0.5 rounded border border-amber-500/30" title="Overridden by HSE professional">
                              Edited
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 max-w-[180px]">
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-300 truncate">
                          <BookOpen className="w-3 h-3 text-amber-400 shrink-0" />
                          <span className="truncate">{report.life_saving_rule}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-300">
                        {Math.round(report.confidence_score * 100)}%
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                            report.review_status === 'PENDING'
                              ? 'bg-sky-500/10 text-sky-300 border-sky-500/30'
                              : report.review_status === 'OVERRIDDEN'
                              ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                              : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          }`}
                        >
                          {report.review_status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectReport(report);
                          }}
                          className="p-1.5 text-slate-400 hover:text-sky-400 hover:bg-slate-700/60 rounded-lg transition"
                          title="View Full Detail & Audit Log"
                        >
                          <Eye className="w-4 h-4" />
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
