import React, { useState } from 'react';
import { Search, AlertOctagon, AlertTriangle, ShieldCheck, CheckCircle2, FileText, Sparkles, BookOpen, UserCheck, Send, Info } from 'lucide-react';
import EvidenceHighlighter from './EvidenceHighlighter';

const INDUSTRY_SAMPLE_SCENARIOS = [
  {
    label: "Rigging Under Suspended Load",
    title: "Rigger standing under 12-ton crane load",
    location: "FPSO Deck B (Offshore)",
    department: "Rigging & Lifting Operations",
    text: "During crane lifting operations on FPSO Deck B, a rigger stood directly under a 12-ton pipe load being hoisted to the upper module. The tag line was loose and no exclusion zone barrier was placed."
  },
  {
    label: "LOTO Energy Isolation Breach",
    title: "Unisolated high pressure hydrocarbon valve",
    location: "Gas Processing Plant - Unit 3",
    department: "Maintenance & Piping",
    text: "Technician opened high pressure hydrocarbon line valve V-104 before LOTO energy isolation was verified by permit issuer. Residual pressure gauge was showing 140 PSI."
  },
  {
    label: "Scaffolding Fall Hazard",
    title: "Working at 6m height without harness tie-off",
    location: "Refinery Distillation Unit",
    department: "Scaffolding Dept",
    text: "Scaffolder working at 6m height on platform piping rack without harness tie-off lanyard attached to anchor point. Guardrail was partially unbolted."
  },
  {
    label: "Confined Space Gas Test Omission",
    title: "Storage tank entry without gas test",
    location: "Terminal Tank Farm",
    department: "Tank Maintenance",
    text: "Contractor entered crude oil storage tank T-201 sump for manual sludge inspection before atmospheric gas test for H2S and oxygen deficiency was conducted."
  },
  {
    label: "Low Risk Housekeeping",
    title: "Cardboard boxes cluttering corridor",
    location: "Workshop Substation Corridor",
    department: "Housekeeping",
    text: "Empty cardboard trash boxes left stacked near workshop entrance door causing minor clutter."
  }
];

