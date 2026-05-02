
import React, { useState } from 'react';

interface QuickActionsProps {
  onReset: () => void;
  onActionComplete: (msg: string) => void;
}

const actions = [
  {
    id: 'pdf',
    label: 'Generate Feasibility PDF',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'csv',
    label: 'Export Ledger CSV',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    ),
  },
  {
    id: 'audit',
    label: 'Request Human Audit',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: 'reset',
    label: 'Reset Quadrant Matrix',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
];

const QuickActions: React.FC<QuickActionsProps> = ({ onReset, onActionComplete }) => {
  const [processing, setProcessing] = useState<string | null>(null);

  const handleAction = (id: string, label: string) => {
    setProcessing(id);
    setTimeout(() => {
      setProcessing(null);
      if (id === 'reset') {
        onReset();
        onActionComplete('Quadrant values recalibrated to baseline.');
      } else {
        onActionComplete(`${label} successfully initiated.`);
      }
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 gap-2">
      {actions.map((action) => (
        <button
          key={action.id}
          disabled={processing !== null}
          onClick={() => handleAction(action.id, action.label)}
          className={`flex items-center gap-3 px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-xl transition-all text-left relative overflow-hidden group ${
            processing === action.id
              ? 'opacity-70'
              : 'hover:bg-[#D4AF37]/5 hover:border-[#D4AF37]/30 active:scale-[0.98]'
          }`}
        >
          {processing === action.id && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
              <div className="w-4 h-4 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <span className={`text-[#D4AF37] transition-transform group-hover:scale-110 ${processing === action.id ? 'invisible' : ''}`}>
            {action.icon}
          </span>
          <span className={`text-[10px] font-bold text-slate-300 uppercase tracking-widest leading-tight group-hover:text-white transition-colors ${processing === action.id ? 'invisible' : ''}`}>
            {action.label}
          </span>
          <div className="ml-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className={`w-3 h-3 text-slate-600 opacity-0 group-hover:opacity-100 transition-all group-hover:text-[#D4AF37] ${processing === action.id ? 'invisible' : ''}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
