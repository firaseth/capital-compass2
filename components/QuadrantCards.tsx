
import React from 'react';
import { QuadrantScore } from '../types';

interface QuadrantCardsProps {
  quadrants: QuadrantScore[];
}

const quadrantConfig: Record<string, {
  color: string; bg: string; border: string; bar: string; label: string;
}> = {
  Growth:    { color: 'text-emerald-400', bg: 'bg-emerald-500/8',  border: 'border-emerald-900/30', bar: 'bg-emerald-500', label: '35% Weight' },
  Stability: { color: 'text-blue-400',    bg: 'bg-blue-500/8',     border: 'border-blue-900/30',    bar: 'bg-blue-500',    label: '30% Weight' },
  Liquidity: { color: 'text-[#D4AF37]',   bg: 'bg-yellow-500/8',   border: 'border-yellow-900/30',  bar: 'bg-[#D4AF37]',   label: '20% Weight' },
  Risk:      { color: 'text-rose-400',    bg: 'bg-rose-500/8',     border: 'border-rose-900/30',    bar: 'bg-rose-500',    label: '15% Weight — Inverse' },
};

function getRiskBand(name: string, value: number): { label: string; color: string } {
  if (name === 'Risk') {
    if (value <= 30) return { label: 'LOW RISK', color: 'text-green-400' };
    if (value <= 60) return { label: 'MED RISK', color: 'text-amber-400' };
    return { label: 'HIGH RISK', color: 'text-red-400' };
  }
  if (value >= 85) return { label: 'OPTIMIZED', color: 'text-green-400' };
  if (value >= 60) return { label: 'STABLE', color: 'text-blue-400' };
  if (value >= 40) return { label: 'CAUTION', color: 'text-amber-400' };
  return { label: 'CRITICAL', color: 'text-red-400' };
}

const QuadrantCards: React.FC<QuadrantCardsProps> = ({ quadrants }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {quadrants.map(q => {
        const cfg = quadrantConfig[q.name] ?? quadrantConfig.Growth;
        const band = getRiskBand(q.name, q.value);
        const barWidth = q.name === 'Risk' ? (100 - q.value) : q.value;

        return (
          <div key={q.name} className={`${cfg.bg} border ${cfg.border} rounded-xl p-4 group transition-all hover:border-opacity-60`}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{q.name}</p>
                <p className="text-[8px] text-slate-700 font-mono mt-0.5">{cfg.label}</p>
              </div>
              <span className={`text-[9px] font-black uppercase ${band.color}`}>{band.label}</span>
            </div>
            <div className="flex items-end gap-2 mb-3">
              <span className={`text-3xl font-bold tabular-nums ${cfg.color}`}>{q.value}</span>
              <span className="text-slate-600 text-sm mb-0.5">/100</span>
            </div>
            <div className="w-full h-1 bg-slate-800/80 rounded-full overflow-hidden">
              <div
                className={`h-full ${cfg.bar} rounded-full transition-all duration-700`}
                style={{ width: `${barWidth}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default QuadrantCards;