export default function Analyzer({ onReportSaved }) {
  const [reportText, setReportText] = useState(INDUSTRY_SAMPLE_SCENARIOS[0].text);
  const [title, setTitle] = useState(INDUSTRY_SAMPLE_SCENARIOS[0].title);
  const [location, setLocation] = useState(INDUSTRY_SAMPLE_SCENARIOS[0].location);
  const [department, setDepartment] = useState(INDUSTRY_SAMPLE_SCENARIOS[0].department);
  const [reporterRole, setReporterRole] = useState("Field Safety Inspector");

  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Human-in-the-Loop Review state
  const [reviewerName, setReviewerName] = useState("HSE Duty Supervisor");
  const [actionTaken, setActionTaken] = useState("APPROVED_AI");
  const [overrideSif, setOverrideSif] = useState("");
  const [reviewNotes, setReviewNotes] = useState("");
  const [actionItem, setActionItem] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const loadScenario = (scenario) => {
    setReportText(scenario.text);
    setTitle(scenario.title);
    setLocation(scenario.location);
    setDepartment(scenario.department);
    setAnalysisResult(null);
    setSaveSuccess(false);
    setReviewSubmitted(false);
  };

  const handleAnalyze = async () => {
    if (!reportText.trim()) {
      setError("Please enter or select a safety report description.");
      return;
    }

    setAnalyzing(true);
    setError(null);
    setSaveSuccess(false);
    setReviewSubmitted(false);

    try {
      const res = await fetch('/api/reports/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: reportText,
          title,
          location,
          unit_department: department,
          reporter_role: reporterRole
        })
      });

      if (!res.ok) {
        throw new Error('Analysis request failed');
      }

      const data = await res.json();
      setAnalysisResult(data);
      setOverrideSif(data.sif_potential);
    } catch (err) {
      setError(err.message || "Failed to analyze report");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSaveToRegistry = async () => {
    if (!reportText.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: reportText,
          title,
          location,
          unit_department: department,
          reporter_role: reporterRole
        })
      });

      if (!res.ok) throw new Error('Save failed');

      const savedReport = await res.json();
      setAnalysisResult(savedReport);
      setSaveSuccess(true);
      if (onReportSaved) onReportSaved(savedReport);
    } catch (err) {
      setError("Failed to save report to safety registry");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!analysisResult || !analysisResult.id) {
      // If not yet saved in database, save first then review
      await handleSaveToRegistry();
    }

    if (!analysisResult?.id) return;

    setReviewSubmitting(true);
    try {
      const res = await fetch(`/api/reports/${analysisResult.id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewer_name: reviewerName,
          reviewer_role: "HSE Specialist",
          action_taken: actionTaken,
          override_sif_level: actionTaken === "OVERRIDDEN" ? overrideSif : null,
          review_notes: reviewNotes,
          action_item: actionItem
        })
      });

      if (!res.ok) throw new Error('Failed to submit review');

      const updated = await res.json();
      setAnalysisResult(updated);
      setReviewSubmitted(true);
      if (onReportSaved) onReportSaved(updated);
    } catch (err) {
      setError("Failed to log HSE review decision");
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-slate-800/60 border border-slate-700/60 p-5 rounded-2xl">
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-sky-400" />
          Real-Time SIF Precursor Intelligence Analyzer
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Input an unstructured safety observation, near-miss, or incident description to extract structured precursor intelligence.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Report Input Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-800/70 border border-slate-700/60 p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-400" />
                Safety Report Input
              </h3>
              <span className="text-xs text-slate-400">{reportText.length} chars</span>
            </div>

            {/* Industry Sample Preset Buttons */}
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Load Sample Field Scenario:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {INDUSTRY_SAMPLE_SCENARIOS.map((sc, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => loadScenario(sc)}
                    className="text-xs bg-slate-900/80 hover:bg-sky-600/20 text-slate-300 hover:text-sky-300 border border-slate-700 hover:border-sky-500/50 px-2.5 py-1 rounded-lg transition text-left"
                  >
                    {sc.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Title & Metadata fields */}
            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Observation Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700 focus:border-sky-500 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition"
                  placeholder="Title of safety report..."
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Field Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-slate-900/90 border border-slate-700 focus:border-sky-500 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Unit / Dept</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-900/90 border border-slate-700 focus:border-sky-500 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Unstructured Report Text</label>
                <textarea
                  rows={6}
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  placeholder="Describe the unsafe act, condition, or near-miss observation in detail..."
                  className="w-full bg-slate-900/90 border border-slate-700 focus:border-sky-500 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition leading-relaxed"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-3 rounded-xl text-xs">
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleAnalyze}
                disabled={analyzing || !reportText.trim()}
                className="flex-1 bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 disabled:opacity-50 text-white font-semibold py-2.5 px-4 rounded-xl text-sm shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 transition"
              >
                {analyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Extracting Precursors...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Analyze SIF Intelligence</span>
                  </>
                )}
              </button>

              <button
                onClick={handleSaveToRegistry}
                disabled={saving || !reportText.trim()}
                className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-slate-200 font-medium py-2.5 px-4 rounded-xl text-sm flex items-center gap-1.5 transition"
              >
                {saveSuccess ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>{saveSuccess ? "Saved" : "Save"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Structured MVP Intelligence Output */}
        <div className="lg:col-span-7 space-y-4">
          {!analysisResult ? (
            <div className="bg-slate-800/40 border border-dashed border-slate-700/80 p-12 rounded-2xl text-center flex flex-col items-center justify-center min-h-[420px]">
              <div className="w-14 h-14 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-4">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-200">No Intelligence Generated Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mt-1">
                Enter a report or select a sample scenario on the left, then click <strong>"Analyze SIF Intelligence"</strong> to generate precursor results.
              </p>
            </div>
          ) : (
            <div className="bg-slate-800/80 border border-slate-700/60 p-6 rounded-2xl space-y-6 shadow-xl">
              {/* Top Banner: 1. SIF Potential & 2. Confidence Score */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/90 border border-slate-700/80">
                <div className="flex items-center gap-3">
                  {analysisResult.sif_potential === 'HIGH' && (
                    <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center shrink-0">
                      <AlertOctagon className="w-7 h-7" />
                    </div>
                  )}
                  {analysisResult.sif_potential === 'MEDIUM' && (
                    <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-7 h-7" />
                    </div>
                  )}
                  {analysisResult.sif_potential === 'LOW' && (
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-7 h-7" />
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">SIF Potential:</span>
                      <span
                        className={`text-xs font-black uppercase px-2.5 py-0.5 rounded border ${
                          analysisResult.sif_potential === 'HIGH'
                            ? 'bg-red-500/20 text-red-300 border-red-500/40'
                            : analysisResult.sif_potential === 'MEDIUM'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        }`}
                      >
                        {analysisResult.sif_potential} SIF POTENTIAL
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {analysisResult.sif_potential === 'HIGH'
                        ? 'High-energy hazard indicator detected with severe injury/fatality potential.'
                        : analysisResult.sif_potential === 'MEDIUM'
                        ? 'Moderate hazard identified. Requires field control verification.'
                        : 'Routine minor hazard or housekeeping issue.'}
                    </p>
                  </div>
                </div>

                {/* Confidence Score Bar */}
                <div className="bg-slate-800 p-3 rounded-lg border border-slate-700/60 shrink-0 min-w-[140px]">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400 font-medium">Confidence:</span>
                    <span className="font-bold text-sky-400">{Math.round(analysisResult.confidence_score * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-sky-400 h-full transition-all duration-500 rounded-full"
                      style={{ width: `${analysisResult.confidence_score * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Grid of MVP Requirements (3. Hazard, 4. Activity, 5. Unsafe Category, 6. Consequence, 7. Life-Saving Rule) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 3. Detected Hazard */}
                <div className="bg-slate-900/60 border border-slate-700/50 p-3.5 rounded-xl space-y-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">3. Detected Hazard</span>
                  <p className="text-sm font-bold text-slate-200">{analysisResult.detected_hazard}</p>
                </div>

                {/* 4. Activity */}
                <div className="bg-slate-900/60 border border-slate-700/50 p-3.5 rounded-xl space-y-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">4. Activity Context</span>
                  <p className="text-sm font-bold text-slate-200">{analysisResult.activity}</p>
                </div>

                {/* 5. Unsafe Act / Condition */}
                <div className="bg-slate-900/60 border border-slate-700/50 p-3.5 rounded-xl space-y-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">5. Category</span>
                  <div>
                    <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded bg-slate-800 text-sky-300 border border-slate-700">
                      {analysisResult.unsafe_category}
                    </span>
                  </div>
                </div>

                {/* 7. Life-Saving Rule */}
                <div className="bg-slate-900/60 border border-slate-700/50 p-3.5 rounded-xl space-y-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">7. Life-Saving Rule</span>
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                    <p className="text-sm font-bold text-amber-300">{analysisResult.life_saving_rule}</p>
                  </div>
                </div>

                {/* 6. Potential Consequence (Full Width) */}
                <div className="md:col-span-2 bg-slate-900/60 border border-slate-700/50 p-3.5 rounded-xl space-y-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">6. Potential Consequence</span>
                  <p className="text-sm text-slate-300 font-medium">{analysisResult.potential_consequence}</p>
                </div>
              </div>

              {/* 8. Explanation with Text Evidence Highlights */}
              <div className="bg-slate-900/80 border border-slate-700/70 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <Info className="w-4 h-4 text-sky-400" />
                    8. Explainable Evidence & Spans
                  </h4>
                  <span className="text-[11px] text-slate-400">Exact report text highlights</span>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <EvidenceHighlighter text={reportText} highlights={analysisResult.evidence_highlights} />
                </div>

                <p className="text-xs text-slate-400 leading-relaxed font-sans border-t border-slate-800/80 pt-2">
                  <strong>AI Explanation:</strong> {analysisResult.explanation}
                </p>
              </div>

              {/* 9. Recommended HSE Action & Human-in-the-Loop Sign-Off */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-900/90 border border-sky-500/30 p-5 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-sky-300 uppercase tracking-wider flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-sky-400" />
                    9. Recommended HSE Action & Decision Support
                  </h4>
                  <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    Human-in-the-Loop
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
                  {analysisResult.recommended_action}
                </p>

                {/* Interactive Human HSE Sign-Off Form */}
                <div className="border-t border-slate-800 pt-4 space-y-3">
                  <span className="text-xs font-semibold text-slate-300 block">HSE Professional Sign-Off & Override Form</span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">HSE Officer Name</label>
                      <input
                        type="text"
                        value={reviewerName}
                        onChange={(e) => setReviewerName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">HSE Action Decision</label>
                      <select
                        value={actionTaken}
                        onChange={(e) => setActionTaken(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                      >
                        <option value="APPROVED_AI">Approve AI Classification</option>
                        <option value="OVERRIDDEN">Override SIF Potential</option>
                        <option value="ESCALATED">Escalate to Plant Manager</option>
                        <option value="CORRECTIVE_ACTION_ASSIGNED">Assign Corrective Action</option>
                      </select>
                    </div>
                  </div>

                  {actionTaken === "OVERRIDDEN" && (
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Override SIF Severity Level</label>
                      <select
                        value={overrideSif}
                        onChange={(e) => setOverrideSif(e.target.value)}
                        className="w-full bg-slate-950 border border-red-500/50 rounded-lg px-2.5 py-1.5 text-xs text-red-300 focus:outline-none"
                      >
                        <option value="HIGH">HIGH SIF POTENTIAL</option>
                        <option value="MEDIUM">MEDIUM SIF POTENTIAL</option>
                        <option value="LOW">LOW SIF POTENTIAL</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">HSE Professional Review Notes & Directives</label>
                    <textarea
                      rows={2}
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      placeholder="Add official HSE decision notes, field verification comments, or corrective actions..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={handleSubmitReview}
                      disabled={reviewSubmitting}
                      className="bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-medium text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 transition"
                    >
                      {reviewSubmitted ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                          <span>Signed Off & Recorded</span>
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Record Official HSE Decision</span>
                        </>
                      )}
                    </button>

                    {reviewSubmitted && (
                      <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Human decision logged in audit trail
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
