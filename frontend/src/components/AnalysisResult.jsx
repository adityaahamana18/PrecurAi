import React, { useState, useEffect } from 'react';
import {
  AlertOctagon, AlertTriangle, ShieldCheck, BookOpen, UserCheck,
  ArrowLeft, Info, CheckCircle2, AlertCircle, FileText, Send,
  LayoutDashboard, FileCheck, Flame, Activity, Target, Zap,
} from 'lucide-react';
import EvidenceHighlighter from './EvidenceHighlighter';

// Animated confidence bar component
function ConfBar({ value }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(value), 400);
    return () => clearTimeout(t);
  }, [value]);

  const color =
    value >= 75 ? '#10b981' :
    value >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden border border-slate-700/50">
      <div
        className="h-full rounded-full transition-all duration-1000 ease-out"
        style={{ width: `${width}%`, background: color, boxShadow: `0 0 8px ${color}80` }}
      />
    </div>
  );
}

// Animated entry wrapper
function Card({ children, className = '', delay = 0 }) {
  return (
    <div
      className={`corp-card rounded-2xl animate-fade-up ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

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
    recommended_action = 'Routine follow-up',
  } = resultData;

  const sourceDoc = resultData?.source_document || requestMetadata?.sourceDocument;
  const [reviewerName, setReviewerName] = useState('Lead HSE Supervisor');
  const [actionTaken, setActionTaken] = useState('APPROVED_AI');
  const [overrideSif, setOverrideSif] = useState(sif_potential);
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const handleSubmitSignOff = (e) => {
    e.preventDefault();
    setReviewSubmitted(true);
  };

  const pct = Math.round(confidence * 100);

  const sifConfig = {
    HIGH:   { icon: AlertOctagon,  color: 'text-red-400',     bg: 'bg-red-950/30',    border: 'border-red-800/50',    badge: 'bg-red-950/60 text-red-300 border-red-800/60',    label: 'High SIF Potential' },
    MEDIUM: { icon: AlertTriangle, color: 'text-amber-400',   bg: 'bg-amber-950/30',  border: 'border-amber-800/50',  badge: 'bg-amber-950/60 text-amber-300 border-amber-800/60', label: 'Medium SIF Potential' },
    LOW:    { icon: ShieldCheck,   color: 'text-emerald-400', bg: 'bg-emerald-950/30', border: 'border-emerald-800/50', badge: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60', label: 'Low SIF Potential' },
  };
  const cfg = sifConfig[sif_potential] ?? sifConfig.LOW;
  const SifIcon = cfg.icon;

  const highlightsForText = (evidence || []).map((ev) => ({ keyword: ev, start: 0, end: 0, category: 'Evidence Feature' }));
  const reportTextToHighlight = requestMetadata?.reportText || resultData?.full_text || '';

  return (
    <div className="max-w-4xl mx-auto space-y-4 animate-fade-in">

      {/* ── Top action bar ── */}
      <div className="flex items-center justify-between animate-fade-up">
        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToDashboard}
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-white bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg border border-slate-700 transition-all hover:border-slate-600 active:scale-95"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Dashboard
          </button>
          <button
            onClick={onBackToAnalyze}
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-700/80 px-3 py-2 rounded-lg border border-slate-700/60 transition-all active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Analyze Another
          </button>
        </div>
        <span className="text-[10px] text-slate-500 font-mono font-medium bg-slate-800/50 border border-slate-700/50 px-2.5 py-1 rounded">
          {requestMetadata?.siteLocation || 'Field Observation'}
        </span>
      </div>

      {/* ── Advisory disclaimer ── */}
      <div className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-950/25 border border-amber-800/40 text-amber-300 text-[11px] font-medium animate-fade-up" style={{ animationDelay: '60ms' }}>
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
        AI-generated decision support. Final safety assessment remains with qualified HSE personnel.
      </div>

      {/* ── SIF Rating banner ── */}
      <Card className={`p-5 ${cfg.bg} ${cfg.border} border scan-overlay`} delay={100}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            {/* Risk icon */}
            <div className={`w-14 h-14 rounded-2xl ${cfg.bg} border ${cfg.border} flex items-center justify-center shrink-0 ${sif_potential === 'HIGH' ? 'animate-hazard' : ''}`}>
              <SifIcon className={`w-7 h-7 ${cfg.color}`} />
            </div>
            <div>
              <span className="label-xs block mb-1.5">SIF PRECURSOR RATING</span>
              <span className={`text-lg font-black uppercase tracking-tight px-3 py-1.5 rounded-xl border inline-flex items-center gap-2 ${cfg.badge}`}>
                <span className={`w-2 h-2 rounded-full ${sif_potential === 'HIGH' ? 'bg-red-400' : sif_potential === 'MEDIUM' ? 'bg-amber-400' : 'bg-emerald-400'} animate-pulse`} />
                {cfg.label}
              </span>
            </div>
          </div>

          {/* Confidence box */}
          <div className="bg-slate-900/60 border border-slate-700/60 p-4 rounded-xl min-w-[200px] space-y-3">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-semibold">Model Confidence</span>
              <span className="font-black text-white font-mono">{pct}<span className="text-slate-500">/100</span></span>
            </div>
            <ConfBar value={pct} />
            <div className="flex items-start gap-1.5 text-[10px] text-slate-500">
              <Info className="w-3 h-3 shrink-0 mt-0.5" />
              Classifier probability — not injury probability
            </div>
          </div>
        </div>
      </Card>

      {/* ── Source document ── */}
      {sourceDoc && (
        <Card className="p-4" delay={140}>
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-3 mb-3">
            <h3 className="text-[11px] font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-sky-400" />
              Source Document &amp; Traceability
            </h3>
            <span className="badge-info text-[10px] font-bold px-2 py-0.5 rounded">Verified File Input</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[11px]">
            {[
              { label: 'Filename', val: sourceDoc.filename },
              { label: 'Format & Size', val: `${sourceDoc.file_type?.toUpperCase()} · ${(sourceDoc.file_size_bytes / 1024).toFixed(1)} KB` },
              { label: 'Pages', val: `${sourceDoc.total_pages || 1} page${sourceDoc.total_pages !== 1 ? 's' : ''}` },
              { label: 'Evidence Pages', val: sourceDoc.evidence_pages?.length > 0 ? `Page ${sourceDoc.evidence_pages.join(', ')}` : 'Document-wide' },
            ].map(({ label, val }) => (
              <div key={label} className="bg-slate-900/50 border border-slate-800/60 p-2.5 rounded-lg">
                <span className="label-xs block mb-1">{label}</span>
                <p className="font-bold text-slate-100 truncate">{val}</p>
              </div>
            ))}
          </div>
          {sourceDoc.is_scanned && (
            <div className="mt-3 flex items-center gap-2 p-2.5 rounded-lg bg-amber-950/30 border border-amber-800/40 text-amber-300 text-[11px]">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {sourceDoc.scan_warning || 'Scanned image detected. Fallback text extraction was used.'}
            </div>
          )}
        </Card>
      )}

      {/* ── Attribute grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger-children">
        {[
          { label: 'Detected Hazard',      val: hazard,          icon: Flame,    color: 'text-orange-400' },
          { label: 'Activity Context',      val: activity,        icon: Activity, color: 'text-sky-400' },
          { label: 'Unsafe Condition / Act', val: resultData.unsafe_condition || resultData.unsafe_act || unsafe_condition || 'Unspecified', icon: AlertTriangle, color: 'text-amber-400' },
          { label: 'Life-Saving Rule',      val: life_saving_rule, icon: BookOpen, color: 'text-violet-400' },
        ].map(({ label, val, icon: Icon, color }) => (
          <div key={label} className="corp-card p-4 rounded-2xl">
            <span className="label-xs block mb-2">{label}</span>
            <div className="flex items-start gap-2">
              <Icon className={`w-4 h-4 ${color} shrink-0 mt-0.5`} />
              <p className="text-[12px] font-semibold text-slate-100 leading-relaxed">{val}</p>
            </div>
          </div>
        ))}

        <div className="corp-card p-4 rounded-2xl border-red-900/40">
          <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block mb-2">Potential Consequence (If Uncontrolled)</span>
          <div className="flex items-start gap-2">
            <Target className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <p className="text-[12px] font-semibold text-red-200 leading-relaxed">{potential_consequence}</p>
          </div>
        </div>

        <div className="corp-card p-4 rounded-2xl border-emerald-900/40">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-2">Actual Field Outcome</span>
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-[12px] font-semibold text-emerald-200 leading-relaxed">{actual_outcome}</p>
          </div>
        </div>
      </div>

      {/* ── Evidence & XAI ── */}
      <Card className="p-5" delay={240}>
        <div className="flex items-center justify-between border-b border-slate-800/60 pb-3 mb-4">
          <h3 className="text-[11px] font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-sky-400" />
            Extracted Evidence &amp; Text Highlights
          </h3>
          <span className="badge-info text-[10px] font-bold px-2 py-0.5 rounded">Explainable XAI</span>
        </div>

        {evidence && evidence.length > 0 && (
          <div className="mb-4">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Extracted Key Phrases</span>
            <div className="flex flex-wrap gap-1.5">
              {evidence.map((ev, i) => (
                <span key={i} className="px-2 py-1 rounded-lg bg-amber-950/40 text-amber-300 border border-amber-800/50 text-[11px] font-mono font-bold">
                  "{ev}"
                </span>
              ))}
            </div>
          </div>
        )}

        {reportTextToHighlight && (
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Document Text Evidence Spans</span>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/60 leading-relaxed text-[11px] max-h-48 overflow-y-auto">
              <EvidenceHighlighter text={reportTextToHighlight} highlights={highlightsForText} />
            </div>
          </div>
        )}

        {explanation && (
          <p className="mt-3 text-[11px] text-slate-300 leading-relaxed bg-slate-900/40 p-3 rounded-xl border border-slate-800/60">
            <strong className="text-sky-400">Model Explanation: </strong>{explanation}
          </p>
        )}
      </Card>

      {/* ── HSE Action + Sign-Off ── */}
      <Card className="p-5" delay={300}>
        <div className="flex items-center justify-between border-b border-slate-800/60 pb-3 mb-4">
          <h3 className="text-[11px] font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-sky-400" />
            Recommended HSE Action
          </h3>
          <span className="text-[10px] font-bold text-amber-300 bg-amber-950/40 border border-amber-800/50 px-2 py-0.5 rounded">
            Human-in-the-Loop
          </span>
        </div>

        <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800/60 text-[12px] font-semibold text-slate-100 leading-relaxed mb-4">
          {recommended_action}
        </div>

        <form onSubmit={handleSubmitSignOff} className="border-t border-slate-800/60 pt-4 space-y-3">
          <span className="text-[11px] font-bold text-slate-200 block">HSE Professional Verification &amp; Sign-Off</span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block mb-1.5">HSE Officer Name</label>
              <input
                type="text"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                className="dark-input w-full px-3 py-2 text-[11px]"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block mb-1.5">Action Decision</label>
              <select
                value={actionTaken}
                onChange={(e) => setActionTaken(e.target.value)}
                className="dark-input w-full px-3 py-2 text-[11px]"
              >
                <option value="APPROVED_AI">Approve SIF Potential Classification</option>
                <option value="OVERRIDDEN">Override SIF Potential</option>
                <option value="ESCALATED">Escalate to Duty Manager</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block mb-1.5">HSE Directives &amp; Action Notes</label>
            <textarea
              rows={2}
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder="Add HSE field directives, barrier verification notes, or corrective actions..."
              className="dark-input w-full px-3 py-2 text-[11px] resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="submit"
              className={`inline-flex items-center gap-2 font-bold text-[11px] px-4 py-2.5 rounded-xl transition-all duration-200 active:scale-95 ${
                reviewSubmitted
                  ? 'bg-emerald-900/60 border border-emerald-700/60 text-emerald-300'
                  : 'bg-sky-600 hover:bg-sky-500 text-white shadow-md hover:shadow-sky-900/40'
              }`}
            >
              {reviewSubmitted ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  HSE Sign-Off Recorded
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Submit HSE Sign-Off
                </>
              )}
            </button>

            {reviewSubmitted && (
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 animate-fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Human decision recorded in audit log
              </span>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
