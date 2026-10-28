import React, { useState } from 'react';
import { Search, Filter, AlertOctagon, AlertTriangle, ShieldCheck, Eye, RefreshCw, BookOpen, Shield } from 'lucide-react';

export default function ReportsHistory({ reports, onSelectReport, onRefresh }) {
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
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-700 dark:text-sky-400" />
            Safety Reports Audit Registry
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Enterprise database registry of analyzed safety observations, AI precursor predictions, and HSE sign-offs.
          </p>
        </div>
        <button
          onClick={onRefresh}
          className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Registry</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center shadow-xs">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search report #, title, hazard, location..."
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
          />
        </div>

        {/* SIF Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-xs text-slate-500 font-bold mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            SIF:
          </span>
          {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map(level => (
            <button
              key={level}
              onClick={() => setSifFilter(level)}
              className={`px-2.5 py-1 rounded text-xs font-bold transition ${
                sifFilter === level
                  ? level === 'HIGH'
                    ? 'bg-red-600 text-white'
                    : level === 'MEDIUM'
                    ? 'bg-amber-600 text-white'
                    : level === 'LOW'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-900 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {level}
            </button>
          ))}
        </div>

        {/* Status Dropdown Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-bold">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending Review</option>
            <option value="REVIEWED">Reviewed</option>
            <option value="OVERRIDDEN">Overridden</option>
          </select>
        </div>
      </div>

      {/* Enterprise Data Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 font-bold uppercase border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Report #</th>
                <th className="py-3 px-4">Title & Location</th>
                <th className="py-3 px-4">SIF Potential</th>
                <th className="py-3 px-4">Life-Saving Rule</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">HSE Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No safety reports matched your search criteria.
                  </td>
                </tr>
              ) : (
                filteredReports.map(report => {
                  const effectiveSif = report.final_sif_level || report.sif_potential;
                  const isOverridden = !!report.final_sif_level;

                  return (
                    <tr
                      key={report.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition group cursor-pointer"
                      onClick={() => onSelectReport(report)}
                    >
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-sky-400">
                        {report.report_number}
                      </td>

                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-sky-700 dark:group-hover:text-sky-400 transition truncate">
                          {report.title}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {report.location} • {report.unit_department}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-bold text-[10px] uppercase px-2 py-0.5 rounded border inline-flex items-center gap-1 ${
                              effectiveSif === 'HIGH'
                                ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border-red-200 dark:border-red-900'
                                : effectiveSif === 'MEDIUM'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-900'
                                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900'
                            }`}
                          >
                            {effectiveSif === 'HIGH' && <AlertOctagon className="w-3 h-3 text-red-600" />}
                            {effectiveSif === 'MEDIUM' && <AlertTriangle className="w-3 h-3 text-amber-600" />}
                            {effectiveSif === 'LOW' && <ShieldCheck className="w-3 h-3 text-emerald-600" />}
                            {effectiveSif}
                          </span>
                          {isOverridden && (
                            <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-amber-800 dark:text-amber-300 px-1 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                              Overridden
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 max-w-[180px]">
                        <span className="inline-flex items-center gap-1 text-xs text-slate-700 dark:text-slate-300 truncate">
                          <BookOpen className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
                          <span className="truncate">{report.life_saving_rule}</span>
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-slate-200">
                        {Math.round(report.confidence_score * 100)} / 100
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                            report.review_status === 'PENDING'
                              ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                              : report.review_status === 'OVERRIDDEN'
                              ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-900'
                              : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900'
                          }`}
                        >
                          {report.review_status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectReport(report);
                          }}
                          className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded transition"
                          title="View Result & Audit Log"
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
