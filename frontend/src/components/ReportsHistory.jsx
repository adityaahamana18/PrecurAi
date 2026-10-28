import React, { useState } from 'react';
import { 
  Search, Filter, AlertOctagon, AlertTriangle, ShieldCheck, 
  Eye, RefreshCw, BookOpen, Shield, Clock, CheckCircle2, ChevronRight 
} from 'lucide-react';

export default function ReportsHistory({ reports, onSelectReport, onRefresh }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sifFilter, setSifFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshClick = async () => {
    setIsRefreshing(true);
    await onRefresh?.();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const filteredReports = (reports || []).filter(report => {
    const effectiveSif = report.final_sif_level || report.sif_potential;
    const matchesSif = sifFilter === 'ALL' || effectiveSif === sifFilter;
    const matchesStatus = statusFilter === 'ALL' || report.review_status === statusFilter;

    const term = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || (
      report.title?.toLowerCase().includes(term) ||
      report.report_number?.toLowerCase().includes(term) ||
      report.report_text?.toLowerCase().includes(term) ||
      report.location?.toLowerCase().includes(term) ||
      (report.life_saving_rule && report.life_saving_rule.toLowerCase().includes(term))
    );

    return matchesSif && matchesStatus && matchesSearch;
  });

  const highCount = (reports || []).filter(r => (r.final_sif_level || r.sif_potential) === 'HIGH').length;
  const medCount = (reports || []).filter(r => (r.final_sif_level || r.sif_potential) === 'MEDIUM').length;
  const lowCount = (reports || []).filter(r => (r.final_sif_level || r.sif_potential) === 'LOW').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner with Stats Bar */}
      <div className="corp-card p-6 rounded-2xl shadow-card-sunset border border-plum-700/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-coral-500/15 via-plum-600/10 to-transparent blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-plum-700 to-coral-500 flex items-center justify-center shadow-lg shadow-coral-500/20">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Safety Reports Audit Registry
              </h2>
            </div>
            <p className="text-xs text-plum-300/80 leading-relaxed max-w-xl">
              Immutable audit ledger of field safety observations, neural classification results, and qualified HSE supervisory reviews.
            </p>
          </div>

          <button
            onClick={handleRefreshClick}
            className="inline-flex items-center gap-2 bg-velvet-900/90 hover:bg-plum-800/80 text-plum-100 hover:text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-plum-700/60 hover:border-coral-400/60 transition-all duration-300 hover:scale-105 active:scale-95 shadow-md shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-coral-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Sync Registry</span>
          </button>
        </div>

        {/* Quick KPI Count Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-plum-800/60">
          <div className="bg-velvet-950/60 p-3 rounded-xl border border-plum-800/50">
            <span className="text-[10px] font-bold uppercase tracking-wider text-plum-300/80 block">Total In Registry</span>
            <span className="text-xl font-black text-white font-mono mt-0.5 block">{reports?.length || 0}</span>
          </div>
          <div className="bg-velvet-950/60 p-3 rounded-xl border border-red-900/40">
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 block">High SIF Precursors</span>
            <span className="text-xl font-black text-red-300 font-mono mt-0.5 block">{highCount}</span>
          </div>
          <div className="bg-velvet-950/60 p-3 rounded-xl border border-apricot-500/30">
            <span className="text-[10px] font-bold uppercase tracking-wider text-apricot-400 block">Medium SIF</span>
            <span className="text-xl font-black text-apricot-300 font-mono mt-0.5 block">{medCount}</span>
          </div>
          <div className="bg-velvet-950/60 p-3 rounded-xl border border-emerald-900/40">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">Low Routine Risk</span>
            <span className="text-xl font-black text-emerald-300 font-mono mt-0.5 block">{lowCount}</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="corp-card p-4 rounded-2xl flex flex-col md:flex-row gap-3.5 justify-between items-stretch md:items-center border border-plum-700/40 shadow-card-sunset">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-coral-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search report #, title, hazard, site location..."
            className="dark-input w-full pl-10 pr-4 py-2 text-xs text-white"
          />
        </div>

        {/* SIF Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <span className="text-[11px] text-plum-300 font-bold mr-1 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5 text-apricot-400" />
            Filter:
          </span>
          {[
            { id: 'ALL', label: 'All SIF' },
            { id: 'HIGH', label: 'High', color: 'from-red-600 to-rose-700' },
            { id: 'MEDIUM', label: 'Medium', color: 'from-amber-600 to-apricot-600' },
            { id: 'LOW', label: 'Low', color: 'from-emerald-600 to-teal-700' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setSifFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 shrink-0 ${
                sifFilter === f.id
                  ? 'bg-gradient-to-r from-coral-500 to-plum-600 text-white shadow-md shadow-coral-500/30 scale-105'
                  : 'bg-velvet-900/80 text-plum-300 hover:text-white hover:bg-plum-800/60 border border-plum-800/60'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] text-plum-300 font-bold">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="dark-input px-3 py-1.5 text-xs text-white"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending Review</option>
            <option value="REVIEWED">Reviewed</option>
            <option value="OVERRIDDEN">Overridden</option>
          </select>
        </div>
      </div>

      {/* Enterprise Data Table */}
      <div className="corp-card rounded-2xl overflow-hidden border border-plum-700/40 shadow-card-sunset">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-plum-200">
            <thead className="bg-velvet-950/90 text-plum-300 font-bold uppercase tracking-wider text-[10px] border-b border-plum-800/60">
              <tr>
                <th className="py-3.5 px-4">Report ID</th>
                <th className="py-3.5 px-4">Title &amp; Location</th>
                <th className="py-3.5 px-4">SIF Potential</th>
                <th className="py-3.5 px-4">Life-Saving Rule</th>
                <th className="py-3.5 px-4">Confidence</th>
                <th className="py-3.5 px-4">HSE Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-plum-900/40">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-plum-400">
                    <ShieldCheck className="w-8 h-8 mx-auto mb-2 text-plum-500 opacity-60" />
                    <p className="text-sm font-semibold text-plum-300">No safety reports matched your filter.</p>
                    <p className="text-xs text-plum-400 mt-0.5">Try clearing the search term or switching the SIF filter to ALL.</p>
                  </td>
                </tr>
              ) : (
                filteredReports.map((report, idx) => {
                  const effectiveSif = report.final_sif_level || report.sif_potential;
                  const isOverridden = !!report.final_sif_level;

                  return (
                    <tr
                      key={report.id || idx}
                      onClick={() => onSelectReport(report)}
                      className="hover:bg-plum-900/35 transition-all duration-200 group cursor-pointer border-b border-plum-900/30"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-coral-400 group-hover:text-apricot-300 transition-colors">
                        {report.report_number}
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-bold text-white group-hover:text-coral-300 transition-colors truncate">
                          {report.title}
                        </div>
                        <div className="text-[11px] text-plum-400 truncate mt-0.5">
                          {report.location} • {report.unit_department}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-bold text-[10px] uppercase px-2.5 py-1 rounded-lg border inline-flex items-center gap-1.5 ${
                              effectiveSif === 'HIGH'
                                ? 'bg-red-950/60 text-red-300 border-red-800/60 shadow-sm'
                                : effectiveSif === 'MEDIUM'
                                ? 'bg-amber-950/60 text-apricot-300 border-amber-800/60 shadow-sm'
                                : 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60 shadow-sm'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              effectiveSif === 'HIGH' ? 'bg-red-400 animate-pulse' : effectiveSif === 'MEDIUM' ? 'bg-apricot-400' : 'bg-emerald-400'
                            }`} />
                            {effectiveSif} SIF
                          </span>
                          {isOverridden && (
                            <span className="text-[9px] bg-plum-800/60 text-apricot-300 px-1.5 py-0.5 rounded border border-plum-700/60">
                              Overridden
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 max-w-[190px]">
                        <span className="inline-flex items-center gap-1.5 text-xs text-plum-200 truncate">
                          <BookOpen className="w-3.5 h-3.5 text-apricot-400 shrink-0" />
                          <span className="truncate">{report.life_saving_rule}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-white">
                        <span className="text-coral-400">{Math.round(report.confidence_score * 100)}</span>
                        <span className="text-plum-400 text-[10px]">/100</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border inline-flex items-center gap-1 ${
                            report.review_status === 'PENDING'
                              ? 'bg-velvet-950/70 text-plum-300 border-plum-700/60'
                              : report.review_status === 'OVERRIDDEN'
                              ? 'bg-amber-950/50 text-apricot-300 border-amber-800/60'
                              : 'bg-emerald-950/50 text-emerald-300 border-emerald-800/60'
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3 text-current" />
                          {report.review_status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectReport(report);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-velvet-900/80 hover:bg-coral-500 text-plum-200 hover:text-white border border-plum-700/60 hover:border-coral-400 transition-all duration-200 group-hover:scale-105"
                          title="Open detailed precursor audit view"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span className="text-[11px] font-semibold">Inspect</span>
                          <ChevronRight className="w-3 h-3 opacity-60" />
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
