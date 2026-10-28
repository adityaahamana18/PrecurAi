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
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Top Banner with Stats Bar */}
      <div className="corp-card p-6 rounded-2xl border border-[#2C3480] shadow-cobalt-glow relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#2C3480]/30 via-[#4E5BC9]/10 to-transparent blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#2C3480] border border-[#4E5BC9] flex items-center justify-center shadow-lg shadow-[#2C3480]/50">
                <Shield className="w-4 h-4 text-[#FFFFFF]" />
              </div>
              <h2 className="text-lg font-bold text-[#FFFFFF] tracking-tight">
                Safety Reports Audit Registry
              </h2>
            </div>
            <p className="text-xs text-[#BAC4EB] leading-relaxed max-w-xl">
              Immutable audit ledger of field safety observations, neural classification results, and qualified HSE supervisory reviews.
            </p>
          </div>

          <button
            onClick={handleRefreshClick}
            className="inline-flex items-center gap-2 bg-[#0A0D18] hover:bg-[#2C3480] text-[#FFFFFF] text-xs font-bold px-4 py-2.5 rounded-xl border border-[#2C3480] hover:border-[#FFFFFF] transition-all duration-300 hover:scale-105 active:scale-95 shadow-md shrink-0 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#5B73D1] ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Sync Registry</span>
          </button>
        </div>

        {/* Quick KPI Count Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-[#2C3480]/50">
          <div className="bg-[#000000] p-3.5 rounded-xl border border-[#2C3480]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#BAC4EB] block">Total In Registry</span>
            <span className="text-xl font-black text-[#FFFFFF] font-mono mt-0.5 block">{reports?.length || 0}</span>
          </div>
          <div className="bg-[#000000] p-3.5 rounded-xl border border-[#FF3B30]/40">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF3B30] block">High SIF Precursors</span>
            <span className="text-xl font-black text-[#FF3B30] font-mono mt-0.5 block">{highCount}</span>
          </div>
          <div className="bg-[#000000] p-3.5 rounded-xl border border-[#FF9500]/40">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF9500] block">Medium SIF</span>
            <span className="text-xl font-black text-[#FF9500] font-mono mt-0.5 block">{medCount}</span>
          </div>
          <div className="bg-[#000000] p-3.5 rounded-xl border border-[#34C759]/40">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#34C759] block">Low Routine Risk</span>
            <span className="text-xl font-black text-[#34C759] font-mono mt-0.5 block">{lowCount}</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="corp-card p-4 rounded-2xl flex flex-col md:flex-row gap-3.5 justify-between items-stretch md:items-center border border-[#2C3480] shadow-cobalt-glow">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5B73D1]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search report #, title, hazard, site location..."
            className="dark-input w-full pl-10 pr-4 py-2 text-xs text-[#FFFFFF]"
          />
        </div>

        {/* SIF Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <span className="text-[11px] text-[#BAC4EB] font-bold mr-1 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5 text-[#5B73D1]" />
            Filter:
          </span>
          {[
            { id: 'ALL', label: 'All SIF' },
            { id: 'HIGH', label: 'High' },
            { id: 'MEDIUM', label: 'Medium' },
            { id: 'LOW', label: 'Low' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setSifFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 shrink-0 cursor-pointer ${
                sifFilter === f.id
                  ? 'bg-[#2C3480] text-[#FFFFFF] shadow-md shadow-[#2C3480]/70 scale-105 border border-[#FFFFFF]'
                  : 'bg-[#000000] text-[#BAC4EB] hover:text-[#FFFFFF] hover:bg-[#161D33] border border-[#2C3480]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] text-[#BAC4EB] font-bold">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="dark-input px-3 py-1.5 text-xs text-[#FFFFFF]"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending Review</option>
            <option value="REVIEWED">Reviewed</option>
            <option value="OVERRIDDEN">Overridden</option>
          </select>
        </div>
      </div>

      {/* Enterprise Data Table */}
      <div className="corp-card rounded-2xl overflow-hidden border border-[#2C3480] shadow-cobalt-glow">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#FFFFFF]">
            <thead className="bg-[#05070E] text-[#BAC4EB] font-bold uppercase tracking-wider text-[10px] border-b border-[#2C3480]">
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

            <tbody className="divide-y divide-[#2C3480]/30">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#BAC4EB]">
                    <ShieldCheck className="w-8 h-8 mx-auto mb-2 text-[#5B73D1] opacity-60" />
                    <p className="text-sm font-semibold text-[#FFFFFF]">No safety reports matched your filter.</p>
                    <p className="text-xs text-[#BAC4EB] mt-0.5">Try clearing the search term or switching the SIF filter to ALL.</p>
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
                      className="hover:bg-[#2C3480]/20 transition-all duration-200 group cursor-pointer border-b border-[#2C3480]/25"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-[#5B73D1] group-hover:text-[#FFFFFF] transition-colors">
                        {report.report_number}
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-bold text-[#FFFFFF] group-hover:text-[#8B9DE0] transition-colors truncate">
                          {report.title}
                        </div>
                        <div className="text-[11px] text-[#BAC4EB] truncate mt-0.5">
                          {report.location} • {report.unit_department}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-bold text-[10px] uppercase px-2.5 py-1 rounded-lg border inline-flex items-center gap-1.5 ${
                              effectiveSif === 'HIGH'
                                ? 'bg-[#FF3B30]/15 text-[#FF3B30] border-[#FF3B30]/40'
                                : effectiveSif === 'MEDIUM'
                                ? 'bg-[#FF9500]/15 text-[#FF9500] border-[#FF9500]/40'
                                : 'bg-[#34C759]/15 text-[#34C759] border-[#34C759]/40'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              effectiveSif === 'HIGH' ? 'bg-[#FF3B30] animate-pulse' : effectiveSif === 'MEDIUM' ? 'bg-[#FF9500]' : 'bg-[#34C759]'
                            }`} />
                            {effectiveSif} SIF
                          </span>
                          {isOverridden && (
                            <span className="text-[9px] bg-[#2C3480] text-[#FFFFFF] px-1.5 py-0.5 rounded border border-[#4E5BC9]">
                              Overridden
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 max-w-[190px]">
                        <span className="inline-flex items-center gap-1.5 text-xs text-[#FFFFFF] truncate">
                          <BookOpen className="w-3.5 h-3.5 text-[#5B73D1] shrink-0" />
                          <span className="truncate">{report.life_saving_rule}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-[#FFFFFF]">
                        <span className="text-[#5B73D1]">{Math.round(report.confidence_score * 100)}</span>
                        <span className="text-[#64748B] text-[10px]">/100</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border inline-flex items-center gap-1 ${
                            report.review_status === 'PENDING'
                              ? 'bg-[#000000] text-[#BAC4EB] border-[#2C3480]'
                              : report.review_status === 'OVERRIDDEN'
                              ? 'bg-[#FF9500]/15 text-[#FF9500] border-[#FF9500]/40'
                              : 'bg-[#34C759]/15 text-[#34C759] border-[#34C759]/40'
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
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#000000] hover:bg-[#2C3480] text-[#FFFFFF] border border-[#2C3480] hover:border-[#FFFFFF] transition-all duration-200 group-hover:scale-105"
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
