
import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "w-24 h-24" }) => {
  return (
    <div className={`${className} flex items-center justify-center`}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_16px_rgba(212,175,55,0.5)]">
        <defs>
          <radialGradient id="goldGrad" cx="50%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#FFF4D6" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#8B732A" />
          </radialGradient>
          <radialGradient id="goldGradInner" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF4D6" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.4" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <path
          d="M50 4 L59 32 L88 32 L65 50 L74 78 L50 61 L26 78 L35 50 L12 32 L41 32 Z"
          fill="url(#goldGrad)"
          filter="url(#glow)"
        />
        <circle cx="50" cy="50" r="11" fill="#040812" stroke="#D4AF37" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="7" fill="none" stroke="#D4AF37" strokeWidth="0.5" strokeOpacity="0.5" />
        <line x1="50" y1="43" x2="50" y2="57" stroke="#D4AF37" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="43" y1="50" x2="57" y2="50" stroke="#D4AF37" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="50" cy="50" r="2" fill="url(#goldGradInner)" />
      </svg>
    </div>
  );
};

export default Logo;
