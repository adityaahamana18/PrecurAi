import React, { useState } from 'react';
import { X, AlertOctagon, AlertTriangle, ShieldCheck, BookOpen, UserCheck, Clock, CheckCircle2, History, Send } from 'lucide-react';
import EvidenceHighlighter from './EvidenceHighlighter';

export default function ReportDetailModal({ report, onClose, onReviewSubmitted }) {
  if (!report) return null;

  const [reviewerName, setReviewerName] = useState('Senior Safety Officer');
  const [actionTaken, setActionTaken] = useState('APPROVED_AI');
  const [overrideSif, setOverrideSif] = useState(report.sif_potential);
  const [reviewNotes, setReviewNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const effectiveSif = report.final_sif_level || report.sif_potential;

  const handleReview = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/reports/${report.id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewer_name: reviewerName,
          reviewer_role: 'HSE Manager',
          action_taken: actionTaken,
          override_sif_level: actionTaken === 'OVERRIDDEN' ? overrideSif : null,
          review_notes: reviewNotes
        })
      });

      if (!res.ok) throw new Error('Failed to record review');
      const updated = await res.json();
      if (onReviewSubmitted) onReviewSubmitted(updated);
      onClose();
    } catch (err) {
      alert("Failed to submit review: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in font-sans text-[#F4F7FB]">
      <div className="cinematic-card border border-[#00E5FF]/30 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-cinematic overflow-hidden bg-[#0D1424]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#00E5FF]/15 bg-[#070B14]">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold bg-[#0D1424] text-[#00E5FF] px-2.5 py-1 rounded-lg border border-[#00E5FF]/40 shadow-inner">
              {report.report_number || `#${report.id}`}
            </span>
            <div>
              <h3 className="text-sm font-bold text-[#F4F7FB]">{report.title}</h3>
              <p className="text-[11px] text-[#94A3B8]">{report.location} • {report.unit_department}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#94A3B8] hover:text-[#F4F7FB] rounded-lg hover:bg-[#111A2E] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-[#070B14] p-3.5 rounded-xl border border-[#00E5FF]/20">
              <span className="text-[10px] uppercase font-bold text-[#64748B] block mb-1">SIF Potential</span>
              <span className={`text-xs font-bold uppercase px-2.5 py-0.5 rounded-lg border inline-flex items-center gap-1.5 ${
                effectiveSif === 'HIGH'
                  ? 'bg-[#FF4757]/20 text-[#FF4757] border-[#FF4757]/50'
                  : effectiveSif === 'MEDIUM'
                  ? 'bg-[#FFB020]/20 text-[#FFB020] border-[#FFB020]/50'
                  : 'bg-[#2EE59D]/20 text-[#2EE59D] border-[#2EE59D]/50'
              }`}>
                {effectiveSif} SIF
              </span>
            </div>

            <div className="bg-[#070B14] p-3.5 rounded-xl border border-[#00E5FF]/20">
              <span className="text-[10px] uppercase font-bold text-[#64748B] block mb-1">Confidence Score</span>
              <span className="text-sm font-bold font-mono text-[#00E5FF]">
                {Math.round((report.confidence_score || 0.85) * 100)} / 100
              </span>
            </div>

            <div className="bg-[#070B14] p-3.5 rounded-xl border border-[#00E5FF]/20">
              <span className="text-[10px] uppercase font-bold text-[#64748B] block mb-1">Life-Saving Rule</span>
              <span className="text-xs font-bold text-[#8B5CF6] truncate block font-mono">
                {report.life_saving_rule || 'General Control'}
              </span>
            </div>
          </div>

          {/* Narrative with Highlighted Spans */}
          <div>
            <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-1.5">Observation Narrative</span>
            <EvidenceHighlighter text={report.report_text || report.text} />
          </div>

          {/* Review Section */}
          <div className="p-4 bg-[#070B14] rounded-xl border border-[#00E5FF]/20 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#00E5FF] flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              Safety Supervisor Verification Action
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[10px] text-[#94A3B8] uppercase mb-1 font-mono">Supervisor Name</label>
                <input
                  type="text"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="dark-input w-full px-3 py-1.5 text-xs text-[#F4F7FB]"
                />
              </div>

              <div>
                <label className="block text-[10px] text-[#94A3B8] uppercase mb-1 font-mono">Action Decision</label>
                <select
                  value={actionTaken}
                  onChange={(e) => setActionTaken(e.target.value)}
                  className="dark-input w-full px-3 py-1.5 text-xs text-[#F4F7FB]"
                >
                  <option value="APPROVED_AI">Approve AI SIF Potential</option>
                  <option value="OVERRIDDEN">Override SIF Potential</option>
                  <option value="ESCALATED">Escalate to Plant Manager</option>
                </select>
              </div>
            </div>

            {actionTaken === 'OVERRIDDEN' && (
              <div>
                <label className="block text-[10px] text-[#FFB020] uppercase mb-1 font-mono">Override SIF Severity</label>
                <select
                  value={overrideSif}
                  onChange={(e) => setOverrideSif(e.target.value)}
                  className="dark-input w-full px-3 py-1.5 text-xs text-[#F4F7FB]"
                >
                  <option value="HIGH">HIGH SIF</option>
                  <option value="MEDIUM">MEDIUM SIF</option>
                  <option value="LOW">LOW SIF</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-[10px] text-[#94A3B8] uppercase mb-1 font-mono">Supervisor Notes / Directives</label>
              <textarea
                rows={2}
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Enter field corrective directives, barrier status, or justification..."
                className="dark-input w-full p-2.5 text-xs text-[#F4F7FB]"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-[#00E5FF]/15 bg-[#070B14] flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-[#94A3B8] hover:text-[#F4F7FB]"
          >
            Close
          </button>

          <button
            onClick={handleReview}
            disabled={submitting}
            className="btn-cinematic-cyan flex items-center gap-2 px-5 py-2 text-xs font-bold active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5 text-[#070B14]" />
            <span>{submitting ? 'Recording...' : 'Record Supervisor Sign-Off'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
