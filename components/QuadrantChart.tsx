
import React, { useState, useEffect } from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from 'recharts';
import { THEME } from '../constants';
import { QuadrantScore } from '../types';

interface QuadrantChartProps {
  data: QuadrantScore[];
}

const QuadrantChart: React.FC<QuadrantChartProps> = ({ data }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  if (!mounted) {
    return <div className="w-full h-full min-h-[300px]" />;
  }

  return (
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="72%" data={data}>
          <defs>
            <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1E40AF" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity={0.05} />
            </radialGradient>
          </defs>
          <PolarGrid stroke="#1e293b" strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="name"
            tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 700 }}
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Score"
            dataKey="value"
            stroke={THEME.accent}
            strokeWidth={2}
            fill="url(#radarFill)"
            fillOpacity={1}
            dot={{ fill: THEME.accent, r: 3, strokeWidth: 0 }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default QuadrantChart;
