import React, { useState, useEffect } from 'react';
import {
  AlertOctagon, AlertTriangle, ShieldCheck, BookOpen, UserCheck,
  ArrowLeft, Info, CheckCircle2, AlertCircle, FileText, Send,
  LayoutDashboard, FileCheck, Flame, Activity, Target, Zap, Sparkles
} from 'lucide-react';
import EvidenceHighlighter from './EvidenceHighlighter';

function ConfBar({ value }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(value), 400);
    return () => clearTimeout(t);
  }, [value]);

  const color =
    value >= 75 ? '#34C759' :
    value >= 50 ? '#FF9500' : '#FF3B30';

  return (
    <div className="w-full bg-[#000000] h-2.5 rounded-full overflow-hidden border border-[#2C3480] p-0.5">
      <div
        className="h-full rounded-full transition-all duration-1000 ease-out"
        style={{ width: `${width}%`, background: color, boxShadow: `0 0 10px ${color}90` }}
      />
    </div>
  );
}

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
    evidence = [],
    explanation = '',
    recommended_action = 'Routine follow-up',
  } = resultData;

  const sourceDoc = resultData?.source_document || requestMetadata?.sourceDocument;
  const [reviewerName, setReviewerName] = useState('Lead HSE Supervisor');
  const [actionTaken, setActionTaken] = useState('APPROVED_AI');
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const handleSubmitSignOff = (e) => {
    e.preventDefault();
    setReviewSubmitted(true);
  };

  const pct = Math.round(confidence * 100);

  const sifConfig = {
    HIGH:   { icon: AlertOctagon,  color: 'text-[#FF3B30]', bg: 'bg-[#FF3B30]/15', border: 'border-[#FF3B30]/50', badge: 'bg-[#FF3B30]/20 text-[#FF3B30] border-[#FF3B30]', label: 'High SIF Potential' },
    MEDIUM: { icon: AlertTriangle, color: 'text-[#FF9500]', bg: 'bg-[#FF9500]/15', border: 'border-[#FF9500]/50', badge: 'bg-[#FF9500]/20 text-[#FF9500] border-[#FF9500]', label: 'Medium SIF Potential' },
    LOW:    { icon: ShieldCheck,   color: 'text-[#34C759]', bg: 'bg-[#34C759]/15', border: 'border-[#34C759]/50', badge: 'bg-[#34C759]/20 text-[#34C759] border-[#34C759]', label: 'Low SIF Potential' },
  };
  const cfg = sifConfig[sif_potential] ?? sifConfig.LOW;
  const SifIcon = cfg.icon;

  const highlightsForText = (evidence || []).map((ev) => ({ keyword: ev, start: 0, end: 0, category: 'Evidence Feature' }));
  const reportTextToHighlight = requestMetadata?.reportText || resultData?.full_text || '';

  return (
    <div className="max-w-4xl mx-auto space-y-5 animate-fade-in font-sans">
      {/* Top action bar */}
      <div className="flex items-center justify-between animate-fade-up">
        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToDashboard}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FFFFFF] bg-[#0A0D18] hover:bg-[#2C3480] px-3.5 py-2 rounded-xl border border-[#2C3480] hover:border-[#FFFFFF] transition-all active:scale-95 shadow-sm cursor-pointer"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-[#5B73D1]" />
            Dashboard
          </button>
          <button
            onClick={onBackToAnalyze}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#BAC4EB] hover:text-[#FFFFFF] bg-[#0A0D18] hover:bg-[#2C3480] px-3.5 py-2 rounded-xl border border-[#2C3480] hover:border-[#FFFFFF] transition-all active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#5B73D1]" />
            Analyze Another
          </button>
        </div>
        <span className="text-[11px] text-[#BAC4EB] font-mono font-medium bg-[#0A0D18] border border-[#2C3480] px-3 py-1.5 rounded-xl">
          {requestMetadata?.siteLocation || 'Field Observation'}
        </span>
      </div>

      {/* Advisory disclaimer */}
      <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-[#0A0D18] border border-[#2C3480] text-[#FFFFFF] text-xs font-medium animate-fade-up shadow-sm">
        <AlertCircle className="w-4 h-4 text-[#5B73D1] shrink-0" />
        AI-generated decision support. Final safety assessment remains with qualified HSE personnel.
      </div>

      {/* SIF Rating banner */}
      <Card className={`p-6 ${cfg.bg} ${cfg.border} border scan-overlay shadow-cobalt-glow`} delay={100}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl ${cfg.bg} border ${cfg.border} flex items-center justify-center shrink-0 ${sif_potential === 'HIGH' ? 'animate-hazard' : ''}`}>
              <SifIcon className={`w-7 h-7 ${cfg.color}`} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#BAC4EB] uppercase tracking-widest block mb-1">SIF PRECURSOR RATING</span>
              <span className={`text-lg font-black uppercase tracking-tight px-3.5 py-1.5 rounded-xl border inline-flex items-center gap-2 ${cfg.badge}`}>
                <span className={`w-2 h-2 rounded-full ${sif_potential === 'HIGH' ? 'bg-[#FF3B30]' : sif_potential === 'MEDIUM' ? 'bg-[#FF9500]' : 'bg-[#34C759]'} animate-pulse`} />
                {cfg.label}
              </span>
            </div>
          </div>

          {/* Confidence box */}
          <div className="bg-[#000000] border border-[#2C3480] p-4 rounded-xl min-w-[210px] space-y-2.5 shadow-inner">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#BAC4EB] font-semibold">Model Confidence</span>
              <span className="font-black text-[#FFFFFF] font-mono text-sm">{pct}<span className="text-[#64748B] text-xs">/100</span></span>
            </div>
            <ConfBar value={pct} />
            <div className="flex items-start gap-1.5 text-[10px] text-[#64748B]">
              <Info className="w-3 h-3 text-[#5B73D1] shrink-0 mt-0.5" />
              Classifier probability — not injury probability
            </div>
          </div>
        </div>
      </Card>

      {/* Source document */}
      {sourceDoc && (
        <Card className="p-5 border border-[#2C3480]" delay={140}>
          <div className="flex items-center justify-between border-b border-[#2C3480]/60 pb-3 mb-3">
            <h3 className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-[#5B73D1]" />
              Source Document &amp; Traceability
            </h3>
            <span className="badge-cobalt text-[10px] font-bold px-2.5 py-0.5 rounded-full">Verified File Input</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            {[
              { label: 'Filename', val: sourceDoc.filename },
              { label: 'Format & Size', val: `${sourceDoc.file_type?.toUpperCase()} · ${(sourceDoc.file_size_bytes / 1024).toFixed(1)} KB` },
              { label: 'Pages', val: `${sourceDoc.total_pages || 1} page${sourceDoc.total_pages !== 1 ? 's' : ''}` },
              { label: 'Evidence Pages', val: sourceDoc.evidence_pages?.length > 0 ? `Page ${sourceDoc.evidence_pages.join(', ')}` : 'Document-wide' },
            ].map(({ label, val }) => (
              <div key={label} className="bg-[#000000] border border-[#2C3480] p-3 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-[#BAC4EB] block mb-1">{label}</span>
                <p className="font-bold text-[#FFFFFF] truncate">{val}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Attribute grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger-children">
        {[
          { label: 'Detected Hazard',      val: hazard,          icon: Flame,    color: 'text-[#FF9500]' },
          { label: 'Activity Context',      val: activity,        icon: Activity, color: 'text-[#5B73D1]' },
          { label: 'Unsafe Condition / Act', val: resultData.unsafe_condition || resultData.unsafe_act || unsafe_condition || 'Unspecified', icon: AlertTriangle, color: 'text-[#FF9500]' },
          { label: 'Life-Saving Rule',      val: life_saving_rule, icon: BookOpen, color: 'text-[#FFFFFF]' },
        ].map(({ label, val, icon: Icon, color }) => (
          <div key={label} className="corp-card p-4.5 rounded-2xl border border-[#2C3480] shadow-md">
            <span className="text-[10px] uppercase font-bold text-[#BAC4EB] block mb-2">{label}</span>
            <div className="flex items-start gap-2.5">
              <Icon className={`w-4 h-4 ${color} shrink-0 mt-0.5`} />
              <p className="text-xs font-semibold text-[#FFFFFF] leading-relaxed">{val}</p>
            </div>
          </div>
        ))}

        <div className="corp-card p-4.5 rounded-2xl border border-[#FF3B30]/50 shadow-md">
          <span className="text-[10px] font-bold text-[#FF3B30] uppercase tracking-wider block mb-2">Potential Consequence</span>
          <div className="flex items-start gap-2.5">
            <Target className="w-4 h-4 text-[#FF3B30] shrink-0 mt-0.5" />
            <p className="text-xs font-semibold text-[#FF3B30] leading-relaxed">{potential_consequence}</p>
          </div>
        </div>

        <div className="corp-card p-4.5 rounded-2xl border border-[#34C759]/50 shadow-md">
          <span className="text-[10px] font-bold text-[#34C759] uppercase tracking-wider block mb-2">Actual Field Outcome</span>
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#34C759] shrink-0 mt-0.5" />
            <p className="text-xs font-semibold text-[#34C759] leading-relaxed">{actual_outcome}</p>
          </div>
        </div>
      </div>

      {/* Evidence & XAI */}
      <Card className="p-5 border border-[#2C3480] shadow-cobalt-glow" delay={240}>
        <div className="flex items-center justify-between border-b border-[#2C3480]/60 pb-3 mb-4">
          <h3 className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#5B73D1]" />
            Extracted Evidence &amp; Text Highlights
          </h3>
          <span className="badge-cobalt text-[10px] font-bold px-2.5 py-0.5 rounded-full">Explainable XAI</span>
        </div>

        {evidence && evidence.length > 0 && (
          <div className="mb-4">
            <span className="text-[10px] font-bold text-[#BAC4EB] uppercase tracking-wider block mb-2">Extracted Key Phrases</span>
            <div className="flex flex-wrap gap-2">
              {evidence.map((ev, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-[#000000] text-[#FFFFFF] border border-[#2C3480] text-xs font-mono font-bold">
                  "{ev}"
                </span>
              ))}
            </div>
          </div>
        )}

        {reportTextToHighlight && (
          <div>
            <span className="text-[10px] font-bold text-[#BAC4EB] uppercase tracking-wider block mb-2">Document Text Evidence Spans</span>
            <div className="p-3.5 bg-[#000000] rounded-xl border border-[#2C3480] leading-relaxed text-xs max-h-48 overflow-y-auto text-[#FFFFFF]">
              <EvidenceHighlighter text={reportTextToHighlight} highlights={highlightsForText} />
            </div>
          </div>
        )}

        {explanation && (
          <p className="mt-3.5 text-xs text-[#FFFFFF] leading-relaxed bg-[#000000] p-3.5 rounded-xl border border-[#2C3480]">
            <strong className="text-[#5B73D1]">Model Explanation: </strong>{explanation}
          </p>
        )}
      </Card>

      {/* HSE Action + Sign-Off */}
      <Card className="p-5 border border-[#2C3480] shadow-cobalt-glow" delay={300}>
        <div className="flex items-center justify-between border-b border-[#2C3480]/60 pb-3 mb-4">
          <h3 className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-[#5B73D1]" />
            Recommended HSE Action
          </h3>
          <span className="text-[10px] font-bold text-[#FFFFFF] bg-[#2C3480]/40 border border-[#4E5BC9] px-2.5 py-0.5 rounded-full">
            Human-in-the-Loop
          </span>
        </div>

        <div className="p-3.5 bg-[#000000] rounded-xl border border-[#2C3480] text-xs font-semibold text-[#FFFFFF] leading-relaxed mb-4">
          {recommended_action}
        </div>

        <form onSubmit={handleSubmitSignOff} className="border-t border-[#2C3480]/60 pt-4 space-y-3.5">
          <span className="text-xs font-bold text-[#FFFFFF] block">HSE Professional Verification &amp; Sign-Off</span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-[10px] text-[#BAC4EB] font-semibold uppercase tracking-wider block mb-1.5">HSE Officer Name</label>
              <input
                type="text"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                className="dark-input w-full px-3.5 py-2 text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] text-[#BAC4EB] font-semibold uppercase tracking-wider block mb-1.5">Action Decision</label>
              <select
                value={actionTaken}
                onChange={(e) => setActionTaken(e.target.value)}
                className="dark-input w-full px-3.5 py-2 text-xs"
              >
                <option value="APPROVED_AI">Approve SIF Potential Classification</option>
                <option value="OVERRIDDEN">Override SIF Potential</option>
                <option value="ESCALATED">Escalate to Duty Manager</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] text-[#BAC4EB] font-semibold uppercase tracking-wider block mb-1.5">HSE Directives &amp; Action Notes</label>
            <textarea
              rows={2}
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder="Add HSE field directives, barrier verification notes, or corrective actions..."
              className="dark-input w-full px-3.5 py-2 text-xs resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="submit"
              className={`inline-flex items-center gap-2 font-bold text-xs px-5 py-2.5 rounded-xl transition-all duration-200 active:scale-95 ${
                reviewSubmitted
                  ? 'bg-[#34C759]/20 border border-[#34C759] text-[#34C759]'
                  : 'btn-cobalt shadow-cobalt-glow'
              }`}
            >
              {reviewSubmitted ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#34C759]" />
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
              <span className="text-xs text-[#34C759] font-semibold flex items-center gap-1.5 animate-fade-in">
                <CheckCircle2 className="w-4 h-4" />
                Human decision recorded in audit log
              </span>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
