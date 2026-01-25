
import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { PERFORMANCE_DATA, THEME } from '../constants';

const PortfolioPerformance: React.FC = () => {
  return (
    <div className="w-full h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={PERFORMANCE_DATA}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={THEME.accent} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={THEME.accent} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis 
            dataKey="month" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 10 }}
          />
          <YAxis 
            hide={true}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0B1222', border: '1px solid #334155', borderRadius: '8px', fontSize: '10px' }}
            itemStyle={{ color: THEME.accent }}
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
  );
};

export default PortfolioPerformance;
