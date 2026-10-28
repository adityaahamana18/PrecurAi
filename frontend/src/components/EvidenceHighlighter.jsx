import React from 'react';

const HAZARD_KEYWORDS = ['height', 'fall', 'gas', 'leak', 'pressure', 'voltage', 'arc', 'toxic', 'h2s', 'suspended load', 'hazard', 'fire', 'explosion'];
const BARRIER_KEYWORDS = ['missing', 'without', 'not completed', 'unverified', 'bypassed', 'failed', 'untethered', 'lacking'];
const ENTITY_KEYWORDS = ['technician', 'worker', 'scaffolding', 'platform', 'crane', 'valve', 'tank', 'vessel', 'equipment', 'harness', 'barrier'];
const RULE_KEYWORDS = ['working at height', 'confined space', 'energy isolation', 'line of fire', 'hot work', 'life-saving'];

export default function EvidenceHighlighter({ text, highlights = [] }) {
  if (!text) return null;

  const words = text.split(/(\s+)/);

  return (
    <div className="leading-relaxed font-sans text-xs text-[#F4F7FB] p-4 rounded-xl bg-[#080C14] border border-white/[0.08]">
      {words.map((chunk, idx) => {
        const lower = chunk.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (!lower) return <span key={idx}>{chunk}</span>;

        const isHazard = HAZARD_KEYWORDS.some((k) => lower.includes(k) || k.includes(lower));
        const isBarrier = BARRIER_KEYWORDS.some((k) => lower.includes(k));
        const isEntity = ENTITY_KEYWORDS.some((k) => lower.includes(k));
        const isRule = RULE_KEYWORDS.some((k) => lower.includes(k));

        if (isHazard) {
          return (
            <span
              key={idx}
              className="px-1.5 py-0.5 rounded font-semibold text-xs bg-red-500/15 text-red-300 border border-red-500/30 mx-0.5"
              title="High-Energy Hazard"
            >
              {chunk}
            </span>
          );
        }

        if (isBarrier) {
          return (
            <span
              key={idx}
              className="px-1.5 py-0.5 rounded font-semibold text-xs bg-amber-500/15 text-amber-300 border border-amber-500/30 mx-0.5"
              title="Failed Barrier"
            >
              {chunk}
            </span>
          );
        }

        if (isRule) {
          return (
            <span
              key={idx}
              className="px-1.5 py-0.5 rounded font-semibold text-xs bg-violet-500/15 text-violet-300 border border-violet-500/30 mx-0.5"
              title="Life-Saving Rule"
            >
              {chunk}
            </span>
          );
        }

        if (isEntity) {
          return (
            <span
              key={idx}
              className="px-1.5 py-0.5 rounded font-semibold text-xs bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 mx-0.5"
              title="Target Entity"
            >
              {chunk}
            </span>
          );
        }

        return <span key={idx}>{chunk}</span>;
      })}
    </div>
  );
}
