
import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { PERFORMANCE_DATA, THEME } from '../constants';

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
    <div className="w-full h-[220px]">
      <ResponsiveContainer width="100%" height="100%" debounce={50}>
        <AreaChart data={PERFORMANCE_DATA} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={THEME.accent} stopOpacity={0.25} />
              <stop offset="95%" stopColor={THEME.accent} stopOpacity={0} />
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
          <Tooltip
            contentStyle={{
              backgroundColor: '#0a1628',
              border: '1px solid #1e293b',
              borderRadius: '8px',
              fontSize: '10px',
              color: '#94a3b8',
            }}
            itemStyle={{ color: THEME.accent }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={THEME.accent}
            fillOpacity={1}
            fill="url(#colorValue)"
            strokeWidth={1.5}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PortfolioPerformance;
