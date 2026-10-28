import React, { useState, useRef, useEffect } from 'react';
import { 
  UploadCloud, FileText, MapPin, Activity, Tag, ArrowRight, X, 
  CheckCircle2, AlertCircle, Sparkles, Zap, Shield, FileCheck2, Cpu,
  Search, RefreshCw, Terminal, Layers
} from 'lucide-react';

const REALISTIC_DEFAULT_PROMPT = "Technician was working at height without proper fall protection. The required safety barrier was missing.";

const SAMPLE_SCENARIOS = [
  {
    label: "Working at Height (Default)",
    type: "Unsafe Act",
    site: "Distillation Column C-102",
    activity: "Scaffolding & Height Operations",
    text: "Technician was working at height without proper fall protection. The required safety barrier was missing.",
    badge: "Height Fall Risk",
  },
  {
    label: "Confined Space Entry",
    type: "Near-Miss",
    site: "Terminal Tank Farm T-201",
    activity: "Vessel Maintenance",
    text: "During maintenance, a worker was preparing to enter a confined space. Required gas testing had not been completed before entry. The supervisor identified the issue and stopped the activity. No injury occurred.",
    badge: "Atmospheric Hazard",
  },
  {
    label: "Suspended Crane Load",
    type: "Unsafe Condition",
    site: "Central Heavy Rigging Yard",
    activity: "Lifting Operations",
    text: "During lifting operations, a suspended load was moved over an area where workers were present. The lifting activity was stopped after the unsafe condition was observed.",
    badge: "Lifting Envelope",
  },
  {
    label: "High Voltage LOTO",
    type: "Unsafe Condition",
    site: "Gas Processing Unit 3",
    activity: "Pipe & Valve Maintenance",
    text: "Technician opened high pressure hydrocarbon line valve V-104 before LOTO energy isolation was verified. Residual pressure gauge was showing 140 PSI.",
    badge: "Pressure Energy",
  },
  {
    label: "Routine PPE Observation",
    type: "Unsafe Act",
    site: "General Operations Bay B",
    activity: "Routine Operations",
    text: "An employee was observed walking through the workplace without a safety helmet. No hazardous energy or high-consequence exposure was identified.",
    badge: "Low Energy PPE",
  }
];

const TIMELINE_STAGES = [
  { id: 1, label: "Report Ingestion", desc: "Tokenization & Sanitization" },
  { id: 2, label: "NLP Extraction", desc: "Hazard & Barrier Entities" },
  { id: 3, label: "SIF Classification", desc: "High-Energy Model Inference" },
  { id: 4, label: "Rule Mapping", desc: "IOGP 9 Life-Saving Rules" },
  { id: 5, label: "Explainable AI", desc: "Evidence Feature Attribution" },
  { id: 6, label: "Human Review", desc: "HSE Decision Support Ready" },
];

