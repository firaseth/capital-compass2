
import React, { useState } from 'react';
import { MARKET_INDICATORS } from '../constants';
import IndicatorDetailModal from './IndicatorDetailModal';

const TrendUp = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
  </svg>
);

const TrendDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
  </svg>
);

const MarketOverview: React.FC = () => {
  const [selectedIndicator, setSelectedIndicator] = useState<typeof MARKET_INDICATORS[0] | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {MARKET_INDICATORS.map((indicator) => (
          <button
            key={indicator.label}
            onClick={() => setSelectedIndicator(indicator)}
            className="group relative bg-black/20 border border-slate-800/80 px-4 py-3.5 rounded-xl flex flex-col gap-0.5 transition-all hover:bg-[#D4AF37]/5 hover:border-[#D4AF37]/25 text-left overflow-hidden"
          >
            <div className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-gradient-to-r from-[#D4AF37] to-transparent transition-all duration-500 group-hover:w-full"></div>
            <span className="text-[9px] uppercase font-black text-slate-500 tracking-widest group-hover:text-slate-400 transition-colors">
              {indicator.label}
            </span>
            <div className="flex items-end justify-between mt-1">
              <span className="text-sm font-bold text-white group-hover:text-[#D4AF37] transition-colors tabular-nums">
                {indicator.value}
              </span>
              <div className={`flex items-center gap-0.5 text-[10px] font-bold ${indicator.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                {indicator.trend === 'up' ? <TrendUp /> : <TrendDown />}
                {indicator.change}
              </div>
            </div>
          </button>
        ))}
      </div>

      <IndicatorDetailModal
        indicator={selectedIndicator}
        onClose={() => setSelectedIndicator(null)}
      />
    </>
  );
};

export default MarketOverview;
