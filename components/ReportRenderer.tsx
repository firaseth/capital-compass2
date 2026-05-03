
import React from 'react';

interface ReportRendererProps {
  text: string;
}

const ReportRenderer: React.FC<ReportRendererProps> = ({ text }) => {
  const lines = text.split('\n');

  return (
    <div className="space-y-2 text-sm leading-relaxed">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-2" />;

        // ## Heading
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={i} className="text-[#D4AF37] font-black text-xs uppercase tracking-widest mt-4 mb-1 border-b border-[#D4AF37]/15 pb-1">
              {trimmed.slice(3)}
            </h3>
          );
        }

        // # Heading
        if (trimmed.startsWith('# ')) {
          return (
            <h2 key={i} className="text-white font-black text-sm uppercase tracking-widest mt-4 mb-2">
              {trimmed.slice(2)}
            </h2>
          );
        }

        // Bullet points
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <div key={i} className="flex items-start gap-2 ml-2">
              <span className="text-[#D4AF37] mt-1.5 flex-shrink-0" style={{ fontSize: '6px' }}>◆</span>
              <span className="text-slate-300">{renderInline(trimmed.slice(2))}</span>
            </div>
          );
        }

        // Numbered list
        const numbered = trimmed.match(/^(\d+)\.\s+(.+)/);
        if (numbered) {
          return (
            <div key={i} className="flex items-start gap-2.5 ml-2">
              <span className="text-[#D4AF37] font-black text-[10px] flex-shrink-0 mt-0.5">{numbered[1]}.</span>
              <span className="text-slate-300">{renderInline(numbered[2])}</span>
            </div>
          );
        }

        // Bold-only line (acts as a section label)
        if (trimmed.startsWith('**') && trimmed.endsWith('**') && trimmed.indexOf('**', 2) === trimmed.length - 2) {
          return (
            <p key={i} className="text-white font-black text-xs uppercase tracking-wider mt-3">
              {trimmed.slice(2, -2)}
            </p>
          );
        }

        // Regular paragraph
        return (
          <p key={i} className="text-slate-300">
            {renderInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
};

function renderInline(text: string): React.ReactNode {
  // Split on **bold** patterns
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-white font-black">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export default ReportRenderer;