export default function AnalyzeReport({ onAnalyzeComplete }) {
  const [activeTab, setActiveTab] = useState("text"); // default to text for live master prompt experience
  
  // File Upload State
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadSiteLocation, setUploadSiteLocation] = useState("Offshore Rig / Field Ops");
  const [uploadDepartment, setUploadDepartment] = useState("General Operations");
  const fileInputRef = useRef(null);

  // Text Form State
  const [reportType, setReportType] = useState("Auto-detect");
  const [siteLocation, setSiteLocation] = useState("Distillation Column C-102");
  const [activity, setActivity] = useState("Scaffolding & Height Operations");
  const [reportText, setReportText] = useState(REALISTIC_DEFAULT_PROMPT);

  const [analyzing, setAnalyzing] = useState(false);
  const [activeStage, setActiveStage] = useState(0);
  const [error, setError] = useState(null);

  // Animate timeline during analysis
  useEffect(() => {
    let timer;
    if (analyzing) {
      setActiveStage(1);
      timer = setInterval(() => {
        setActiveStage((prev) => {
          if (prev < 6) return prev + 1;
          return prev;
        });
      }, 350);
    } else {
      setActiveStage(0);
    }
    return () => clearInterval(timer);
  }, [analyzing]);

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
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

      // Brief delay to allow timeline to complete full animation
      setTimeout(() => {
        onAnalyzeComplete(resultData, {
          siteLocation: uploadSiteLocation || "Field Operations",
          activity: uploadDepartment || "Uploaded Document Analysis",
          reportText: resultData.full_text || "",
          sourceDocument: resultData.source_document
        });
      }, 600);
    } catch (err) {
      setError(err.message || "Failed to process and analyze uploaded file.");
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

      setTimeout(() => {
        onAnalyzeComplete(resultData, {
          reportType,
          siteLocation,
          activity,
          reportText
        });
      }, 700);
    } catch (err) {
      setError(err.message || "Failed to analyze safety report.");
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in font-sans">
      
      {/* ── Top Command Banner ── */}
      <div className="cinematic-card p-6 rounded-2xl border border-[#00E5FF]/20 shadow-cinematic relative overflow-hidden bg-[#0D1424]/90">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#00E5FF]/15 to-transparent blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#00E5FF]/15 border border-[#00E5FF]/40 flex items-center justify-center shadow-lg shadow-[#00E5FF]/20">
                <Sparkles className="w-4 h-4 text-[#00E5FF] animate-pulse" />
              </div>
              <h2 className="text-xl font-black text-[#F4F7FB] tracking-tight">
                Live AI Safety Precursor Analysis
              </h2>
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed max-w-xl">
              Extract high-energy precursors, failed safety barriers, and IOGP Life-Saving Rules using PrecurAi neural intelligence.
            </p>
          </div>

          {/* Workflow Toggle Tabs */}
          <div className="flex items-center bg-[#070B14] p-1 rounded-xl border border-[#00E5FF]/30 shrink-0 shadow-inner">
            <button
              type="button"
              onClick={() => { setActiveTab("text"); setError(null); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                activeTab === "text"
                  ? "bg-[#00E5FF] text-[#070B14] shadow-[0_0_12px_rgba(0,229,255,0.4)]"
                  : "text-[#94A3B8] hover:text-[#F4F7FB]"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Observation Text</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab("upload"); setError(null); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                activeTab === "upload"
                  ? "bg-[#00E5FF] text-[#070B14] shadow-[0_0_12px_rgba(0,229,255,0.4)]"
                  : "text-[#94A3B8] hover:text-[#F4F7FB]"
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Document Upload</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 6-Stage Horizontal Processing Timeline ── */}
      <div className="cinematic-card p-5 rounded-2xl border border-[#00E5FF]/20 bg-[#0D1424]/80 shadow-cinematic">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#00E5FF]/15">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#00E5FF] uppercase tracking-wider">
            <Cpu className="w-4 h-4 text-[#00E5FF]" />
            <span>Neural Processing Pipeline Architecture</span>
          </div>
          <span className="text-[11px] font-mono text-[#94A3B8]">
            {analyzing ? `Processing Stage ${activeStage} of 6...` : 'Ready for Ingestion'}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 relative">
          {TIMELINE_STAGES.map((st) => {
            const isCompleted = activeStage > st.id || (!analyzing && activeStage === 0);
            const isCurrent = analyzing && activeStage === st.id;
            return (
              <div
                key={st.id}
                className={`p-3 rounded-xl border transition-all duration-300 relative ${
                  isCurrent
                    ? 'bg-[#00E5FF]/15 border-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.4)] scale-105'
                    : isCompleted && analyzing
                    ? 'bg-[#2EE59D]/10 border-[#2EE59D]/40 text-[#2EE59D]'
                    : 'bg-[#070B14]/80 border-[#00E5FF]/15 text-[#94A3B8]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                    isCurrent
                      ? 'bg-[#00E5FF] text-[#070B14]'
                      : 'bg-[#111A2E] text-[#94A3B8]'
                  }`}>
                    0{st.id}
                  </span>
                  {isCurrent && (
                    <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-ping" />
                  )}
                </div>
                <div className="text-xs font-bold text-[#F4F7FB] mt-2 truncate">
                  {st.label}
                </div>
                <div className="text-[10px] text-[#64748B] mt-0.5 truncate">
                  {st.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div className="p-4 rounded-xl bg-[#FF4757]/15 border border-[#FF4757]/50 text-[#FF4757] text-xs flex items-center justify-between gap-3 animate-fade-in shadow-[0_0_20px_rgba(255,71,87,0.2)]">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
          <button onClick={() => setError(null)} className="p-1 hover:text-[#FFFFFF]">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Tab 1: Text Observation Input ── */}
      {activeTab === "text" && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Preset Scenario Pills */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#00E5FF]" />
                Realistic Benchmark Scenarios
              </span>
              <span className="text-[10px] text-[#64748B] font-mono">
                Click any scenario to load narrative
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_SCENARIOS.map((sc, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleLoadScenario(sc)}
                  className={`text-left px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 border cursor-pointer ${
                    reportText === sc.text
                      ? "bg-[#00E5FF]/20 text-[#00E5FF] border-[#00E5FF] shadow-[0_0_12px_rgba(0,229,255,0.25)]"
                      : "bg-[#0D1424] text-[#94A3B8] border-[#00E5FF]/15 hover:border-[#00E5FF]/40 hover:text-[#F4F7FB]"
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5">
                    <span>{sc.label}</span>
                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#070B14] text-[#8B5CF6]">
                      {sc.badge}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Observation Form */}
          <form onSubmit={handleTextAnalyze} className="cinematic-card p-6 rounded-2xl border border-[#00E5FF]/20 bg-[#0D1424]/90 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-mono font-bold uppercase text-[#94A3B8] mb-1.5">
                  Observation Type
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full dark-input px-3.5 py-2.5 text-xs text-[#F4F7FB]"
                >
                  <option value="Auto-detect">AI Auto-Detect</option>
                  <option value="Unsafe Act">Unsafe Act</option>
                  <option value="Unsafe Condition">Unsafe Condition</option>
                  <option value="Near-Miss">Near-Miss</option>
                  <option value="Incident">Incident</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold uppercase text-[#94A3B8] mb-1.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#00E5FF]" />
                  Facility / Unit Location
                </label>
                <input
                  type="text"
                  value={siteLocation}
                  onChange={(e) => setSiteLocation(e.target.value)}
                  placeholder="e.g. Distillation Column C-102"
                  className="w-full dark-input px-3.5 py-2.5 text-xs text-[#F4F7FB]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold uppercase text-[#94A3B8] mb-1.5 flex items-center gap-1">
                  <Activity className="w-3 h-3 text-[#8B5CF6]" />
                  Activity Context
                </label>
                <input
                  type="text"
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  placeholder="e.g. Scaffolding & Height Operations"
                  className="w-full dark-input px-3.5 py-2.5 text-xs text-[#F4F7FB]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono font-bold uppercase text-[#94A3B8]">
                  Observation Narrative / Incident Text
                </label>
                <span className="text-[10px] font-mono text-[#64748B]">
                  {reportText.length} characters
                </span>
              </div>
              <textarea
                rows={5}
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                placeholder="Describe the unsafe act, condition, or near-miss observation in natural language..."
                className="w-full dark-input p-4 text-sm font-sans text-[#F4F7FB] leading-relaxed resize-y min-h-[120px]"
              />
            </div>

            {/* Submit Action */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-[#00E5FF]/15">
              <div className="flex items-center gap-2 text-xs text-[#94A3B8] font-mono">
                <Shield className="w-4 h-4 text-[#00E5FF]" />
                <span>Deterministic IOGP Life-Saving Rules Evaluation</span>
              </div>

              <button
                type="submit"
                disabled={analyzing}
                className="w-full sm:w-auto btn-cinematic-cyan light-sweep-btn flex items-center justify-center gap-2.5 px-8 py-3.5 text-sm cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {analyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#070B14]" />
                    <span>Analyzing Safety Precursors...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-[#070B14]" />
                    <span>Analyze Safety Report</span>
                    <ArrowRight className="w-4 h-4 text-[#070B14]" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Tab 2: Document Upload ── */}
      {activeTab === "upload" && (
        <form onSubmit={handleFileUploadSubmit} className="space-y-6 animate-fade-in">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cinematic-card p-10 rounded-2xl border-2 border-dashed transition-all duration-300 text-center cursor-pointer relative overflow-hidden ${
              dragActive
                ? "border-[#00E5FF] bg-[#00E5FF]/10 shadow-cyan-glow"
                : selectedFile
                ? "border-[#2EE59D] bg-[#2EE59D]/5"
                : "border-[#00E5FF]/30 hover:border-[#00E5FF]/60 bg-[#0D1424]/90"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileChange}
              className="hidden"
            />

            {selectedFile ? (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-[#2EE59D]/20 border border-[#2EE59D] flex items-center justify-center shadow-lg">
                  <FileCheck2 className="w-8 h-8 text-[#2EE59D]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#F4F7FB]">{selectedFile.name}</h3>
                  <p className="text-xs text-[#94A3B8] font-mono mt-1">
                    {formatFileSize(selectedFile.size)} · Ready for Neural Parsing
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[#FF4757] hover:bg-[#FF4757]/20 border border-[#FF4757]/30 transition"
                >
                  <X className="w-3.5 h-3.5" /> Remove Document
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/40 flex items-center justify-center shadow-cyan-glow">
                  <UploadCloud className="w-8 h-8 text-[#00E5FF]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#F4F7FB]">
                    Drag &amp; Drop Safety Report Document
                  </h3>
                  <p className="text-xs text-[#94A3B8] mt-1 max-w-sm mx-auto">
                    Supported formats: PDF, DOCX, TXT (Maximum file size: 10MB)
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#111A2E] text-xs font-mono text-[#00E5FF] border border-[#00E5FF]/20">
                  <span>Browse Local Files</span>
                </div>
              </div>
            )}
          </div>

          {/* Document Metadata & Upload Button */}
          <div className="cinematic-card p-6 rounded-2xl border border-[#00E5FF]/20 bg-[#0D1424]/90 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono font-bold uppercase text-[#94A3B8] mb-1.5">
                  Facility Location
                </label>
                <input
                  type="text"
                  value={uploadSiteLocation}
                  onChange={(e) => setUploadSiteLocation(e.target.value)}
                  placeholder="e.g. Offshore Rig Alpha"
                  className="w-full dark-input px-3.5 py-2.5 text-xs text-[#F4F7FB]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono font-bold uppercase text-[#94A3B8] mb-1.5">
                  Department / Unit
                </label>
                <input
                  type="text"
                  value={uploadDepartment}
                  onChange={(e) => setUploadDepartment(e.target.value)}
                  placeholder="e.g. Drilling & Operations"
                  className="w-full dark-input px-3.5 py-2.5 text-xs text-[#F4F7FB]"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={!selectedFile || analyzing}
                className="w-full sm:w-auto btn-cinematic-cyan light-sweep-btn flex items-center justify-center gap-2.5 px-8 py-3.5 text-sm cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {analyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#070B14]" />
                    <span>Parsing Document &amp; Analyzing SIF Precursors...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-[#070B14]" />
                    <span>Upload &amp; Analyze Document</span>
                    <ArrowRight className="w-4 h-4 text-[#070B14]" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}

    </div>
  );
}
