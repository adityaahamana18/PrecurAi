import React, { useState, useEffect } from 'react';
import {
  AlertOctagon, AlertTriangle, ShieldCheck, BookOpen, UserCheck,
  ArrowLeft, Info, CheckCircle2, AlertCircle, FileText, Send,
  LayoutDashboard, FileCheck, Flame, Activity, Target, Zap, Sparkles,
  ChevronDown, ChevronUp, Lock
} from 'lucide-react';
import EvidenceHighlighter from './EvidenceHighlighter';

function ConfBar({ value }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(value), 300);
    return () => clearTimeout(t);
  }, [value]);

  const color =
    value >= 75 ? '#FF4757' :
    value >= 50 ? '#FFB020' : '#2EE59D';

  return (
    <div className="w-full bg-[#070B14] h-2.5 rounded-full overflow-hidden border border-[#00E5FF]/30 p-0.5">
      <div
        className="h-full rounded-full transition-all duration-1000 ease-out"
        style={{ width: `${width}%`, background: color, boxShadow: `0 0 12px ${color}` }}
      />
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
  const [xaiExpanded, setXaiExpanded] = useState(true);

  const handleSubmitSignOff = (e) => {
    e.preventDefault();
    setReviewSubmitted(true);
  };

  const pct = Math.round(confidence * 100);

  const sifConfig = {
    HIGH:   { icon: AlertOctagon,  color: 'text-[#FF4757]', bg: 'bg-[#FF4757]/15', border: 'border-[#FF4757]/60', badge: 'bg-[#FF4757]/20 text-[#FF4757] border-[#FF4757]', label: 'High SIF Potential' },
    MEDIUM: { icon: AlertTriangle, color: 'text-[#FFB020]', bg: 'bg-[#FFB020]/15', border: 'border-[#FFB020]/60', badge: 'bg-[#FFB020]/20 text-[#FFB020] border-[#FFB020]', label: 'Medium SIF Potential' },
    LOW:    { icon: ShieldCheck,   color: 'text-[#2EE59D]', bg: 'bg-[#2EE59D]/15', border: 'border-[#2EE59D]/60', badge: 'bg-[#2EE59D]/20 text-[#2EE59D] border-[#2EE59D]', label: 'Low SIF Potential' },
  };
  const cfg = sifConfig[sif_potential] ?? sifConfig.LOW;
  const SifIcon = cfg.icon;

  const reportTextToHighlight = requestMetadata?.reportText || resultData?.full_text || '';

  return (
    <div className="max-w-4xl mx-auto space-y-5 animate-fade-in font-sans text-[#F4F7FB]">
      
      {/* ── Top Navigation Action Bar ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToDashboard}
            className="btn-cinematic-cyan flex items-center gap-1.5 px-4 py-2 text-xs font-bold active:scale-95 cursor-pointer shadow-cyan-glow"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-[#070B14]" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={onBackToAnalyze}
            className="btn-ghost-dark flex items-center gap-1.5 px-4 py-2 text-xs font-semibold active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span>Analyze Another</span>
          </button>
        </div>
        <span className="text-[11px] text-[#00E5FF] font-mono font-medium bg-[#0D1424] border border-[#00E5FF]/30 px-3 py-1.5 rounded-xl shadow-inner">
          {requestMetadata?.siteLocation || 'Field Observation Analysis'}
        </span>
      </div>

      {/* ── Advisory Banner ── */}
      <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-[#0D1424] border border-[#00E5FF]/20 text-[#94A3B8] text-xs font-medium shadow-sm">
        <AlertCircle className="w-4 h-4 text-[#00E5FF] shrink-0" />
        <span>PrecurAi Decision Support System. Final safety assessments and field actions remain strictly with qualified HSE personnel.</span>
      </div>

      {/* ── SIF Rating Hero Banner ── */}
      <div className={`cinematic-card p-6 ${cfg.bg} ${cfg.border} border shadow-cinematic rounded-2xl relative overflow-hidden`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative z-10">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl ${cfg.bg} border ${cfg.border} flex items-center justify-center shrink-0 shadow-lg`}>
              <SifIcon className={`w-7 h-7 ${cfg.color}`} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest block mb-1">
                SIF PRECURSOR RATING
              </span>
              <span className={`text-lg font-black uppercase tracking-tight px-3.5 py-1.5 rounded-xl border inline-flex items-center gap-2 ${cfg.badge}`}>
                <span className={`w-2 h-2 rounded-full ${sif_potential === 'HIGH' ? 'bg-[#FF4757]' : sif_potential === 'MEDIUM' ? 'bg-[#FFB020]' : 'bg-[#2EE59D]'} animate-ping`} />
                {cfg.label}
              </span>
            </div>
          </div>

          {/* Model Confidence Box */}
          <div className="bg-[#070B14]/90 border border-[#00E5FF]/30 p-4 rounded-xl min-w-[220px] space-y-2.5 shadow-inner">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#94A3B8] font-semibold">Model Confidence</span>
              <span className="font-black text-[#F4F7FB] font-mono text-sm">
                {pct}<span className="text-[#64748B] text-xs">/100</span>
              </span>
            </div>
            <ConfBar value={pct} />
            <div className="flex items-start gap-1.5 text-[10px] text-[#64748B] font-mono">
              <Info className="w-3 h-3 text-[#00E5FF] shrink-0 mt-0.5" />
              Precursor probability weight
            </div>
          </div>
        </div>
      </div>

      {/* ── Source Document Info ── */}
      {sourceDoc && (
        <div className="cinematic-card p-5 border border-[#00E5FF]/20 bg-[#0D1424]/90 rounded-2xl">
          <div className="flex items-center justify-between border-b border-[#00E5FF]/15 pb-3 mb-3">
            <h3 className="text-xs font-bold text-[#F4F7FB] uppercase tracking-wider flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-[#00E5FF]" />
              Source Document Verification
            </h3>
            <span className="text-[10px] font-bold text-[#2EE59D] bg-[#2EE59D]/10 border border-[#2EE59D]/30 px-2.5 py-0.5 rounded-full">
              Document Ingested
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            {[
              { label: 'Filename', val: sourceDoc.filename },
              { label: 'Format & Size', val: `${sourceDoc.file_type?.toUpperCase()} · ${(sourceDoc.file_size_bytes / 1024).toFixed(1)} KB` },
              { label: 'Pages', val: `${sourceDoc.total_pages || 1} page${sourceDoc.total_pages !== 1 ? 's' : ''}` },
              { label: 'Evidence Pages', val: sourceDoc.evidence_pages?.length > 0 ? `Page ${sourceDoc.evidence_pages.join(', ')}` : 'Full Document' },
            ].map(({ label, val }) => (
              <div key={label} className="bg-[#070B14] border border-[#00E5FF]/20 p-3 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-[#64748B] block mb-1">{label}</span>
                <p className="font-bold text-[#F4F7FB] truncate">{val}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Attribute Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: 'Detected Hazard', val: hazard, icon: Flame, color: 'text-[#FF4757]', border: 'border-[#FF4757]/30' },
          { label: 'Activity Context', val: activity, icon: Activity, color: 'text-[#00E5FF]', border: 'border-[#00E5FF]/30' },
          { label: 'Unsafe Condition / Barrier Failure', val: resultData.unsafe_condition || resultData.unsafe_act || unsafe_condition || 'Safety Barrier Missing', icon: AlertTriangle, color: 'text-[#FFB020]', border: 'border-[#FFB020]/30' },
          { label: 'Life-Saving Rule', val: life_saving_rule, icon: BookOpen, color: 'text-[#8B5CF6]', border: 'border-[#8B5CF6]/30' },
        ].map(({ label, val, icon: Icon, color, border }) => (
          <div key={label} className={`cinematic-card p-4.5 rounded-2xl border ${border} bg-[#0D1424]/90 shadow-cinematic`}>
            <span className="text-[10px] uppercase font-bold text-[#64748B] block mb-2">{label}</span>
            <div className="flex items-start gap-2.5">
              <Icon className={`w-4 h-4 ${color} shrink-0 mt-0.5`} />
              <p className="text-xs font-semibold text-[#F4F7FB] leading-relaxed">{val}</p>
            </div>
          </div>
        ))}

        <div className="cinematic-card p-4.5 rounded-2xl border border-[#FF4757]/40 bg-[#0D1424]/90 shadow-cinematic">
          <span className="text-[10px] font-bold text-[#FF4757] uppercase tracking-wider block mb-2">Potential Consequence</span>
          <div className="flex items-start gap-2.5">
            <Target className="w-4 h-4 text-[#FF4757] shrink-0 mt-0.5" />
            <p className="text-xs font-semibold text-[#FF4757] leading-relaxed">{potential_consequence}</p>
          </div>
        </div>

        <div className="cinematic-card p-4.5 rounded-2xl border border-[#2EE59D]/40 bg-[#0D1424]/90 shadow-cinematic">
          <span className="text-[10px] font-bold text-[#2EE59D] uppercase tracking-wider block mb-2">Actual Field Outcome</span>
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#2EE59D] shrink-0 mt-0.5" />
            <p className="text-xs font-semibold text-[#2EE59D] leading-relaxed">{actual_outcome}</p>
          </div>
        </div>
      </div>

      {/* ── Evidence & Explainable AI (XAI) ── */}
      <div className="cinematic-card p-6 border border-[#00E5FF]/20 bg-[#0D1424]/90 rounded-2xl shadow-cinematic space-y-4">
        <div className="flex items-center justify-between border-b border-[#00E5FF]/15 pb-3">
          <h3 className="text-xs font-bold text-[#F4F7FB] uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#00E5FF]" />
            Explainable AI (XAI) Feature Attribution
          </h3>
          <button
            onClick={() => setXaiExpanded(!xaiExpanded)}
            className="text-xs text-[#00E5FF] hover:text-[#FFFFFF] flex items-center gap-1 font-mono"
          >
            {xaiExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {xaiExpanded ? 'Collapse' : 'Expand'}
          </button>
        </div>

        {xaiExpanded && (
          <div className="space-y-4 animate-fade-in">
            {/* Color Legend */}
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-[#94A3B8]">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#FF4757]" /> High-Energy Hazard</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#FFB020]" /> Failed Barrier</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#00E5FF]" /> Entity / Equipment</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" /> Life-Saving Rule</span>
            </div>

            {/* Evidence Tokens */}
            {evidence && evidence.length > 0 && (
              <div>
                <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block mb-2">Extracted Feature Tokens</span>
                <div className="flex flex-wrap gap-2">
                  {evidence.map((ev, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-[#070B14] text-[#00E5FF] border border-[#00E5FF]/30 text-xs font-mono font-bold">
                      "{ev}"
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Document Highlighted Text */}
            {reportTextToHighlight && (
              <div>
                <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block mb-2">Narrative Traceability</span>
                <EvidenceHighlighter text={reportTextToHighlight} />
              </div>
            )}

            {/* Model Natural Language Explanation */}
            {explanation && (
              <div className="p-3.5 rounded-xl bg-[#070B14] border border-[#00E5FF]/20 text-xs text-[#F4F7FB] leading-relaxed">
                <span className="text-[#00E5FF] font-bold">Neural Engine Rationale: </span>
                {explanation}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Human-in-the-Loop Supervisor Verification Form ── */}
      <div className="cinematic-card p-6 border border-[#00E5FF]/20 bg-[#0D1424]/90 rounded-2xl shadow-cinematic space-y-4">
        <div className="flex items-center justify-between border-b border-[#00E5FF]/15 pb-3">
          <h3 className="text-xs font-bold text-[#F4F7FB] uppercase tracking-wider flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-[#00E5FF]" />
            Supervisor Verification &amp; Audit Trail
          </h3>
          <span className="text-[10px] font-bold text-[#00E5FF] bg-[#00E5FF]/10 border border-[#00E5FF]/30 px-2.5 py-0.5 rounded-full">
            Human-in-the-Loop Active
          </span>
        </div>

        <div className="p-3.5 bg-[#070B14] rounded-xl border border-[#00E5FF]/20 text-xs font-semibold text-[#F4F7FB] leading-relaxed">
          <span className="text-[#00E5FF] font-bold">AI Recommended Action: </span>
          {recommended_action}
        </div>

        <form onSubmit={handleSubmitSignOff} className="border-t border-[#00E5FF]/15 pt-4 space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-[10px] text-[#94A3B8] font-mono uppercase tracking-wider block mb-1.5">
                Reviewing Safety Officer
              </label>
              <input
                type="text"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                className="dark-input w-full px-3.5 py-2 text-xs text-[#F4F7FB]"
              />
            </div>
            <div>
              <label className="text-[10px] text-[#94A3B8] font-mono uppercase tracking-wider block mb-1.5">
                Verification Decision
              </label>
              <select
                value={actionTaken}
                onChange={(e) => setActionTaken(e.target.value)}
                className="dark-input w-full px-3.5 py-2 text-xs text-[#F4F7FB]"
              >
                <option value="APPROVED_AI">Approve SIF Potential Classification</option>
                <option value="OVERRIDDEN">Override SIF Potential</option>
                <option value="ESCALATED">Escalate to Site Duty Manager</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] text-[#94A3B8] font-mono uppercase tracking-wider block mb-1.5">
              HSE Directives &amp; Barrier Corrective Actions
            </label>
            <textarea
              rows={2}
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder="Add safety barrier verification notes, permit-to-work sign-offs, or corrective directives..."
              className="dark-input w-full px-3.5 py-2 text-xs text-[#F4F7FB] resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="submit"
              className={`inline-flex items-center gap-2 font-bold text-xs px-6 py-2.5 rounded-xl transition-all duration-200 active:scale-95 cursor-pointer ${
                reviewSubmitted
                  ? 'bg-[#2EE59D]/20 border border-[#2EE59D] text-[#2EE59D]'
                  : 'btn-cinematic-cyan shadow-cyan-glow'
              }`}
            >
              {reviewSubmitted ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2EE59D]" />
                  <span>HSE Sign-Off Recorded in Database</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 text-[#070B14]" />
                  <span>Submit HSE Sign-Off</span>
                </>
              )}
            </button>

            {reviewSubmitted && (
              <span className="text-xs text-[#2EE59D] font-semibold flex items-center gap-1.5 animate-fade-in font-mono">
                <CheckCircle2 className="w-4 h-4" />
                Audit Trail Logged: {new Date().toLocaleTimeString()}
              </span>
            )}
          </div>
        </form>
      </div>

    </div>
  );
}
