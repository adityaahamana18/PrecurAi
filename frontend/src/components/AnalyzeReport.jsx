import React, { useState, useRef } from 'react';
import { 
  UploadCloud, FileText, MapPin, Activity, Tag, ArrowRight, X, 
  CheckCircle2, AlertCircle, Sparkles, Zap, Shield, FileCheck2, Cpu
} from 'lucide-react';

const SAMPLE_SCENARIOS = [
  {
    label: "Confined Space Entry",
    type: "Near-Miss",
    site: "Terminal Tank Farm T-201",
    activity: "Vessel Maintenance",
    text: "During maintenance, a worker was preparing to enter a confined space. Required gas testing had not been completed before entry. The supervisor identified the issue and stopped the activity. No injury occurred.",
    badge: "Gas Hazard",
  },
  {
    label: "Suspended Crane Load",
    type: "Unsafe Condition",
    site: "Central Heavy Rigging Yard",
    activity: "Lifting Operations",
    text: "During lifting operations, a suspended load was moved over an area where workers were present. The lifting activity was stopped after the unsafe condition was observed.",
    badge: "Lifting",
  },
  {
    label: "High Voltage LOTO",
    type: "Unsafe Condition",
    site: "Gas Processing Unit 3",
    activity: "Pipe & Valve Maintenance",
    text: "Technician opened high pressure hydrocarbon line valve V-104 before LOTO energy isolation was verified. Residual pressure gauge was showing 140 PSI.",
    badge: "Pressure",
  },
  {
    label: "6m Work at Height",
    type: "Unsafe Act",
    site: "Refinery Distillation Platform B",
    activity: "Working at Height",
    text: "Scaffolder working at 6m height on platform piping rack without harness tie-off lanyard attached to anchor point.",
    badge: "Fall Risk",
  },
  {
    label: "Routine PPE Observation",
    type: "Unsafe Act",
    site: "General Operations Bay B",
    activity: "Routine Operations",
    text: "An employee was observed walking through the workplace without a safety helmet. No hazardous energy or high-consequence exposure was identified.",
    badge: "PPE",
  }
];

