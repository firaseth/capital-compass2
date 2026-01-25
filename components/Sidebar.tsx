
import React from 'react';
import { ICONS, THEME } from '../constants';
import { AppSection } from '../types';
import Logo from './Logo';

interface SidebarProps {
  activeSection: AppSection;
  setActiveSection: (section: AppSection) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection }) => {
  const menuItems = [
    { id: AppSection.DASHBOARD, label: 'Capital Overview', icon: <ICONS.Dashboard /> },
    { id: AppSection.MATRIX, label: '4-Quadrant Matrix', icon: <ICONS.Matrix /> },
    { id: AppSection.GUARDIAN, label: 'Guardian Agent', icon: <ICONS.Guardian /> },
    { id: AppSection.VIDEO_ANALYSIS, label: 'Video Intelligence', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ) },
    { id: AppSection.INGEST, label: 'Data Ingestion', icon: <ICONS.Ingest /> },
  ];

  return (
    <div className="w-72 h-full flex flex-col border-r border-slate-800 p-6 bg-[#040812] z-20">
      <div className="flex flex-col items-center gap-4 mb-12 px-2 relative min-h-[180px] justify-center">
        <div className="absolute inset-0 logo-gradient pointer-events-none -top-10"></div>
        <div className="relative group transition-transform duration-500 hover:scale-105">
          <div className="absolute -inset-6 bg-[#D4AF37] rounded-full blur-3xl opacity-5 group-hover:opacity-10 transition duration-1000"></div>
          <Logo className="w-32 h-32 relative" />
        </div>
        <div className="text-center mt-4">
          <h1 className="text-xl font-bold tracking-[0.1em] uppercase flex flex-col">
            <span className="text-[#1E40AF]">Capital</span>
            <span className="text-[#D4AF37] -mt-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">Compass</span>
          </h1>
          <p className="text-[8px] uppercase tracking-[0.2em] text-slate-400 mt-2 font-black">NAVIGATE VALUE. SECURE CAPITAL</p>
        </div>
      </div>

      <nav className="flex-1 space-y-3">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-300 border ${
              activeSection === item.id
                ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30 shadow-[0_0_15px_rgba(212,175,55,0.1)]'
                : 'text-slate-400 hover:bg-white/5 hover:text-white border-transparent'
            }`}
          >
            <span className={activeSection === item.id ? 'text-[#D4AF37]' : 'text-slate-500'}>
              {item.icon}
            </span>
            <span className="font-bold text-[11px] uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto p-5 bg-slate-900/40 rounded-2xl border border-slate-800 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-2 h-2 rounded-full bg-[#1E40AF] animate-pulse shadow-[0_0_10px_#1E40AF]"></div>
          <span className="text-[9px] uppercase font-black text-slate-400 tracking-[0.1em]">Veracity Lock: SHA-256</span>
        </div>
        <p className="text-[10px] text-slate-500 leading-relaxed font-semibold uppercase tracking-tighter">
          Institutional Integrity Shield
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
