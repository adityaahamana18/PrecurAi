import React from 'react';

export default function EvidenceHighlighter({ text, highlights = [] }) {
  if (!text) return null;
  if (!highlights || highlights.length === 0) {
    return <p className="text-slate-300 dark:text-slate-300 text-slate-700 leading-relaxed font-sans">{text}</p>;
  }

  // Sort highlights by start offset
  const sorted = [...highlights].sort((a, b) => a.start - b.start);
  const elements = [];
  let currentIndex = 0;

  sorted.forEach((hl, i) => {
    // Non-highlighted text segment before keyword
    if (hl.start > currentIndex) {
      elements.push(
        <span key={`text-${currentIndex}`}>
          {text.slice(currentIndex, hl.start)}
        </span>
      );
    }

    // Highlighted evidence keyword span
    const snippet = text.slice(hl.start, hl.end);
    const isLSR = hl.category && hl.category.includes('Life-Saving');

    elements.push(
      <mark
        key={`hl-${i}-${hl.start}`}
        className={`px-1.5 py-0.5 rounded font-semibold text-xs border ${
          isLSR
            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 dark:bg-amber-500/20 dark:text-amber-300'
            : 'bg-red-500/20 text-red-300 border-red-500/40 dark:bg-red-500/20 dark:text-red-300'
        }`}
        title={`${hl.category}: "${hl.keyword}"`}
      >
        {snippet}
      </mark>
    );

    currentIndex = Math.max(currentIndex, hl.end);
  });

  // Remaining trailing text
  if (currentIndex < text.length) {
    elements.push(
      <span key={`text-end`}>
        {text.slice(currentIndex)}
      </span>
    );
  }

  return (
    <div className="leading-relaxed font-sans text-sm text-slate-200 dark:text-slate-200 text-slate-800">
      {elements}
    </div>
  );
}
