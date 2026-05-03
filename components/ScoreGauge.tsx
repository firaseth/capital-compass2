
import React from 'react';

interface ScoreGaugeProps {
  score: number;
  max?: number;
  size?: number;
}

const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, max = 1000, size = 120 }) => {
  const pct = Math.min(score / max, 1);
  const strokeWidth = 8;
  const radius = (size - strokeWidth * 2) / 2;
  const cx = size / 2;
  const cy = size / 2;

  // Arc spans 220 degrees (from 160deg to 20deg clockwise)
  const startAngle = 160;
  const totalAngle = 220;
  const endAngle = startAngle + totalAngle * pct;

  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const arcPath = (start: number, end: number) => {
    const s = { x: cx + radius * Math.cos(toRad(start)), y: cy + radius * Math.sin(toRad(start)) };
    const e = { x: cx + radius * Math.cos(toRad(end)), y: cy + radius * Math.sin(toRad(end)) };
    const large = end - start > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${radius} ${radius} 0 ${large} 1 ${e.x} ${e.y}`;
  };

  const trackEnd = startAngle + totalAngle;

  const arcColor =
    pct >= 0.8 ? '#22c55e'
    : pct >= 0.65 ? '#D4AF37'
    : pct >= 0.45 ? '#f59e0b'
    : '#ef4444';

  const tickAngles = [160, 215, 270, 325, 380];

  return (
    <svg width={size} height={size * 0.72} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
      {/* Track */}
      <path
        d={arcPath(startAngle, trackEnd)}
        fill="none"
        stroke="#1e293b"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Tick marks */}
      {tickAngles.map((angle, i) => {
        const inner = radius - strokeWidth / 2 - 3;
        const outer = radius + strokeWidth / 2 + 3;
        return (
          <line
            key={i}
            x1={cx + inner * Math.cos(toRad(angle))}
            y1={cy + inner * Math.sin(toRad(angle))}
            x2={cx + outer * Math.cos(toRad(angle))}
            y2={cy + outer * Math.sin(toRad(angle))}
            stroke="#334155"
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        );
      })}
      {/* Filled arc */}
      {pct > 0 && (
        <path
          d={arcPath(startAngle, endAngle)}
          fill="none"
          stroke={arcColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${arcColor}66)` }}
        />
      )}
      {/* Needle dot */}
      {pct > 0 && (
        <circle
          cx={cx + radius * Math.cos(toRad(endAngle))}
          cy={cy + radius * Math.sin(toRad(endAngle))}
          r={strokeWidth / 2 + 1}
          fill={arcColor}
          style={{ filter: `drop-shadow(0 0 4px ${arcColor})` }}
        />
      )}
    </svg>
  );
};

export default ScoreGauge;
