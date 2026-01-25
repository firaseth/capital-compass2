
import React from 'react';
import { MARKET_INDICATORS } from '../constants';

const MarketOverview: React.FC = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {MARKET_INDICATORS.map((indicator) => (
        <div key={indicator.label} className="bg-black/20 border border-slate-800 p-4 rounded-xl flex flex-col gap-1 transition-all hover:bg-black/40">
          <span className="text-[9px] uppercase font-black text-slate-500 tracking-widest">{indicator.label}</span>
          <div className="flex justify-between items-end">
            <span className="text-sm font-bold text-white">{indicator.value}</span>
            <span className={`text-[10px] font-bold ${indicator.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
              {indicator.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MarketOverview;
