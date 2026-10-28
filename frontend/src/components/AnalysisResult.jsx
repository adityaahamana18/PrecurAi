import React, { useState } from 'react';
import { AlertOctagon, AlertTriangle, ShieldCheck, BookOpen, UserCheck, ArrowLeft, Info, CheckCircle2, AlertCircle, FileText, Send, LayoutDashboard, FileCheck } from 'lucide-react';
import EvidenceHighlighter from './EvidenceHighlighter';

export default function AnalysisResult({ resultData, requestMetadata, onBackToAnalyze, onNavigateToDashboard }) {
  if (!resultData) return null;

  const {
    sif_potential = 'LOW',
    confidence = 0.50,
    hazard = 'Unspecified',
    activity = 'Operations',
    unsafe_condition = 'Unspecified',
    potential_consequence = 'None',
    actual_outcome = 'No injury reported',
    life_saving_rule = 'No direct Life-Saving Rule match',
    reason = '',
    reference = '',
    evidence = [],
    contributing_features = [],
    explanation = '',
    recommended_action = 'Routine follow-up'
  } = resultData;

  const sourceDoc = resultData?.source_document || requestMetadata?.sourceDocument;

  const [reviewerName, setReviewerName] = useState("Lead HSE Supervisor");
  const [actionTaken, setActionTaken] = useState("APPROVED_AI");
  const [overrideSif, setOverrideSif] = useState(sif_potential);
  const [reviewNotes, setReviewNotes] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const handleSubmitSignOff = (e) => {
    e.preventDefault();
    setReviewSubmitted(true);
  };

  const formattedConfidence = Math.round(confidence * 100);

  const highlightsForText = (evidence || []).map((ev) => ({
    keyword: ev,
    start: 0,
    end: 0,
    category: "Evidence Feature"
  }));

  const reportTextToHighlight = requestMetadata?.reportText || resultData?.full_text || "";

  return (
    <div className="max-w-4xl mx-auto space-y-5 animate-fade-in">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToDashboard}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 px-3 py-2 rounded-lg transition shadow-xs"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </button>

          <button
            onClick={onBackToAnalyze}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Analyze Another Report</span>
          </button>
        </div>

        <span className="text-xs text-slate-500 font-mono font-semibold">
          {requestMetadata?.siteLocation || "Field Observation"}
        </span>
      </div>

      {/* Mandatory Advisory Disclaimer Banner */}
      <div className="bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/60 p-3 rounded-lg flex items-center gap-2.5 text-amber-900 dark:text-amber-300 text-xs font-semibold">
        <AlertCircle className="w-4.5 h-4.5 text-amber-600 dark:text-amber-400 shrink-0" />
        <span>
          AI-generated decision support. Final safety assessment remains with qualified HSE personnel.
        </span>
      </div>

      {/* SIF Rating Banner */}
      <div
        className={`p-5 rounded-xl border shadow-xs flex flex-col gap-4 ${
          sif_potential === 'HIGH'
            ? 'bg-red-50/50 dark:bg-red-950/30 border-red-200 dark:border-red-900/60'
            : sif_potential === 'MEDIUM'
            ? 'bg-amber-50/50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/60'
            : 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/60'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-3.5">
            {sif_potential === 'HIGH' && (
              <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900 flex items-center justify-center shrink-0">
                <AlertOctagon className="w-7 h-7" />
              </div>
            )}
            {sif_potential === 'MEDIUM' && (
              <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-7 h-7" />
              </div>
            )}
            {sif_potential === 'LOW' && (
              <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-7 h-7" />
              </div>
            )}

            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-0.5">
                SIF PRECURSOR RATING
              </span>
              <span
                className={`text-xl font-bold uppercase tracking-tight px-3 py-1 rounded-md border inline-block ${
                  sif_potential === 'HIGH'
                    ? 'bg-red-600 text-white border-red-700'
                    : sif_potential === 'MEDIUM'
                    ? 'bg-amber-600 text-white border-amber-700'
                    : 'bg-emerald-600 text-white border-emerald-700'
                }`}
              >
                {sif_potential} SIF POTENTIAL
              </span>
            </div>
          </div>

          {/* Model Confidence Box */}
          <div className="bg-white dark:bg-slate-900 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 shrink-0 min-w-[210px] shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400 font-semibold">Model Confidence:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{formattedConfidence} / 100</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-sky-700 dark:bg-sky-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${formattedConfidence}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Small Explanation */}
        <div className="border-t border-slate-200/70 dark:border-slate-800/80 pt-2.5 flex items-start gap-2 text-[11px] text-slate-600 dark:text-slate-400">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
          <span>
            Model confidence reflects the classifier's probability for the selected SIF-potential class. It is not a measure of injury probability.
          </span>
        </div>
      </div>

      {/* SOURCE DOCUMENT & TRACEABILITY CARD */}
      {sourceDoc && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-3 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-sky-700 dark:text-sky-400" />
              Source Document & Traceability
            </h3>
            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
              Verified File Input
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Filename</span>
              <p className="font-bold text-slate-900 dark:text-slate-100 truncate mt-0.5">{sourceDoc.filename}</p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Format & Size</span>
              <p className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 mt-0.5">
                <span className="bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[10px] px-1.5 py-0.5 rounded font-mono uppercase">
                  {sourceDoc.file_type}
                </span>
                <span>{(sourceDoc.file_size_bytes / 1024).toFixed(1)} KB</span>
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Page Count</span>
              <p className="font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                {sourceDoc.total_pages || 1} {sourceDoc.total_pages === 1 ? 'Page' : 'Pages'}
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Evidence Page Attribution</span>
              <p className="font-bold text-amber-700 dark:text-amber-400 mt-0.5">
                {sourceDoc.evidence_pages && sourceDoc.evidence_pages.length > 0
                  ? `Page(s) ${sourceDoc.evidence_pages.join(', ')}`
                  : 'Document-wide'}
              </p>
            </div>
          </div>

          {sourceDoc.is_scanned && (
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 p-2.5 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{sourceDoc.scan_warning || "Scanned image detected. Fallback text extraction was used."}</span>
            </div>
          )}
        </div>
      )}

      {/* Core Attributes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Hazard */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-0.5 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Detected Hazard</span>
          <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{hazard}</p>
        </div>

        {/* Activity */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-0.5 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Activity Context</span>
          <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{activity}</p>
        </div>

        {/* Unsafe Condition / Act */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-0.5 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Unsafe Condition / Act</span>
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
            {resultData.unsafe_condition || resultData.unsafe_act || unsafe_condition || unsafe_act || 'Unspecified'}
          </p>
        </div>

        {/* Life-Saving Rule */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-0.5 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Life-Saving Rule</span>
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{life_saving_rule}</p>
          </div>
        </div>

        {/* Potential Consequence */}
        <div className="bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/50 p-4 rounded-xl space-y-0.5 shadow-xs">
          <span className="text-[10px] font-bold text-red-700 dark:text-red-400 uppercase tracking-wider block">Potential Consequence (If Uncontrolled)</span>
          <p className="text-xs font-bold text-red-900 dark:text-red-200">{potential_consequence}</p>
        </div>

        {/* Actual Outcome */}
        <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/50 p-4 rounded-xl space-y-0.5 shadow-xs">
          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">Actual Field Outcome</span>
          <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200">{actual_outcome}</p>
        </div>
      </div>

      {/* WHY THIS RESULT? Explainability & Text Highlights */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4.5 rounded-xl space-y-3 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
            <Info className="w-4 h-4 text-sky-700 dark:text-sky-400" />
            Extracted Evidence & Text Highlights
          </h3>
          <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
            Explainable XAI
          </span>
        </div>

        {/* Key Extracted Evidence Phrases */}
        {evidence && evidence.length > 0 && (
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">Extracted Key Phrases:</span>
            <div className="flex flex-wrap gap-1.5">
              {evidence.map((ev, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60 text-xs font-mono font-bold">
                  "{ev}"
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Original Report with Text Highlights */}
        {reportTextToHighlight && (
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">Document Text Evidence Spans:</span>
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 leading-relaxed text-xs max-h-48 overflow-y-auto font-sans">
              <EvidenceHighlighter text={reportTextToHighlight} highlights={highlightsForText} />
            </div>
          </div>
        )}

        {explanation && (
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
            <strong>Model Explanation:</strong> {explanation}
          </p>
        )}
      </div>

      {/* RECOMMENDED HSE ACTION & Human Sign-Off */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4.5 rounded-xl space-y-3 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-sky-700 dark:text-sky-400" />
            Recommended HSE Action (Decision Support)
          </h3>
          <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-900/50">
            Human-in-the-Loop
          </span>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 font-bold leading-relaxed">
          {recommended_action}
        </div>

        {/* HSE Officer Sign-Off Form */}
        <form onSubmit={handleSubmitSignOff} className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-3">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">HSE Professional Verification & Sign-Off</span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1">HSE Officer Name</label>
              <input
                type="text"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1">Action Decision</label>
              <select
                value={actionTaken}
                onChange={(e) => setActionTaken(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
              >
                <option value="APPROVED_AI">Approve SIF Potential Classification</option>
                <option value="OVERRIDDEN">Override SIF Potential</option>
                <option value="ESCALATED">Escalate to Duty Manager</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1">HSE Directives & Action Notes</label>
            <textarea
              rows={2}
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder="Add HSE field directives, barrier verification notes, or corrective actions..."
              className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="submit"
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 transition shadow-xs"
            >
              {reviewSubmitted ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>HSE Sign-Off Recorded</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit HSE Sign-Off</span>
                </>
              )}
            </button>

            {reviewSubmitted && (
              <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Human decision recorded in audit log
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
