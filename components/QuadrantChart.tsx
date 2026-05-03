
import React, { useState, useEffect } from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip
} from 'recharts';
import { THEME } from '../constants';
import { QuadrantScore } from '../types';

interface QuadrantChartProps {
  data: QuadrantScore[];
}

const CustomAngleTick = (props: any) => {
  const { x, y, payload, cx, cy } = props;
  const dx = x - cx;
  const dy = y - cy;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  const entry = (props.data ?? []).find((d: QuadrantScore) => d.name === payload.value);
  const score = entry?.value ?? 0;

  const labelColor =
    payload.value === 'Risk'
      ? score <= 30 ? '#22c55e' : score <= 60 ? '#f59e0b' : '#ef4444'
      : score >= 80 ? '#22c55e' : score >= 55 ? '#D4AF37' : '#f59e0b';

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#94A3B8"
        fontSize={10}
        fontWeight={700}
        dy={-8}
      >
        {payload.value.toUpperCase()}
      </text>
      <text
        textAnchor="middle"
        dominantBaseline="middle"
        fill={labelColor}
        fontSize={11}
        fontWeight={900}
        dy={6}
      >
        {score}
      </text>
    </g>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload as QuadrantScore;
  if (!d) return null;
  return (
    <div className="bg-[#0a1628] border border-slate-800 rounded-xl px-4 py-3 shadow-xl">
      <p className="text-[10px] text-[#D4AF37] font-black uppercase tracking-widest mb-1">{d.name}</p>
      <p className="text-white font-bold text-lg tabular-nums">{d.value}<span className="text-slate-600 text-sm">/100</span></p>
      <p className="text-[10px] text-slate-500 mt-1 max-w-[160px] leading-relaxed">{d.description}</p>
    </div>
  );
};

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
      <ResponsiveContainer width="100%" height="100%" debounce={50}>
        <RadarChart cx="50%" cy="50%" outerRadius="65%" data={data}>
          <defs>
            <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1E40AF" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity={0.08} />
            </radialGradient>
          </defs>
          <PolarGrid stroke="#1e293b" strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="name"
            tick={(props) => <CustomAngleTick {...props} data={data} />}
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Score"
            dataKey="value"
            stroke={THEME.accent}
            strokeWidth={2}
            fill="url(#radarFill)"
            fillOpacity={1}
            dot={{ fill: THEME.accent, r: 4, strokeWidth: 0 }}
            activeDot={{ fill: THEME.accent, r: 6, strokeWidth: 2, stroke: '#fff' }}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default QuadrantChart;
