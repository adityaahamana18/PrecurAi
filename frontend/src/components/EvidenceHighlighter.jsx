import React from 'react';

const HAZARD_KEYWORDS = ['height', 'fall', 'gas', 'leak', 'pressure', 'voltage', 'arc', 'toxic', 'h2s', 'suspended load', 'hazard', 'fire', 'explosion'];
const BARRIER_KEYWORDS = ['missing', 'without', 'not completed', 'unverified', 'bypassed', 'failed', 'untethered', 'lacking'];
const ENTITY_KEYWORDS = ['technician', 'worker', 'scaffolding', 'platform', 'crane', 'valve', 'tank', 'vessel', 'equipment', 'harness', 'barrier'];
const RULE_KEYWORDS = ['working at height', 'confined space', 'energy isolation', 'line of fire', 'hot work', 'life-saving'];

export default function EvidenceHighlighter({ text, highlights = [] }) {
  if (!text) return null;

  // Split text into tokens and highlight matches
  const words = text.split(/(\s+)/);

  return (
    <div className="leading-relaxed font-sans text-sm text-[#F4F7FB] p-4 rounded-xl bg-[#070B14] border border-[#00E5FF]/20">
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
              className="px-1.5 py-0.5 rounded font-bold text-xs bg-[#FF4757]/20 text-[#FF4757] border border-[#FF4757]/50 shadow-[0_0_8px_rgba(255,71,87,0.3)] mx-0.5"
              title="High-Energy Hazard Indicator"
            >
              {chunk}
            </span>
          );
        }

        if (isBarrier) {
          return (
            <span
              key={idx}
              className="px-1.5 py-0.5 rounded font-bold text-xs bg-[#FFB020]/20 text-[#FFB020] border border-[#FFB020]/50 shadow-[0_0_8px_rgba(255,176,32,0.3)] mx-0.5"
              title="Failed / Missing Safety Barrier"
            >
              {chunk}
            </span>
          );
        }

        if (isRule) {
          return (
            <span
              key={idx}
              className="px-1.5 py-0.5 rounded font-bold text-xs bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/50 shadow-[0_0_8px_rgba(139,92,246,0.3)] mx-0.5"
              title="Life-Saving Rule Entity"
            >
              {chunk}
            </span>
          );
        }

        if (isEntity) {
          return (
            <span
              key={idx}
              className="px-1.5 py-0.5 rounded font-bold text-xs bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/50 shadow-[0_0_8px_rgba(0,229,255,0.25)] mx-0.5"
              title="Activity / Equipment Target"
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
