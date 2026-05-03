
import React from 'react';
import { QuadrantScore } from '../types';

interface QuadrantCardsProps {
  quadrants: QuadrantScore[];
}

const quadrantConfig: Record<string, {
  color: string; bg: string; border: string; bar: string; label: string; icon: string;
}> = {
  Growth:    { color: 'text-emerald-400', bg: 'bg-emerald-500/5',  border: 'border-emerald-900/30', bar: 'bg-emerald-500', label: '35% Weight',               icon: '↗' },
  Stability: { color: 'text-blue-400',    bg: 'bg-blue-500/5',     border: 'border-blue-900/30',    bar: 'bg-blue-500',    label: '30% Weight',               icon: '⟳' },
  Liquidity: { color: 'text-[#D4AF37]',   bg: 'bg-yellow-500/5',   border: 'border-yellow-900/30',  bar: 'bg-[#D4AF37]',   label: '20% Weight',               icon: '◈' },
  Risk:      { color: 'text-rose-400',    bg: 'bg-rose-500/5',     border: 'border-rose-900/30',    bar: 'bg-rose-500',    label: '15% Weight · Inverse',     icon: '⚡' },
};

function getRiskBand(name: string, value: number): { label: string; color: string; dot: string } {
  if (name === 'Risk') {
    if (value <= 30) return { label: 'LOW RISK',  color: 'text-green-400',  dot: 'bg-green-400' };
    if (value <= 60) return { label: 'MED RISK',  color: 'text-amber-400',  dot: 'bg-amber-400' };
    return              { label: 'HIGH RISK', color: 'text-red-400',    dot: 'bg-red-400 animate-pulse' };
  }
  if (value >= 85) return { label: 'OPTIMIZED', color: 'text-green-400',  dot: 'bg-green-400' };
  if (value >= 60) return { label: 'STABLE',    color: 'text-blue-400',   dot: 'bg-blue-400' };
  if (value >= 40) return { label: 'CAUTION',   color: 'text-amber-400',  dot: 'bg-amber-400 animate-pulse' };
  return              { label: 'CRITICAL',  color: 'text-red-400',    dot: 'bg-red-400 animate-pulse' };
}

const MiniBar: React.FC<{ value: number; color: string; inverse?: boolean }> = ({ value, color, inverse }) => {
  const segments = 10;
  const filled = Math.round((inverse ? 100 - value : value) / segments);
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: segments }).map((_, i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded-full transition-all duration-500 ${i < filled ? color : 'bg-slate-800'}`}
        />
      ))}
    </div>
  );
};

const QuadrantCards: React.FC<QuadrantCardsProps> = ({ quadrants }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {quadrants.map(q => {
        const cfg = quadrantConfig[q.name] ?? quadrantConfig.Growth;
        const band = getRiskBand(q.name, q.value);
        const isRisk = q.name === 'Risk';

        return (
          <div
            key={q.name}
            className={`${cfg.bg} border ${cfg.border} rounded-xl p-4 group transition-all hover:border-opacity-60 relative overflow-hidden`}
          >
            {/* Subtle corner glow */}
            <div
              className="absolute top-0 right-0 w-16 h-16 pointer-events-none rounded-bl-full opacity-30"
              style={{ background: `radial-gradient(circle at top right, ${cfg.color.includes('emerald') ? '#10b981' : cfg.color.includes('blue') ? '#3b82f6' : cfg.color.includes('D4AF37') ? '#D4AF37' : '#f43f5e'}22 0%, transparent 70%)` }}
            />

            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                  <span className={`${cfg.color} opacity-70`}>{cfg.icon}</span>
                  {q.name}
                </p>
                <p className="text-[8px] text-slate-700 font-mono mt-0.5">{cfg.label}</p>
              </div>
              <div className="flex items-center gap-1">
                <div className={`w-1.5 h-1.5 rounded-full ${band.dot}`}></div>
                <span className={`text-[9px] font-black uppercase ${band.color}`}>{band.label}</span>
              </div>
            </div>

            <div className="flex items-end gap-2 mb-3">
              <span className={`text-3xl font-bold tabular-nums ${cfg.color}`}>{q.value}</span>
              <span className="text-slate-600 text-sm mb-0.5">/100</span>
              {/* Trend arrow */}
              <span className={`ml-auto text-base font-black mb-0.5 ${isRisk ? (q.value <= 30 ? 'text-green-400' : 'text-red-400') : (q.value >= 70 ? 'text-green-400' : 'text-amber-400')}`}>
                {isRisk ? (q.value <= 30 ? '↓' : '↑') : (q.value >= 70 ? '↑' : '↓')}
              </span>
            </div>

            <MiniBar value={q.value} color={cfg.bar} inverse={isRisk} />
          </div>
        );
      })}
    </div>
  );
};

export default QuadrantCards;
