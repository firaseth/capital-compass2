
import React, { useState } from 'react';
import { MARKET_INDICATORS } from '../constants';
import IndicatorDetailModal from './IndicatorDetailModal';

const MarketOverview: React.FC = () => {
  const [selectedIndicator, setSelectedIndicator] = useState<typeof MARKET_INDICATORS[0] | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {MARKET_INDICATORS.map((indicator) => (
          <button 
            key={indicator.label} 
            onClick={() => setSelectedIndicator(indicator)}
            className="group relative bg-black/20 border border-slate-800 p-4 rounded-xl flex flex-col gap-1 transition-all hover:bg-[#D4AF37]/5 hover:border-[#D4AF37]/30 text-left overflow-hidden"
          >
            {/* Hover indicator line */}
            <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#D4AF37] transition-all duration-500 group-hover:w-full"></div>
            
            <div className="flex justify-between items-center mb-1">
              <span className="text-[9px] uppercase font-black text-slate-500 tracking-widest group-hover:text-slate-300 transition-colors">
                {indicator.label}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            
            <div className="flex justify-between items-end">
              <span className="text-sm font-bold text-white group-hover:text-[#D4AF37] transition-colors">{indicator.value}</span>
              <span className={`text-[10px] font-bold ${indicator.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {indicator.change}
              </span>
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
