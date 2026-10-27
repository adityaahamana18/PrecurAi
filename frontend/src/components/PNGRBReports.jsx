import React, { useState, useEffect } from 'react';
import {
  FileText,
  AlertTriangle,
  Eye,
  Upload,
  RefreshCw,
  Search,
  Filter,
  Layers,
  Building,
  MapPin,
  FileCheck,
  Zap,
  Info,
  BookOpen,
  X,
  Shield
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
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">PNGRB Official Incident Reports</h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Petroleum & Natural Gas Regulatory Board PDF Ingestion & Source Traceability Pipeline
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition shadow-xs">
            <Upload className="w-3.5 h-3.5" />
            <span>{uploading ? 'Ingesting PDF...' : 'Upload PDF Report'}</span>
            <input type="file" accept=".pdf" onChange={handleFileUpload} disabled={uploading} className="hidden" />
          </label>

          <button
            onClick={handleRunDirectoryIngestion}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-lg text-xs border border-slate-300 dark:border-slate-700 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Run Directory Ingestion</span>
          </button>
        </div>
      </div>

      {uploadMessage && (
        <div
          className={`p-3 rounded-lg text-xs flex items-center justify-between ${
            uploadMessage.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900' : 'bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-900'
          }`}
        >
          <span>{uploadMessage.text}</span>
          <button onClick={() => setUploadMessage(null)} className="text-slate-500 hover:text-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="flex justify-between items-center text-slate-500 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Ingested Documents</span>
            <FileText className="w-4 h-4 text-sky-700 dark:text-sky-400" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-slate-100">{stats.total}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Official PNGRB investigation files</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/60 rounded-xl p-4 shadow-xs">
          <div className="flex justify-between items-center text-slate-500 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 dark:text-red-400">High Precursor Potential</span>
            <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
          </div>
          <div className="text-xl font-bold text-red-700 dark:text-red-400">{stats.highPrecursor}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">High-energy hazard indicators identified</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="flex justify-between items-center text-slate-500 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Pages Processed</span>
            <Layers className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-slate-100">{stats.totalPages}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Page-level source mapped</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="flex justify-between items-center text-slate-500 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Scanned / OCR Warning</span>
            <Info className="w-4 h-4 text-sky-700 dark:text-sky-400" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-slate-100">{stats.scannedCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Low extractable text documents</div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 flex flex-col md:flex-row gap-3 items-center justify-between shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search report, title, operator, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-bold">Pipeline:</span>
            <select
              value={pipelineFilter}
              onChange={(e) => setPipelineFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
            >
              <option value="ALL">All Pipelines</option>
              <option value="Natural Gas">Natural Gas Trunkline</option>
              <option value="CGD">City Gas (CGD)</option>
              <option value="Crude">Crude / Petroleum</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-bold">Precursor:</span>
            <select
              value={precursorFilter}
              onChange={(e) => setPrecursorFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
            >
              <option value="ALL">All Potential Ratings</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>
          </div>
        </div>
      </div>

      {/* Document Registry Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 font-bold uppercase border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3">Document / Operator</th>
                <th className="px-4 py-3">Pipeline Network</th>
                <th className="px-4 py-3">Human Impact</th>
                <th className="px-4 py-3">SIF Precursor Potential</th>
                <th className="px-4 py-3">Labeling Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-slate-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-1 text-amber-600" />
                    Loading PNGRB reports...
                  </td>
                </tr>
              ) : filteredReports.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-slate-400">
                    No PNGRB reports matched your search query.
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{report.title}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <Building className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                        <span>{report.operator_company || 'PNGRB Operator'}</span>
                        <span>•</span>
                        <FileText className="w-3 h-3 text-slate-400" />
                        <span>{report.filename}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs text-slate-800 dark:text-slate-200 font-bold">{report.pipeline_type}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        <span>{report.location || 'India'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs font-semibold">
                        <span className="text-red-700 dark:text-red-400">{report.fatalities} Fatal</span>
                        <span className="mx-1 text-slate-400">|</span>
                        <span className="text-amber-700 dark:text-amber-400">{report.injuries} Injured</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                          report.potential_precursor === 'HIGH'
                            ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border border-red-200 dark:border-red-900'
                            : report.potential_precursor === 'MEDIUM'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-900'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
                        }`}
                      >
                        {report.potential_precursor} PRECURSOR
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        <Shield className="w-3 h-3 text-sky-600 dark:text-sky-400" />
                        {report.sif_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleViewDetail(report.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded text-xs transition shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View Intelligence
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
