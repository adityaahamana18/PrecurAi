import React, { useState } from 'react';
import { X, AlertOctagon, AlertTriangle, ShieldCheck, BookOpen, UserCheck, Clock, CheckCircle2, History } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="corp-card border border-plum-700/60 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden font-sans">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-plum-800/70 bg-velvet-950/90">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold bg-plum-900/80 text-apricot-300 px-2.5 py-1 rounded-lg border border-plum-700/60">
              {report.report_number}
            </span>
            <div>
              <h3 className="text-sm font-bold text-white">{report.title}</h3>
              <p className="text-[11px] text-plum-400">{report.location} • {report.unit_department}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-plum-400 hover:text-white rounded-lg hover:bg-plum-800/50 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-velvet-950/80 p-3.5 rounded-xl border border-plum-800/60">
              <span className="text-[10px] uppercase font-bold text-plum-400 block mb-1">SIF Status</span>
              <span className={`text-xs font-bold uppercase px-2.5 py-0.5 rounded-lg border inline-flex items-center gap-1.5 ${
                effectiveSif === 'HIGH'
                  ? 'bg-red-950/60 text-red-300 border-red-800/60'
                  : effectiveSif === 'MEDIUM'
                  ? 'bg-amber-950/60 text-apricot-300 border-amber-800/60'
                  : 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
              }`}>
                {effectiveSif} SIF
              </span>
            </div>

            <div className="bg-velvet-950/80 p-3.5 rounded-xl border border-plum-800/60">
              <span className="text-[10px] uppercase font-bold text-plum-400 block mb-1">Confidence</span>
              <span className="text-sm font-bold font-mono text-coral-400">
                {Math.round(report.confidence_score * 100)} / 100
              </span>
            </div>

            <div className="bg-velvet-950/80 p-3.5 rounded-xl border border-plum-800/60">
              <span className="text-[10px] uppercase font-bold text-plum-400 block mb-1">IOGP Rule</span>
              <span className="text-xs font-bold text-white truncate block">
                {report.life_saving_rule || 'N/A'}
              </span>
            </div>
          </div>

          {/* Narrative */}
          <div>
            <span className="text-[11px] font-bold text-plum-300 uppercase tracking-wider block mb-1.5">Observation Narrative</span>
            <div className="p-3.5 bg-velvet-950/80 rounded-xl border border-plum-800/60 text-xs text-plum-100 leading-relaxed">
              {report.report_text}
            </div>
          </div>

          {/* Review Form */}
          <div className="border-t border-plum-800/70 pt-4 space-y-3">
            <span className="text-xs font-bold text-white block">HSE Supervisory Verification</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-plum-400 font-bold uppercase block mb-1">Officer Name</label>
                <input
                  type="text"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="dark-input w-full px-3 py-1.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[10px] text-plum-400 font-bold uppercase block mb-1">Action</label>
                <select
                  value={actionTaken}
                  onChange={(e) => setActionTaken(e.target.value)}
                  className="dark-input w-full px-3 py-1.5 text-xs text-white"
                >
                  <option value="APPROVED_AI">Approve AI Classification</option>
                  <option value="OVERRIDDEN">Override SIF Level</option>
                </select>
              </div>
            </div>

            {actionTaken === 'OVERRIDDEN' && (
              <div>
                <label className="text-[10px] text-coral-400 font-bold uppercase block mb-1">New SIF Level</label>
                <select
                  value={overrideSif}
                  onChange={(e) => setOverrideSif(e.target.value)}
                  className="dark-input w-full px-3 py-1.5 text-xs text-white"
                >
                  <option value="HIGH">HIGH SIF</option>
                  <option value="MEDIUM">MEDIUM SIF</option>
                  <option value="LOW">LOW SIF</option>
                </select>
              </div>
            )}

            <div>
              <label className="text-[10px] text-plum-400 font-bold uppercase block mb-1">Review Notes</label>
              <textarea
                rows={2}
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Directives or verification notes..."
                className="dark-input w-full px-3 py-1.5 text-xs text-white resize-none"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-plum-800/70 bg-velvet-950/90">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-plum-300 hover:text-white rounded-xl transition"
          >
            Cancel
          </button>
          <button
            onClick={handleReview}
            disabled={submitting}
            className="btn-sunset-primary px-5 py-2 text-xs shadow-coral-glow disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Verification'}
          </button>
        </div>
      </div>
    </div>
  );
}
