
import React, { useState } from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "w-24 h-24" }) => {
  const [error, setError] = useState(false);
  
  // URL to the new metallic compass and bar chart brand asset
  const BRAND_LOGO_URL = "https://r.jina.ai/i/427909b867be4e0497551bc97858c7e0";

  if (error) {
    return (
      <div className={`${className} flex items-center justify-center`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_12px_rgba(212,175,55,0.6)]">
          <defs>
            <radialGradient id="goldGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFF4D6" />
              <stop offset="60%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#8B732A" />
            </radialGradient>
          </defs>
          <path 
            d="M50 5 L58 35 L90 42 L62 55 L70 85 L50 65 L30 85 L38 55 L10 42 L42 35 Z" 
            fill="url(#goldGrad)" 
            className="animate-pulse"
          />
          <circle cx="50" cy="50" r="10" fill="#061616" stroke="#D4AF37" strokeWidth="1.5" />
          <path d="M50 44 L50 56 M44 50 L56 50" stroke="#D4AF37" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  return (
    <div className={`${className} relative flex items-center justify-center overflow-visible`}>
      {/* Dynamic glow effect that matches the new logo's metallic lighting */}
      <div className="absolute inset-0 bg-[#D4AF37]/5 rounded-full blur-2xl scale-125 opacity-40"></div>
      <img 
        src={BRAND_LOGO_URL} 
        alt="Capital Compass" 
        className="w-full h-full object-contain relative z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] transition-all duration-700"
        onLoad={(e) => {
          (e.target as HTMLImageElement).classList.add('opacity-100');
        }}
        onError={() => {
          console.warn("Primary logo URL failed, showing SVG fallback...");
          setError(true);
        }}
      />
    </div>
  );
};

export default Logo;
