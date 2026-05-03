
import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { PERFORMANCE_DATA, THEME } from '../constants';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const fmt = (v: number) => `$${(v / 1000).toFixed(0)}k`;
  return (
    <div className="bg-[#0a1628] border border-slate-800 rounded-xl px-4 py-3 shadow-xl text-[10px]">
      <p className="text-slate-500 font-black uppercase tracking-widest mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }}></div>
          <span className="text-slate-400 capitalize">{p.name === 'value' ? 'Portfolio' : 'Benchmark'}</span>
          <span className="font-black ml-auto" style={{ color: p.color }}>{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

const PortfolioPerformance: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  if (!mounted) {
    return <div className="w-full h-[220px]" />;
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 rounded-full bg-[#D4AF37]"></div>
            <span className="text-[9px] text-slate-500 font-mono uppercase">Portfolio</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 rounded-full bg-[#1E40AF]" style={{ borderStyle: 'dashed' }}></div>
            <span className="text-[9px] text-slate-500 font-mono uppercase">Benchmark</span>
          </div>
        </div>
        <span className="text-[9px] text-green-400 font-black font-mono">+69.3% YTD</span>
      </div>
      <div className="h-[230px]">
        <ResponsiveContainer width="100%" height="100%" debounce={50}>
          <AreaChart data={PERFORMANCE_DATA} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={THEME.accent} stopOpacity={0.22} />
                <stop offset="95%" stopColor={THEME.accent} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorBenchmark" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1E40AF" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#1E40AF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#475569', fontSize: 10 }}
            />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="benchmark"
              stroke="#1E40AF"
              strokeWidth={1.5}
              strokeDasharray="4 3"
              fillOpacity={1}
              fill="url(#colorBenchmark)"
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={THEME.accent}
              fillOpacity={1}
              fill="url(#colorValue)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PortfolioPerformance;
