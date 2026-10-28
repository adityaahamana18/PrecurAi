import React, { useState } from 'react';
import { 
  Search, Filter, AlertOctagon, AlertTriangle, ShieldCheck, 
  Eye, RefreshCw, BookOpen, Shield, Clock, CheckCircle2, ChevronRight,
  Database
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
    <div className="space-y-6 animate-fade-in font-sans text-[#F4F7FB]">
      
      {/* ── Top Header Banner ── */}
      <div className="cinematic-card p-6 rounded-2xl border border-[#00E5FF]/20 bg-[#0D1424]/90 shadow-cinematic relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#00E5FF]/15 via-[#8B5CF6]/10 to-transparent blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#00E5FF] to-[#8B5CF6] flex items-center justify-center text-[#070B14] shadow-cyan-glow font-bold">
                <Database className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-black text-[#F4F7FB] tracking-tight">
                Safety Reports Incident Registry
              </h2>
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed max-w-xl">
              Immutable ledger of field safety observations, neural classification results, and qualified HSE supervisory reviews.
            </p>
          </div>

          <button
            onClick={handleRefreshClick}
            className="btn-ghost-dark inline-flex items-center gap-2 text-xs font-bold px-4 py-2.5 active:scale-95 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#00E5FF] ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Sync Database</span>
          </button>
        </div>

        {/* Quick KPI Count Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-[#00E5FF]/15">
          <div className="bg-[#070B14] p-3.5 rounded-xl border border-[#00E5FF]/20">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block">Total In Registry</span>
            <span className="text-xl font-black text-[#F4F7FB] font-mono mt-0.5 block">{reports?.length || 0}</span>
          </div>
          <div className="bg-[#070B14] p-3.5 rounded-xl border border-[#FF4757]/40">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF4757] block">High SIF Precursors</span>
            <span className="text-xl font-black text-[#FF4757] font-mono mt-0.5 block">{highCount}</span>
          </div>
          <div className="bg-[#070B14] p-3.5 rounded-xl border border-[#FFB020]/40">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFB020] block">Medium SIF</span>
            <span className="text-xl font-black text-[#FFB020] font-mono mt-0.5 block">{medCount}</span>
          </div>
          <div className="bg-[#070B14] p-3.5 rounded-xl border border-[#2EE59D]/40">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2EE59D] block">Low Routine Risk</span>
            <span className="text-xl font-black text-[#2EE59D] font-mono mt-0.5 block">{lowCount}</span>
          </div>
        </div>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="cinematic-card p-4 rounded-2xl flex flex-col md:flex-row gap-3.5 justify-between items-stretch md:items-center border border-[#00E5FF]/20 bg-[#0D1424]/90 shadow-cinematic">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#00E5FF]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search report #, title, hazard, site location..."
            className="dark-input w-full pl-10 pr-4 py-2 text-xs text-[#F4F7FB]"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSifFilter(lvl)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                sifFilter === lvl
                  ? 'bg-[#00E5FF] text-[#070B14] shadow-[0_0_12px_rgba(0,229,255,0.4)]'
                  : 'bg-[#070B14] text-[#94A3B8] border border-[#00E5FF]/20 hover:text-[#F4F7FB]'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table of Incident Reports ── */}
      <div className="cinematic-card rounded-2xl border border-[#00E5FF]/20 bg-[#0D1424]/90 shadow-cinematic overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#00E5FF]/15 bg-[#070B14] text-[#64748B] font-mono uppercase text-[10px]">
                <th className="py-3 px-4">Ref #</th>
                <th className="py-3 px-4">Title &amp; Narrative</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Life-Saving Rule</th>
                <th className="py-3 px-4 text-center">SIF Potential</th>
                <th className="py-3 px-4 text-center">Review Status</th>
                <th className="py-3 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#00E5FF]/10 font-sans">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-[#94A3B8]">
                    No incident reports match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => {
                  const effectiveSif = (report.final_sif_level || report.sif_potential || 'LOW').toUpperCase();
                  const badgeClass =
                    effectiveSif === 'HIGH' ? 'bg-[#FF4757]/20 text-[#FF4757] border-[#FF4757]/50' :
                    effectiveSif === 'MEDIUM' ? 'bg-[#FFB020]/20 text-[#FFB020] border-[#FFB020]/50' :
                    'bg-[#2EE59D]/20 text-[#2EE59D] border-[#2EE59D]/50';

                  const isReviewed = report.review_status === 'REVIEWED';

                  return (
                    <tr
                      key={report.id}
                      onClick={() => onSelectReport(report)}
                      className="hover:bg-[#111A2E]/60 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-[#00E5FF]">
                        {report.report_number || `#${report.id}`}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#F4F7FB] group-hover:text-[#00E5FF] transition-colors truncate max-w-[280px]">
                          {report.title || 'Safety Observation'}
                        </div>
                        <div className="text-[11px] text-[#94A3B8] truncate max-w-[280px]">
                          {report.report_text || report.text}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-[#94A3B8]">
                        {report.location || 'General Plant'}
                      </td>
                      <td className="py-3.5 px-4 text-[#8B5CF6] font-mono text-[11px]">
                        {report.life_saving_rule || 'General Control'}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold border ${badgeClass}`}>
                          {effectiveSif}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono ${
                          isReviewed
                            ? 'bg-[#2EE59D]/15 text-[#2EE59D] border border-[#2EE59D]/40'
                            : 'bg-[#FFB020]/15 text-[#FFB020] border border-[#FFB020]/40'
                        }`}>
                          {isReviewed ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {isReviewed ? 'VERIFIED' : 'PENDING'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="text-[#00E5FF] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-bold">
                          <Eye className="w-3.5 h-3.5" />
                        </span>
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
