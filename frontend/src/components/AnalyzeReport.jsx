import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, MapPin, Activity, Tag, ArrowRight, X, CheckCircle2, AlertCircle, Search } from 'lucide-react';

const SAMPLE_SCENARIOS = [
  {
    label: "Demo 1: Confined Space Entry",
    type: "Near-Miss",
    site: "Terminal Tank Farm T-201",
    activity: "Vessel Maintenance",
    text: "During maintenance, a worker was preparing to enter a confined space. Required gas testing had not been completed before entry. The supervisor identified the issue and stopped the activity. No injury occurred."
  },
  {
    label: "Demo 2: Suspended Load Operation",
    type: "Unsafe Condition",
    site: "Central Heavy Rigging Yard",
    activity: "Lifting Operations",
    text: "During lifting operations, a suspended load was moved over an area where workers were present. The lifting activity was stopped after the unsafe condition was observed."
  },
  {
    label: "Demo 3: PPE Observation",
    type: "Unsafe Act",
    site: "General Operations Bay B",
    activity: "Routine Operations",
    text: "An employee was observed walking through the workplace without a safety helmet. No hazardous energy or high-consequence exposure was identified."
  },
  {
    label: "Demo 4: Energy Isolation Maintenance",
    type: "Unsafe Condition",
    site: "Gas Processing Unit 3",
    activity: "Pipe & Valve Maintenance",
    text: "Technician opened high pressure hydrocarbon line valve V-104 before LOTO energy isolation was verified. Residual pressure gauge was showing 140 PSI."
  },
  {
    label: "Demo 5: Work at Height",
    type: "Unsafe Act",
    site: "Refinery Distillation Platform B",
    activity: "Working at Height",
    text: "Scaffolder working at 6m height on platform piping rack without harness tie-off lanyard attached to anchor point."
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner with Workflow Switcher */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-sky-700 dark:text-sky-400" />
              Analyze Safety Report
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Submit field observations, near-misses, or unsafe conditions to identify potential SIF precursors and generate explainable HSE insights.
            </p>
          </div>

          {/* Workflow Toggle Tabs */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800 shrink-0">
            <button
              type="button"
              onClick={() => { setActiveTab("upload"); setError(null); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition ${
                activeTab === "upload"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload Document</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab("text"); setError(null); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition ${
                activeTab === "text"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Paste Report Text</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: UPLOAD SAFETY REPORT WORKFLOW (PRIMARY) */}
      {activeTab === "upload" && (
        <form onSubmit={handleFileUploadSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl space-y-5 shadow-xs">
          {/* Drag & Drop File Area */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-center min-h-[190px] transform hover:scale-[1.01] ${
              dragActive
                ? "border-sky-600 bg-sky-50 dark:bg-sky-950/40 animate-pulse"
                : selectedFile
                ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-md"
                : "border-slate-300 dark:border-slate-700 hover:border-sky-500 bg-slate-50/50 dark:bg-slate-950/50"
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
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800 flex items-center justify-center mx-auto">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Drag & drop safety document here, or <span className="text-sky-700 dark:text-sky-400 underline">browse files</span>
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Supports <strong>PDF, DOCX, and TXT</strong> documents up to <strong>10MB</strong>
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{selectedFile.name}</p>
                <div className="flex items-center justify-center gap-2 text-[11px]">
                  <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded font-mono font-bold border border-emerald-200 dark:border-emerald-800">
                    {getFileExt(selectedFile.name)}
                  </span>
                  <span className="text-slate-500">{formatFileSize(selectedFile.size)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Selected File Details */}
          {selectedFile && (
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-800 dark:text-slate-200 shrink-0 font-mono font-bold text-xs">
                  {getFileExt(selectedFile.name)}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block truncate max-w-md">{selectedFile.name}</span>
                  <span className="text-[11px] text-slate-500">{formatFileSize(selectedFile.size)} • Ready for precursor extraction</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="text-slate-400 hover:text-red-600 p-1 rounded transition"
                title="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Optional Metadata Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                Site / Location <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={uploadSiteLocation}
                onChange={(e) => setUploadSiteLocation(e.target.value)}
                placeholder="e.g. FPSO Deck B, Refinery Unit 3"
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-slate-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-slate-500" />
                Unit / Department <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={uploadDepartment}
                onChange={(e) => setUploadDepartment(e.target.value)}
                placeholder="e.g. Lifting Operations, Maintenance"
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-slate-500"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 p-3 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={analyzing || !selectedFile}
            className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold py-2.5 px-5 rounded-lg text-xs shadow-xs flex items-center justify-center gap-2 transition"
          >
            {analyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Extracting Text & Analyzing Precursors...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4" />
                <span>Analyze Uploaded Report</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </form>
      )}

      {/* TAB 2: MANUAL TEXT INPUT WORKFLOW (PRESERVED) */}
      {activeTab === "text" && (
        <div className="space-y-4">
          {/* Preset Scenario Selector */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-2 shadow-xs">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
              Quick-Load Field Scenarios:
            </span>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_SCENARIOS.map((sc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleLoadScenario(sc)}
                  className="text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 px-2.5 py-1.5 rounded-lg transition"
                >
                  {sc.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleTextAnalyze} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl space-y-4 shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-slate-500" />
                  Report Type
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
                >
                  <option value="Auto-detect">Auto-detect Report Type</option>
                  <option value="Unsafe Act">Unsafe Act</option>
                  <option value="Unsafe Condition">Unsafe Condition</option>
                  <option value="Near-Miss">Near-Miss Report</option>
                  <option value="Incident Report">Incident Report</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  Site / Location
                </label>
                <input
                  type="text"
                  value={siteLocation}
                  onChange={(e) => setSiteLocation(e.target.value)}
                  placeholder="e.g. FPSO Deck B, Refinery Unit 3"
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-slate-500" />
                  Activity <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  placeholder="e.g. Vessel Maintenance, Scaffolding"
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  Safety Report Narrative Text
                </label>
                <span className="text-[11px] text-slate-400">{reportText.length} characters</span>
              </div>
              <textarea
                rows={6}
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                placeholder="Describe the safety observation, unsafe act, condition, or near-miss in detail..."
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-xs text-slate-900 dark:text-slate-100 focus:outline-none leading-relaxed font-sans"
              />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 p-3 rounded-lg text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={analyzing || !reportText.trim()}
              className="w-full bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 hover:from-slate-800 hover:to-slate-800 disabled:opacity-50 text-white font-bold py-2.5 px-5 rounded-lg text-xs shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all duration-300 transform active:scale-98"
            >
              {analyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="animate-pulse">Executing SIF Precursor Intelligence Engine...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
                  <span>Analyze SIF Precursor Intelligence</span>
                  <ArrowRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
