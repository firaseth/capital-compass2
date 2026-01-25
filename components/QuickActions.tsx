
import React, { useState } from 'react';

interface QuickActionsProps {
  onReset: () => void;
  onActionComplete: (msg: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onReset, onActionComplete }) => {
  const [processing, setProcessing] = useState<string | null>(null);

  const actions = [
    { id: 'pdf', label: 'Generate Feasibility PDF', icon: '📄' },
    { id: 'csv', label: 'Export Ledger (CSV)', icon: '📊' },
    { id: 'audit', label: 'Request Human Audit', icon: '👥' },
    { id: 'reset', label: 'Reset Quadrant Matrix', icon: '⚙️' },
  ];

  const handleAction = (id: string, label: string) => {
    setProcessing(id);
    
    // Simulate processing time for "solid" feel
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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {actions.map((action) => (
        <button 
          key={action.id} 
          disabled={processing !== null}
          onClick={() => handleAction(action.id, action.label)}
          className={`flex items-center gap-3 p-4 bg-slate-900/50 border border-slate-800 rounded-xl transition-all text-left relative overflow-hidden group ${
            processing === action.id ? 'opacity-70 scale-[0.98]' : 'hover:bg-slate-800 hover:border-[#D4AF37]/50 active:scale-95'
          }`}
        >
          {processing === action.id && (
            <div className="absolute inset-0 bg-[#D4AF37]/10 flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <span className={`text-xl transition-transform ${processing === action.id ? 'invisible' : 'group-hover:scale-110'}`}>
            {action.icon}
          </span>
          <span className={`text-[10px] font-bold text-slate-300 uppercase tracking-widest leading-tight ${processing === action.id ? 'invisible' : ''}`}>
            {action.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
