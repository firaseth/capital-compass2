
import React from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from 'recharts';
import { THEME } from '../constants';
import { QuadrantScore } from '../types';

interface QuadrantChartProps {
  data: QuadrantScore[];
}

const QuadrantChart: React.FC<QuadrantChartProps> = ({ data }) => {
  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#1e293b" />
          <PolarAngleAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 'bold' }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Score"
            dataKey="value"
            stroke={THEME.accent}
            fill={THEME.secondary} // Use the Compass Blue for the fill area
            fillOpacity={0.2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default QuadrantChart;
