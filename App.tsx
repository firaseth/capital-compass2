
import React, { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import QuadrantChart from './components/QuadrantChart';
import GuardianChat from './components/GuardianChat';
import VideoAnalyzer from './components/VideoAnalyzer';
import PortfolioPerformance from './components/PortfolioPerformance';
import MarketOverview from './components/MarketOverview';
import QuickActions from './components/QuickActions';
import NotificationCenter from './components/NotificationCenter';
import Logo from './components/Logo';
import { THEME, INITIAL_QUADRANTS } from './constants';
import { AppSection, QuadrantScore } from './types';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AppSection>(AppSection.DASHBOARD);
  const [quadrants, setQuadrants] = useState<QuadrantScore[]>(INITIAL_QUADRANTS);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), 3000);
  };

  const resetQuadrants = () => {
    setQuadrants([...INITIAL_QUADRANTS]);
  };

  const totalScore = useMemo(() => {
    // Basic weighting logic: Growth(30), Stability(30), Liquidity(20), Risk(Inverse 20)
    const growth = quadrants.find(q => q.name === 'Growth')?.value || 0;
    const stability = quadrants.find(q => q.name === 'Stability')?.value || 0;
    const liquidity = quadrants.find(q => q.name === 'Liquidity')?.value || 0;
    const risk = quadrants.find(q => q.name === 'Risk')?.value || 0;
    
    const score = (growth * 0.3) + (stability * 0.3) + (liquidity * 0.2) + ((100 - risk) * 0.2);
    return Math.round(score * 10); // Scale to 1000
  }, [quadrants]);

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Top Indicators - Market Overview */}
      <div className="bg-[#081a1a] p-6 rounded-2xl border border-teal-900/30">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Global Market Intelligence</h3>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[9px] text-green-500 font-mono uppercase">Live Link Active</span>
          </div>
        </div>
        <MarketOverview />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Score and Performance */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#081a1a] p-8 rounded-2xl border border-teal-900/30 gold-glow relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-[10px] text-[#D4AF37] uppercase font-black tracking-widest mb-1">Capital Integrity Score</p>
                <h2 className="text-5xl font-bold text-white tracking-tighter">
                  {totalScore} <span className="text-lg text-[#D4AF37]/50 font-light ml-2">/ 1000</span>
                </h2>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-mono text-slate-500 block uppercase">SHA256_ACTIVE</span>
                <span className="text-green-400 text-sm font-bold">+12.4% MoM</span>
              </div>
            </div>
            <PortfolioPerformance />
          </div>

          <div className="bg-[#081a1a] p-8 rounded-2xl border border-teal-900/30">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-lg font-bold text-white uppercase tracking-widest">Feasibility Matrix</h3>
                <p className="text-[10px] text-slate-500 font-mono uppercase">Cross-Quadrant_Validation_Stable</p>
              </div>
              <button 
                onClick={resetQuadrants}
                className="text-[9px] uppercase font-bold text-[#D4AF37] border border-[#D4AF37]/30 px-4 py-1.5 rounded-full hover:bg-[#D4AF37]/10 transition-colors"
              >
                Regenerate Model
              </button>
            </div>
            <div className="h-[350px]">
              <QuadrantChart data={quadrants} />
            </div>
          </div>
        </div>

        {/* Right Column - Guardian & Context */}
        <div className="space-y-6">
          <div className="h-[450px]">
            <GuardianChat financialState={quadrants} />
          </div>
          
          <div className="bg-[#081a1a] p-6 rounded-2xl border border-teal-900/30">
            <h3 className="text-xs font-black text-[#D4AF37] uppercase tracking-widest mb-4">Quick Executive Actions</h3>
            <QuickActions onReset={resetQuadrants} onActionComplete={showToast} />
          </div>

          <div className="bg-[#081a1a] p-6 rounded-2xl border border-teal-900/30">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Guardian Audit Trail</h3>
            <NotificationCenter />
          </div>
        </div>
      </div>
    </div>
  );

  const renderMatrix = () => (
    <div className="bg-[#081a1a] p-8 rounded-2xl border border-teal-900/30">
      <h2 className="text-2xl font-bold text-white mb-8 tracking-widest uppercase">Matrix Deep Analysis</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {quadrants.map((q) => (
          <div key={q.name} className="p-8 bg-black/30 rounded-2xl border border-teal-900/20 hover:border-[#D4AF37]/40 transition-all group">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-[#D4AF37] font-bold uppercase tracking-widest text-sm">{q.name}</h4>
              <span className="text-3xl font-black text-white italic">{q.value}<span className="text-xs text-[#D4AF37] non-italic ml-1">%</span></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-6 font-medium">{q.description}</p>
            <div className="w-full bg-slate-900 h-1.5 rounded-full relative">
              <div 
                className="h-full bg-gradient-to-r from-[#8B732A] to-[#D4AF37] rounded-full transition-all duration-1000 group-hover:shadow-[0_0_15px_rgba(212,175,55,0.5)]" 
                style={{ width: `${q.value}%` }}
              ></div>
              <input 
                type="range"
                min="0"
                max="100"
                value={q.value}
                onChange={(e) => {
                  const newVal = parseInt(e.target.value);
                  setQuadrants(prev => prev.map(curr => curr.name === q.name ? { ...curr, value: newVal } : curr));
                }}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
            </div>
            <p className="text-[8px] mt-2 text-slate-600 uppercase font-mono italic">Adjust baseline value via slider</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#061616]">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <main className="flex-1 overflow-y-auto p-10 custom-scrollbar relative flex flex-col">
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-6">
             <div className="md:hidden">
               <Logo className="w-14 h-14" />
             </div>
             <div>
               <h2 className="text-2xl font-black text-white tracking-[0.2em] uppercase">
                 {activeSection === AppSection.DASHBOARD && 'Feasibility Suite'}
                 {activeSection === AppSection.MATRIX && 'Underwriting Analysis'}
                 {activeSection === AppSection.GUARDIAN && 'Intelligence Hub'}
                 {activeSection === AppSection.INGEST && 'Pipeline Control'}
                 {activeSection === AppSection.VIDEO_ANALYSIS && 'Asset Forensics'}
               </h2>
               <p className="text-[10px] text-[#D4AF37] font-bold tracking-[0.4em] mt-1 uppercase">Client_Tier: Institutional_Elite</p>
             </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-slate-900/50 border border-slate-800 rounded-full px-4 py-2 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[10px] font-mono font-bold text-slate-400">API_HEALTH: 99.9%</span>
            </div>
            <div className="w-12 h-12 rounded-2xl border border-teal-900/40 bg-black/20 p-1">
              <img src="https://picsum.photos/seed/institutional/100/100" className="w-full h-full rounded-xl grayscale hover:grayscale-0 transition-all duration-500 cursor-pointer" alt="profile" />
            </div>
          </div>
        </header>

        <div className="relative z-10 flex-1">
          {activeSection === AppSection.DASHBOARD && renderDashboard()}
          {activeSection === AppSection.MATRIX && renderMatrix()}
          {activeSection === AppSection.GUARDIAN && (
            <div className="h-[calc(100vh-280px)]">
              <GuardianChat financialState={quadrants} />
            </div>
          )}
          {activeSection === AppSection.INGEST && (
            <div className="flex items-center justify-center h-full">
              <div className="bg-[#081a1a] p-12 rounded-3xl border border-teal-900/30 text-center max-w-4xl shadow-2xl">
                <Logo className="w-24 h-24 mx-auto mb-8" />
                <h2 className="text-3xl font-bold text-white mb-3 tracking-widest uppercase">Data Acquisition Pipeline</h2>
                <p className="text-slate-500 text-sm mb-12 font-medium uppercase tracking-widest">SHA-256 Secured Ledger Synchronization</p>
                <div className="grid grid-cols-3 gap-6">
                  {['Financials', 'Social', 'Markets'].map(item => (
                    <div key={item} className="p-6 bg-black/40 border border-teal-900/20 rounded-2xl">
                      <span className="text-xs font-black text-white uppercase tracking-widest">{item}</span>
                      <p className="text-[9px] text-teal-600 mt-2 font-mono">SYNC_READY</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {activeSection === AppSection.VIDEO_ANALYSIS && <VideoAnalyzer />}
        </div>

        {/* Notification Toast */}
        {toast.visible && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-bounce">
            <div className="bg-[#D4AF37] text-slate-900 px-6 py-3 rounded-full shadow-2xl font-black uppercase text-xs tracking-widest flex items-center gap-3">
              <div className="w-2 h-2 bg-slate-900 rounded-full"></div>
              {toast.message}
            </div>
          </div>
        )}

        {/* Professional Footer */}
        <footer className="mt-12 py-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] uppercase tracking-widest font-black text-slate-600">
          <div className="flex gap-6">
            <span>© 2024 Capital Compass Ltd</span>
            <span>SEC-Compliant Architecture</span>
            <span className="text-[#D4AF37]/50">SHA-256 Verified</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Protocol</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Underwriting</a>
            <a href="#" className="hover:text-white transition-colors">Guardian Disclaimer</a>
          </div>
        </footer>

        {/* Watermark */}
        <div className="fixed bottom-0 right-0 p-10 opacity-[0.02] pointer-events-none select-none -z-10">
           <Logo className="w-[450px] h-[450px]" />
        </div>
      </main>
    </div>
  );
};

export default App;
