
import React from 'react';
import { ICONS, THEME } from '../constants';
import { AppSection } from '../types';
import Logo from './Logo';

interface SidebarProps {
  activeSection: AppSection;
  setActiveSection: (section: AppSection) => void;
}

const VideoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection }) => {
  const menuItems = [
    { id: AppSection.DASHBOARD, label: 'Capital Overview', icon: <ICONS.Dashboard /> },
    { id: AppSection.MATRIX, label: 'Underwriting Matrix', icon: <ICONS.Matrix /> },
    { id: AppSection.ASSETS, label: 'Asset Ledger', icon: <ICONS.Assets /> },
    { id: AppSection.GUARDIAN, label: 'Guardian AI', icon: <ICONS.Guardian /> },
    { id: AppSection.VIDEO_ANALYSIS, label: 'Asset Forensics', icon: <VideoIcon /> },
    { id: AppSection.INGEST, label: 'Data Ingestion', icon: <ICONS.Ingest /> },
  ];

  return (
    <div className="w-64 h-full flex flex-col border-r border-slate-800/70 bg-[#040812] z-20 flex-shrink-0">
      <div className="flex flex-col items-center gap-3 pt-8 pb-8 px-6 border-b border-slate-800/50 relative">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.06) 0%, transparent 70%)' }}></div>
        <div className="relative group">
          <div className="absolute -inset-4 bg-[#D4AF37] rounded-full blur-3xl opacity-[0.07] group-hover:opacity-[0.12] transition-all duration-1000"></div>
          <Logo className="w-20 h-20 relative" />
        </div>
        <div className="text-center">
          <h1 className="text-base font-bold tracking-[0.12em] uppercase leading-tight">
            <span className="text-[#1E40AF] block">Capital</span>
            <span className="text-[#D4AF37] block drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">Compass</span>
          </h1>
          <p className="text-[8px] uppercase tracking-[0.25em] text-slate-500 mt-2 font-black">Navigate Value. Secure Capital</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-5 space-y-1">
        <p className="text-[8px] uppercase tracking-[0.2em] text-slate-600 font-black px-3 mb-3">Navigation</p>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 border ${
              activeSection === item.id
                ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/25 shadow-[0_0_12px_rgba(212,175,55,0.08)]'
                : 'text-slate-500 hover:bg-white/4 hover:text-slate-200 border-transparent'
            }`}
          >
            <span className={`flex-shrink-0 transition-colors ${activeSection === item.id ? 'text-[#D4AF37]' : 'text-slate-600'}`}>
              {item.icon}
            </span>
            <span className="font-bold text-[10px] uppercase tracking-widest truncate">{item.label}</span>
            {activeSection === item.id && (
              <div className="ml-auto w-1 h-1 rounded-full bg-[#D4AF37] flex-shrink-0"></div>
            )}
          </button>
        ))}
      </nav>

      <div className="px-4 pb-6">
        <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800/60">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#1E40AF] animate-pulse shadow-[0_0_8px_#1E40AF]"></div>
            <span className="text-[8px] uppercase font-black text-slate-400 tracking-[0.15em]">Veracity Lock: SHA-256</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 h-[2px] bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full w-[94%] bg-gradient-to-r from-[#1E40AF] to-[#D4AF37] rounded-full"></div>
            </div>
            <span className="text-[8px] font-mono text-[#D4AF37]">94%</span>
          </div>
          <p className="text-[9px] text-slate-600 mt-2 font-semibold uppercase tracking-tight">
            Institutional Feasibility Tool
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