export default function AnalyzeReport({ onAnalyzeComplete }) {
  const [activeTab, setActiveTab] = useState("upload"); // "upload" | "text"
  
  // File Upload State
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadSiteLocation, setUploadSiteLocation] = useState("Offshore Rig / Field Ops");
  const [uploadDepartment, setUploadDepartment] = useState("General Operations");
  const fileInputRef = useRef(null);

  // Text Form State
  const [reportType, setReportType] = useState("Auto-detect");
  const [siteLocation, setSiteLocation] = useState("Terminal Tank Farm T-201");
  const [activity, setActivity] = useState("Vessel Maintenance");
  const [reportText, setReportText] = useState(SAMPLE_SCENARIOS[0].text);

  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileExt = (filename) => {
    return filename ? filename.split('.').pop().toUpperCase() : 'FILE';
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file) => {
    setError(null);
    const validExtensions = ['.pdf', '.docx', '.txt'];
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!validExtensions.includes(ext)) {
      setError(`Unsupported file format '${ext}'. Please upload a .pdf, .docx, or .txt document.`);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError(`File size (${formatFileSize(file.size)}) exceeds maximum allowed 10MB limit.`);
      return;
    }

    setSelectedFile(file);
  };

  const handleLoadScenario = (sc) => {
    setReportType(sc.type);
    setSiteLocation(sc.site);
    setActivity(sc.activity);
    setReportText(sc.text);
    setError(null);
  };

  const handleFileUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select a PDF, DOCX, or TXT document to analyze.");
      return;
    }

    setAnalyzing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      if (uploadSiteLocation) formData.append("site_location", uploadSiteLocation);
      if (uploadDepartment) formData.append("unit_department", uploadDepartment);

      const res = await fetch('/api/analyze-file', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || errData.message || "File analysis failed.");
      }

      const resultData = await res.json();

      onAnalyzeComplete(resultData, {
        siteLocation: uploadSiteLocation || "Field Operations",
        activity: uploadDepartment || "Uploaded Document Analysis",
        reportText: resultData.full_text || "",
        sourceDocument: resultData.source_document
      });
    } catch (err) {
      setError(err.message || "Failed to process and analyze uploaded file.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleTextAnalyze = async (e) => {
    e.preventDefault();
    if (!reportText.trim()) {
      setError("Please provide safety report text.");
      return;
    }

    setAnalyzing(true);
    setError(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ report_text: reportText })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || errData.detail || "Analysis failed");
      }

      const resultData = await res.json();

      try {
        await fetch('/api/reports', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: reportText,
            title: `${reportType !== "Auto-detect" ? reportType : "Safety"} Observation - ${siteLocation}`,
            location: siteLocation,
            unit_department: activity,
            reporter_role: "Field Observer"
          })
        });
      } catch (saveErr) {
        console.warn("Auto-persist warning:", saveErr);
      }

      onAnalyzeComplete(resultData, {
        reportType,
        siteLocation,
        activity,
        reportText
      });
    } catch (err) {
      setError(err.message || "Failed to analyze safety report.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Top Banner with Workflow Switcher */}
      <div className="corp-card p-6 rounded-2xl shadow-card-sunset border border-plum-700/40 relative overflow-hidden">
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-coral-500/15 via-plum-600/10 to-transparent blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-plum-700 to-coral-500 flex items-center justify-center shadow-lg shadow-coral-500/20">
                <Sparkles className="w-4 h-4 text-white animate-pulse" />
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Analyze Safety Observation
              </h2>
            </div>
            <p className="text-xs text-plum-300/80 leading-relaxed max-w-xl">
              Extract high-energy precursors, IOGP Life-Saving Rules violations, and barrier failures using PrecurAi neural intelligence.
            </p>
          </div>

          {/* Workflow Toggle Tabs */}
          <div className="flex items-center bg-velvet-950/80 p-1 rounded-xl border border-plum-800/60 shrink-0 shadow-inner">
            <button
              type="button"
              onClick={() => { setActiveTab("upload"); setError(null); }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${
                activeTab === "upload"
                  ? "bg-gradient-to-r from-coral-500 to-plum-600 text-white shadow-lg shadow-coral-500/25 scale-[1.02]"
                  : "text-plum-300 hover:text-white"
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload Document</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab("text"); setError(null); }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${
                activeTab === "text"
                  ? "bg-gradient-to-r from-coral-500 to-plum-600 text-white shadow-lg shadow-coral-500/25 scale-[1.02]"
                  : "text-plum-300 hover:text-white"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Paste Narrative</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: UPLOAD SAFETY REPORT WORKFLOW */}
      {activeTab === "upload" && (
        <form onSubmit={handleFileUploadSubmit} className="corp-card p-6 rounded-2xl space-y-5 border border-plum-700/40 animate-fade-up">
          {/* Drag & Drop File Area */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-center min-h-[210px] group relative overflow-hidden ${
              dragActive
                ? "border-coral-400 bg-coral-500/10 shadow-coral-glow scale-[1.01]"
                : selectedFile
                ? "border-apricot-400/80 bg-plum-900/40 shadow-gold-glow"
                : "border-plum-700/60 hover:border-coral-400/80 bg-velvet-950/60 hover:bg-plum-900/20"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileChange}
              className="hidden"
            />

            {!selectedFile ? (
              <div className="space-y-3 relative z-10 flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-velvet-700 via-plum-600 to-coral-500 flex items-center justify-center shadow-lg shadow-coral-500/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <UploadCloud className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white group-hover:text-coral-300 transition-colors">
                    Drag &amp; drop safety document here, or <span className="text-coral-400 underline decoration-coral-400/50 underline-offset-4">browse files</span>
                  </p>
                  <p className="text-xs text-plum-300/80 mt-1">
                    Accepts <strong className="text-apricot-300">PDF, DOCX, and TXT</strong> incident reports up to <strong className="text-apricot-300">10MB</strong>
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-1 text-[11px] text-plum-400 font-mono">
                  <span className="px-2 py-0.5 rounded bg-plum-800/40 border border-plum-700/50">OCR Scanned PDFs</span>
                  <span>•</span>
                  <span className="px-2 py-0.5 rounded bg-plum-800/40 border border-plum-700/50">Field Audit Logs</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2 relative z-10 animate-fade-in flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-coral-500 to-apricot-400 text-velvet-950 flex items-center justify-center shadow-lg shadow-coral-500/30">
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-white">{selectedFile.name}</p>
                <div className="flex items-center justify-center gap-2 text-xs">
                  <span className="bg-coral-500/20 text-coral-300 px-2.5 py-0.5 rounded-full font-mono font-bold border border-coral-500/40">
                    {getFileExt(selectedFile.name)}
                  </span>
                  <span className="text-plum-300 font-mono">{formatFileSize(selectedFile.size)}</span>
                  <span className="text-apricot-400 font-semibold">• Ready for Extraction</span>
                </div>
              </div>
            )}
          </div>

          {/* Selected File Details Bar */}
          {selectedFile && (
            <div className="corp-card p-3.5 rounded-xl flex items-center justify-between border border-plum-700/50 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-plum-700 to-coral-500 flex items-center justify-center text-white shrink-0 font-mono font-bold text-xs shadow-md">
                  {getFileExt(selectedFile.name)}
                </div>
                <div>
                  <span className="text-xs font-bold text-white block truncate max-w-md">{selectedFile.name}</span>
                  <span className="text-[11px] text-plum-300 font-mono">{formatFileSize(selectedFile.size)} • Verified file input</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="text-plum-400 hover:text-coral-400 p-1.5 rounded-lg hover:bg-plum-800/40 transition"
                title="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Metadata Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-plum-200 block mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-coral-400" />
                Site / Location <span className="text-[10px] text-plum-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={uploadSiteLocation}
                onChange={(e) => setUploadSiteLocation(e.target.value)}
                placeholder="e.g. FPSO Deck B, Refinery Unit 3"
                className="dark-input w-full px-3.5 py-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-plum-200 block mb-1.5 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-apricot-400" />
                Unit / Department <span className="text-[10px] text-plum-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={uploadDepartment}
                onChange={(e) => setUploadDepartment(e.target.value)}
                placeholder="e.g. Lifting Operations, Maintenance"
                className="dark-input w-full px-3.5 py-2.5 text-xs text-white"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-950/40 border border-red-800/60 text-red-300 p-3.5 rounded-xl text-xs flex items-center gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={analyzing || !selectedFile}
            className="w-full btn-sunset-primary disabled:opacity-40 py-3 px-5 text-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            {analyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="font-bold">Extracting Precursors &amp; Analyzing Barriers...</span>
              </>
            ) : (
              <>
                <Cpu className="w-4 h-4" />
                <span className="font-bold">Execute PrecurAi Neural Engine</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </form>
      )}

      {/* TAB 2: MANUAL TEXT INPUT WORKFLOW */}
      {activeTab === "text" && (
        <div className="space-y-4 animate-fade-up">
          {/* Preset Scenario Selector */}
          <div className="corp-card p-4.5 rounded-2xl border border-plum-700/40 space-y-2.5">
            <span className="text-[11px] font-bold text-apricot-400 uppercase tracking-wider block flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              Quick-Load Real Safety Observations:
            </span>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_SCENARIOS.map((sc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleLoadScenario(sc)}
                  className="text-xs bg-velvet-900/80 hover:bg-plum-800/60 text-plum-200 hover:text-white border border-plum-700/50 hover:border-coral-400/60 px-3 py-1.5 rounded-xl transition-all duration-200 flex items-center gap-2 group hover:scale-[1.02]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-coral-400 group-hover:animate-ping" />
                  <span>{sc.label}</span>
                  <span className="text-[10px] text-apricot-400/80 bg-plum-950/60 px-1.5 py-0.2 rounded border border-plum-700/40">
                    {sc.badge}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleTextAnalyze} className="corp-card p-6 rounded-2xl space-y-4 border border-plum-700/40">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-plum-200 block mb-1.5 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-coral-400" />
                  Report Type
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="dark-input w-full px-3 py-2 text-xs text-white"
                >
                  <option value="Auto-detect">Auto-detect Report Type</option>
                  <option value="Unsafe Act">Unsafe Act</option>
                  <option value="Unsafe Condition">Unsafe Condition</option>
                  <option value="Near-Miss">Near-Miss Report</option>
                  <option value="Incident Report">Incident Report</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-plum-200 block mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-apricot-400" />
                  Site / Location
                </label>
                <input
                  type="text"
                  value={siteLocation}
                  onChange={(e) => setSiteLocation(e.target.value)}
                  placeholder="e.g. FPSO Deck B, Refinery Unit 3"
                  className="dark-input w-full px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-plum-200 block mb-1.5 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-plum-400" />
                  Activity Context
                </label>
                <input
                  type="text"
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  placeholder="e.g. Vessel Maintenance, Scaffolding"
                  className="dark-input w-full px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-plum-200 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-coral-400" />
                  Safety Observation Narrative
                </label>
                <span className="text-[11px] text-plum-400 font-mono">{reportText.length} characters</span>
              </div>
              <textarea
                rows={5}
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                placeholder="Describe the safety observation, unsafe act, condition, or near-miss in detail..."
                className="dark-input w-full p-3.5 text-xs text-white leading-relaxed resize-none font-sans"
              />
            </div>

            {error && (
              <div className="bg-red-950/40 border border-red-800/60 text-red-300 p-3.5 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={analyzing || !reportText.trim()}
              className="w-full btn-sunset-primary disabled:opacity-40 py-3 px-5 text-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              {analyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="animate-pulse font-bold">Executing SIF Precursor Intelligence Engine...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span className="font-bold">Analyze SIF Precursor Intelligence</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
