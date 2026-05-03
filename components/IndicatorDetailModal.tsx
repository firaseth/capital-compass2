
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { INDICATOR_DETAILS, THEME } from '../constants';

interface IndicatorDetailModalProps {
  indicator: { label: string; value: string; change: string; trend: string } | null;
  onClose: () => void;
}

const IndicatorDetailModal: React.FC<IndicatorDetailModalProps> = ({ indicator, onClose }) => {
  if (!indicator) return null;

  const details = INDICATOR_DETAILS[indicator.label];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-4xl bg-[#0B1222] border border-[#D4AF37]/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/40">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-black text-white tracking-widest uppercase">{indicator.label}</h2>
              <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                indicator.trend === 'up' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
              }`}>
                {indicator.change}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase tracking-widest">Global Intelligence Core: Live Feed Active</p>
          </div>
          <button 
            onClick={onClose}
            className="p-3 text-slate-500 hover:text-white hover:bg-white/5 rounded-full transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3">
          {/* Main Chart Area */}
          <div className="lg:col-span-2 p-8 bg-black/20">
            <div className="flex justify-between items-end mb-8">
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Current Underwriting Value</p>
                <p className="text-5xl font-black text-white">{indicator.value}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">5-Day Trend</p>
                <div className="flex gap-1 mt-1 justify-end">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className={`w-2 h-4 rounded-sm ${i === 5 ? 'bg-[#D4AF37]' : 'bg-slate-800'}`}></div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%" debounce={50}>
                <AreaChart data={details?.history || []}>
                  <defs>
                    <linearGradient id="detailGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={THEME.accent} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={THEME.accent} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }}
                  />
                  <YAxis 
                    hide={true}
                    domain={['auto', 'auto']}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0B1222', border: '1px solid #334155', borderRadius: '12px', fontSize: '10px' }}
                    itemStyle={{ color: THEME.accent }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke={THEME.accent} 
                    fillOpacity={1} 
                    fill="url(#detailGrad)" 
                    strokeWidth={3}
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Intelligence Feed */}
          <div className="p-8 border-l border-slate-800 bg-[#070b14]">
            <h3 className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest mb-6">Market Intelligence</h3>
            <div className="space-y-6">
              {details?.news.map((n, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] text-[#1E40AF] font-black uppercase tracking-widest">{n.source}</span>
                    <span className="text-[9px] text-slate-500 font-mono">{n.time}</span>
                  </div>
                  <p className="text-xs text-white font-bold leading-relaxed group-hover:text-[#D4AF37] transition-colors line-clamp-2">
                    {n.title}
                  </p>
                  <div className="mt-3 w-0 group-hover:w-full h-[1px] bg-[#D4AF37]/50 transition-all duration-500"></div>
                </div>
              ))}
              
              <div className="pt-6 border-t border-slate-800/50">
                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                  <p className="text-[9px] text-slate-500 uppercase font-black mb-2">Guardian Forecast</p>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                    "Underwriting models suggest a period of low volatility stabilization. Veracity checks on {indicator.label} liquidity pools remain at 99.4% integrity."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-slate-900/80 border-t border-slate-800 text-center">
          <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.3em]">Institutional Verification Lock: sha256_verified_intel</p>
        </div>
      </div>
    </div>
  );
};

export default IndicatorDetailModal;
