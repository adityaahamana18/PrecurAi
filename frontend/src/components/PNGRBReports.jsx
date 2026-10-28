import React, { useState, useEffect } from 'react';
import {
  FileText, AlertTriangle, Eye, Upload, RefreshCw, Search,
  Filter, Layers, Building, MapPin, FileCheck, Zap, Info,
  BookOpen, X, Shield, ArrowUpRight, CheckCircle2, ChevronRight
} from 'lucide-react';

const API_BASE = '/api/pn-grb';

export default function PNGRBReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [pipelineFilter, setPipelineFilter] = useState('ALL');
  const [precursorFilter, setPrecursorFilter] = useState('ALL');

  // Source Verification Modal State
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);
  const [verificationPageData, setVerificationPageData] = useState(null);
  const [loadingPageText, setLoadingPageText] = useState(false);

  // Upload modal state
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/reports`);
      if (res.ok) {
        const data = await res.json();
        setReports(data);
      }
    } catch (err) {
      console.error('Failed to fetch PNGRB reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunDirectoryIngestion = async () => {
    setLoading(true);
    try {
      await fetch(`${API_BASE}/process-directory`, { method: 'POST' });
      await fetchReports();
    } catch (err) {
      console.error('Failed to run directory ingestion:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setUploadMessage(null);
    try {
      const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        setUploadMessage({ type: 'success', text: `Uploaded and ingested ${file.name} successfully!` });
        await fetchReports();
      } else {
        const errData = await res.json();
        setUploadMessage({ type: 'error', text: errData.detail || 'Failed to upload PDF report.' });
      }
    } catch (err) {
      setUploadMessage({ type: 'error', text: 'Failed to upload PDF report.' });
    } finally {
      setUploading(false);
    }
  };

  const handleViewDetail = async (reportId) => {
    setLoadingDetail(true);
    try {
      const res = await fetch(`${API_BASE}/reports/${reportId}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedReport(data);
      }
    } catch (err) {
      console.error('Failed to fetch report details:', err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleVerifySource = async (reportId, pageNum) => {
    setLoadingPageText(true);
    setVerificationModalOpen(true);
    try {
      const res = await fetch(`${API_BASE}/reports/${reportId}/pages/${pageNum}`);
      if (res.ok) {
        const data = await res.json();
        setVerificationPageData(data);
      } else {
        setVerificationPageData({ page_number: pageNum, page_text: 'Failed to load page text.' });
      }
    } catch (err) {
      console.error('Failed to fetch page text:', err);
      setVerificationPageData({ page_number: pageNum, page_text: 'Failed to load page text.' });
    } finally {
      setLoadingPageText(false);
    }
  };

  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.filename?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.operator_company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPipeline = pipelineFilter === 'ALL' || r.pipeline_type?.includes(pipelineFilter);
    const matchesPrecursor = precursorFilter === 'ALL' || r.potential_precursor === precursorFilter;

    return matchesSearch && matchesPipeline && matchesPrecursor;
  });

  const stats = {
    total: reports.length,
    highPrecursor: reports.filter((r) => r.potential_precursor === 'HIGH').length,
    scannedCount: reports.filter((r) => r.is_scanned).length,
    totalPages: reports.reduce((acc, r) => acc + (r.total_pages || 0), 0)
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="corp-card p-6 rounded-2xl shadow-card-sunset border border-plum-700/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-coral-500/15 via-plum-600/10 to-transparent blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-plum-700 to-coral-500 flex items-center justify-center shadow-lg shadow-coral-500/20">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                PNGRB Official Incident Reports
              </h2>
            </div>
            <p className="text-xs text-plum-300/80 leading-relaxed max-w-xl">
              Petroleum &amp; Natural Gas Regulatory Board investigation reports pipeline with explainable page-level source traceability.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 btn-sunset-primary text-xs shadow-coral-glow hover:scale-105 active:scale-95 transition-all">
              <Upload className="w-3.5 h-3.5" />
              <span>{uploading ? 'Ingesting PDF...' : 'Upload PDF Report'}</span>
              <input type="file" accept=".pdf" onChange={handleFileUpload} disabled={uploading} className="hidden" />
            </label>

            <button
              onClick={handleRunDirectoryIngestion}
              disabled={loading}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-velvet-900/90 hover:bg-plum-800/80 text-plum-200 hover:text-white font-bold rounded-xl text-xs border border-plum-700/60 hover:border-coral-400 transition-all shadow-md active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-apricot-400 ${loading ? 'animate-spin' : ''}`} />
              <span>Sync Archive</span>
            </button>
          </div>
        </div>
      </div>

      {uploadMessage && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center justify-between border animate-fade-in ${
            uploadMessage.type === 'success' 
              ? 'bg-emerald-950/60 text-emerald-200 border-emerald-800/60' 
              : 'bg-red-950/60 text-red-200 border-red-800/60'
          }`}
        >
          <span>{uploadMessage.text}</span>
          <button onClick={() => setUploadMessage(null)} className="text-plum-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="corp-card p-4.5 rounded-2xl border border-plum-700/40 shadow-card-sunset">
          <div className="flex justify-between items-center text-plum-400 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider">Ingested Documents</span>
            <FileText className="w-4 h-4 text-coral-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{stats.total}</div>
          <div className="text-[11px] text-plum-300 mt-1">Official regulatory investigation files</div>
        </div>

        <div className="corp-card p-4.5 rounded-2xl border border-red-900/50 shadow-card-sunset">
          <div className="flex justify-between items-center text-red-400 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider">High SIF Precursors</span>
            <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
          </div>
          <div className="text-2xl font-black text-red-300 font-mono">{stats.highPrecursor}</div>
          <div className="text-[11px] text-red-300/80 mt-1">Major loss of containment indicators</div>
        </div>

        <div className="corp-card p-4.5 rounded-2xl border border-apricot-600/40 shadow-card-sunset">
          <div className="flex justify-between items-center text-apricot-400 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider">Pages Processed</span>
            <Layers className="w-4 h-4 text-apricot-400" />
          </div>
          <div className="text-2xl font-black text-apricot-300 font-mono">{stats.totalPages}</div>
          <div className="text-[11px] text-apricot-300/80 mt-1">Traceable page-level evidence</div>
        </div>

        <div className="corp-card p-4.5 rounded-2xl border border-plum-700/40 shadow-card-sunset">
          <div className="flex justify-between items-center text-plum-400 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider">Scanned / OCR</span>
            <Info className="w-4 h-4 text-plum-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{stats.scannedCount}</div>
          <div className="text-[11px] text-plum-300 mt-1">Scanned documentation processed</div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="corp-card p-4 rounded-2xl flex flex-col md:flex-row gap-3 items-center justify-between border border-plum-700/40 shadow-card-sunset">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-coral-400" />
          <input
            type="text"
            placeholder="Search report, operator, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="dark-input w-full pl-10 pr-3 py-2 text-xs text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-apricot-400" />
            <span className="text-plum-300 font-bold">Network:</span>
            <select
              value={pipelineFilter}
              onChange={(e) => setPipelineFilter(e.target.value)}
              className="dark-input px-3 py-1.5 text-xs text-white"
            >
              <option value="ALL">All Pipelines</option>
              <option value="Natural Gas">Natural Gas Trunkline</option>
              <option value="CGD">City Gas (CGD)</option>
              <option value="Crude">Crude / Petroleum</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-plum-300 font-bold">Precursor:</span>
            <select
              value={precursorFilter}
              onChange={(e) => setPrecursorFilter(e.target.value)}
              className="dark-input px-3 py-1.5 text-xs text-white"
            >
              <option value="ALL">All Potential Ratings</option>
              <option value="HIGH">HIGH SIF</option>
              <option value="MEDIUM">MEDIUM SIF</option>
              <option value="LOW">LOW SIF</option>
            </select>
          </div>
        </div>
      </div>

      {/* Document Registry Table */}
      <div className="corp-card rounded-2xl overflow-hidden border border-plum-700/40 shadow-card-sunset">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-plum-200">
            <thead className="bg-velvet-950/90 text-plum-300 font-bold uppercase tracking-wider text-[10px] border-b border-plum-800/60">
              <tr>
                <th className="px-4 py-3.5">Document / Operator</th>
                <th className="px-4 py-3.5">Pipeline Network</th>
                <th className="px-4 py-3.5">Human Impact</th>
                <th className="px-4 py-3.5">SIF Precursor</th>
                <th className="px-4 py-3.5">Audit Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-plum-900/40">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-plum-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-coral-400" />
                    <span className="text-sm font-semibold">Loading PNGRB official reports...</span>
                  </td>
                </tr>
              ) : filteredReports.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-plum-400">
                    No PNGRB reports matched your search criteria.
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-plum-900/35 transition-colors group">
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-white group-hover:text-coral-300 transition-colors">{report.title}</div>
                      <div className="text-[11px] text-plum-400 flex items-center gap-2 mt-0.5">
                        <Building className="w-3 h-3 text-apricot-400" />
                        <span>{report.operator_company || 'PNGRB Operator'}</span>
                        <span>•</span>
                        <FileText className="w-3 h-3 text-plum-500" />
                        <span className="font-mono">{report.filename}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="text-xs text-plum-200 font-bold">{report.pipeline_type}</div>
                      <div className="text-[11px] text-plum-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-coral-400" />
                        <span>{report.location || 'India'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="text-xs font-semibold">
                        <span className="text-red-400 font-bold">{report.fatalities} Fatal</span>
                        <span className="mx-1.5 text-plum-600">|</span>
                        <span className="text-apricot-400 font-bold">{report.injuries} Injured</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                          report.potential_precursor === 'HIGH'
                            ? 'bg-red-950/60 text-red-300 border-red-800/60 shadow-sm'
                            : report.potential_precursor === 'MEDIUM'
                            ? 'bg-amber-950/60 text-apricot-300 border-amber-800/60 shadow-sm'
                            : 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60 shadow-sm'
                        }`}
                      >
                        {report.potential_precursor} PRECURSOR
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-velvet-950/80 text-plum-300 border border-plum-800/60">
                        <Shield className="w-3 h-3 text-coral-400" />
                        {report.sif_status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => handleViewDetail(report.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 btn-sunset-primary text-xs shadow-sm hover:scale-105 active:scale-95 transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail / Verification Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="corp-card w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 rounded-2xl border border-plum-700/60 shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-plum-800/60 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-coral-400">PNGRB Incident Dossier</span>
                <h3 className="text-base font-bold text-white mt-0.5">{selectedReport.title}</h3>
              </div>
              <button onClick={() => setSelectedReport(null)} className="text-plum-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-velvet-950/80 p-3 rounded-xl border border-plum-800/60">
                <span className="text-[10px] text-plum-400 font-bold uppercase block">Operator</span>
                <p className="font-bold text-white mt-0.5 truncate">{selectedReport.operator_company || 'N/A'}</p>
              </div>
              <div className="bg-velvet-950/80 p-3 rounded-xl border border-plum-800/60">
                <span className="text-[10px] text-plum-400 font-bold uppercase block">Pipeline</span>
                <p className="font-bold text-white mt-0.5 truncate">{selectedReport.pipeline_type || 'N/A'}</p>
              </div>
              <div className="bg-velvet-950/80 p-3 rounded-xl border border-plum-800/60">
                <span className="text-[10px] text-plum-400 font-bold uppercase block">Precursor Level</span>
                <p className="font-bold text-coral-400 mt-0.5">{selectedReport.potential_precursor} SIF</p>
              </div>
              <div className="bg-velvet-950/80 p-3 rounded-xl border border-plum-800/60">
                <span className="text-[10px] text-plum-400 font-bold uppercase block">Total Pages</span>
                <p className="font-bold text-apricot-400 mt-0.5">{selectedReport.total_pages || 1} pages</p>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-plum-300 uppercase tracking-wider block mb-1.5">Executive Summary</span>
              <p className="text-xs text-plum-100 leading-relaxed bg-velvet-950/80 p-3.5 rounded-xl border border-plum-800/60">
                {selectedReport.summary || selectedReport.incident_description || 'Detailed investigation narrative available in full document.'}
              </p>
            </div>

            {selectedReport.evidence_pages && selectedReport.evidence_pages.length > 0 && (
              <div>
                <span className="text-[11px] font-bold text-apricot-400 uppercase tracking-wider block mb-2">
                  Traceable Evidence Pages (Click to Verify Source):
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedReport.evidence_pages.map((pg) => (
                    <button
                      key={pg}
                      onClick={() => handleVerifySource(selectedReport.id, pg)}
                      className="px-3 py-1.5 bg-plum-900/60 hover:bg-coral-500 text-plum-200 hover:text-white border border-plum-700/60 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5"
                    >
                      <span>Page {pg}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Source Page Inspector Modal */}
      {verificationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="corp-card w-full max-w-2xl p-6 rounded-2xl border border-plum-700/60 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-plum-800/60 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-coral-400" />
                <h4 className="text-sm font-bold text-white">Source Verification — Page {verificationPageData?.page_number}</h4>
              </div>
              <button onClick={() => setVerificationModalOpen(false)} className="text-plum-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {loadingPageText ? (
              <div className="py-12 text-center text-plum-400">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-coral-400" />
                <span>Reading raw document page...</span>
              </div>
            ) : (
              <div className="bg-velvet-950/90 p-4 rounded-xl border border-plum-800/60 max-h-96 overflow-y-auto text-xs text-plum-200 font-mono leading-relaxed whitespace-pre-wrap">
                {verificationPageData?.page_text}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
