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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-xl overflow-hidden font-sans">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-2 py-0.5 rounded border border-slate-300 dark:border-slate-700">
              {report.report_number}
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{report.title}</h3>
              <p className="text-[11px] text-slate-500">{report.location} • {report.unit_department}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* SIF Rating Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              {effectiveSif === 'HIGH' && <AlertOctagon className="w-6 h-6 text-red-600 dark:text-red-400 shrink-0" />}
              {effectiveSif === 'MEDIUM' && <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0" />}
              {effectiveSif === 'LOW' && <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />}
              <div>
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                    effectiveSif === 'HIGH'
                      ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border-red-200 dark:border-red-900'
                      : effectiveSif === 'MEDIUM'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-900'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900'
                  }`}
                >
                  {effectiveSif} SIF POTENTIAL
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Model Confidence: <span className="font-bold text-slate-900 dark:text-slate-100">{Math.round(report.confidence_score * 100)} / 100</span>
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-500 block font-semibold">Review Status</span>
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-300 dark:border-slate-700 inline-block mt-0.5">
                {report.review_status}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Detected Hazard</span>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{report.detected_hazard}</span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Activity</span>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{report.activity}</span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Unsafe Category</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{report.unsafe_category}</span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Life-Saving Rule</span>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1 mt-0.5">
                <BookOpen className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                {report.life_saving_rule}
              </span>
            </div>

            <div className="sm:col-span-2 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Potential Consequence</span>
              <span className="text-xs text-slate-800 dark:text-slate-200 font-semibold">{report.potential_consequence}</span>
            </div>
          </div>

          {/* Evidence Highlights */}
          <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1.5">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase">Original Text & Evidence Spans</h4>
            <div className="p-2.5 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 leading-relaxed text-xs">
              <EvidenceHighlighter text={report.report_text} highlights={report.evidence_highlights} />
            </div>
          </div>

          {/* Audit History Log */}
          {report.reviews && report.reviews.length > 0 && (
            <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase flex items-center gap-1">
                <History className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                Audit Trail ({report.reviews.length})
              </h4>
              <div className="space-y-1.5">
                {report.reviews.map((rev) => (
                  <div key={rev.id} className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 text-xs space-y-0.5">
                    <div className="flex justify-between text-slate-500 text-[11px]">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{rev.reviewer_name} ({rev.reviewer_role})</span>
                      <span>{new Date(rev.created_at).toLocaleString()}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 font-semibold">Action: {rev.action_taken}</p>
                    {rev.review_notes && <p className="text-slate-600 dark:text-slate-400 italic">"{rev.review_notes}"</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Form */}
          <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
              Add HSE Decision / Override
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <input
                type="text"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                placeholder="Reviewer Name"
                className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
              />
              <select
                value={actionTaken}
                onChange={(e) => setActionTaken(e.target.value)}
                className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
              >
                <option value="APPROVED_AI">Approve AI Classification</option>
                <option value="OVERRIDDEN">Override SIF Potential</option>
              </select>
            </div>
            {actionTaken === 'OVERRIDDEN' && (
              <select
                value={overrideSif}
                onChange={(e) => setOverrideSif(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-red-300 dark:border-red-800 rounded px-2 py-1.5 text-xs text-red-700 dark:text-red-300 focus:outline-none"
              >
                <option value="HIGH">HIGH SIF</option>
                <option value="MEDIUM">MEDIUM SIF</option>
                <option value="LOW">LOW SIF</option>
              </select>
            )}
            <textarea
              rows={2}
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder="Enter HSE review notes..."
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
            />
            <button
              onClick={handleReview}
              disabled={submitting}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 rounded transition shadow-xs"
            >
              Submit HSE Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
