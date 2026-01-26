
import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import QuadrantChart from './components/QuadrantChart';
import GuardianChat from './components/GuardianChat';
import VideoAnalyzer from './components/VideoAnalyzer';
import PortfolioPerformance from './components/PortfolioPerformance';
import MarketOverview from './components/MarketOverview';
import QuickActions from './components/QuickActions';
import NotificationCenter from './components/NotificationCenter';
import AssetRegistry from './components/AssetRegistry';
import Logo from './components/Logo';
import { THEME, INITIAL_QUADRANTS } from './constants';
import { AppSection, QuadrantScore, Scenario } from './types';
import { generateFeasibilityReport } from './services/geminiService';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AppSection>(AppSection.DASHBOARD);
  const [quadrants, setQuadrants] = useState<QuadrantScore[]>(INITIAL_QUADRANTS);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [isMidnight, setIsMidnight] = useState(() => {
    return localStorage.getItem('theme-midnight') === 'true';
  });

  useEffect(() => {
    if (isMidnight) {
      document.body.classList.add('midnight');
    } else {
      document.body.classList.remove('midnight');
    }
    localStorage.setItem('theme-midnight', isMidnight.toString());
  }, [isMidnight]);

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), 3000);
  };

  const resetQuadrants = () => {
    setQuadrants([...INITIAL_QUADRANTS]);
    setReport(null);
  };

  const totalScore = useMemo(() => {
    const growth = quadrants.find(q => q.name === 'Growth')?.value || 0;
    const stability = quadrants.find(q => q.name === 'Stability')?.value || 0;
    const liquidity = quadrants.find(q => q.name === 'Liquidity')?.value || 0;
    const risk = quadrants.find(q => q.name === 'Risk')?.value || 0;
    
    const score = (growth * 0.35) + (stability * 0.3) + (liquidity * 0.2) + ((100 - risk) * 0.15);
    return Math.round(score * 10);
  }, [quadrants]);

  const saveScenario = () => {
    const name = `Snapshot ${scenarios.length + 1}`;
    const newScenario: Scenario = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      quadrants: [...quadrants],
      score: totalScore,
      timestamp: Date.now()
    };
    setScenarios([newScenario, ...scenarios]);
    showToast(`Scenario "${name}" saved to underwriting history.`);
  };

  const loadScenario = (scenario: Scenario) => {
    setQuadrants([...scenario.quadrants]);
    showToast(`Loaded ${scenario.name}`);
  };

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    const stateStr = quadrants.map(q => `${q.name}: ${q.value}/100`).join(', ');
    const reportText = await generateFeasibilityReport(stateStr);
    setReport(reportText || "Failed to generate AI underwriting report.");
    setIsGeneratingReport(false);
    showToast("Feasibility report finalized.");
  };

  const toggleTheme = () => {
    setIsMidnight(!isMidnight);
    showToast(isMidnight ? 'Switching to Slate Navy variant.' : 'Midnight Onyx theme activated.');
  };

  const renderDashboard = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-[#081a1a] p-6 rounded-2xl border border-teal-900/30">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Global Market Context</h3>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[9px] text-green-500 font-mono uppercase">Feasibility Sync Active</span>
          </div>
        </div>
        <MarketOverview />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#081a1a] p-8 rounded-2xl border border-teal-900/30 gold-glow relative overflow-hidden group">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-[10px] text-[#D4AF37] uppercase font-black tracking-widest mb-1">Total Feasibility Index</p>
                <h2 className="text-6xl font-bold text-white tracking-tighter">
                  {totalScore} <span className="text-xl text-[#D4AF37]/50 font-light ml-2">/ 1000</span>
                </h2>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-mono text-slate-500 block uppercase">Confidence Interval</p>
                <span className="text-green-400 text-lg font-bold">94.2%</span>
              </div>
            </div>
            <PortfolioPerformance />
            
            <div className="mt-8 pt-6 border-t border-slate-800 flex justify-between items-center">
              <div className="flex gap-8">
                <div>
                  <p className="text-[9px] text-slate-500 uppercase font-black">Target ROI</p>
                  <p className="text-white font-bold">18.4%</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-500 uppercase font-black">Payback</p>
                  <p className="text-white font-bold">14.2 Mo</p>
                </div>
              </div>
              <button 
                onClick={handleGenerateReport}
                disabled={isGeneratingReport}
                className="bg-[#D4AF37] text-slate-900 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#B8962F] transition-all disabled:opacity-50"
              >
                {isGeneratingReport ? 'Compiling Analysis...' : 'Generate AI Executive Summary'}
              </button>
            </div>
          </div>

          {report && (
            <div className="bg-[#0b2222] p-8 rounded-2xl border border-[#D4AF37]/30 animate-in slide-in-from-bottom duration-700">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-[#D4AF37] uppercase tracking-widest">Executive Feasibility Summary</h3>
                <button onClick={() => setReport(null)} className="text-slate-500 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <div className="text-sm text-slate-300 leading-relaxed font-medium whitespace-pre-wrap max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                {report}
              </div>
            </div>
          )}

          <div className="bg-[#081a1a] p-8 rounded-2xl border border-teal-900/30">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-lg font-bold text-white uppercase tracking-widest">Underwriting Radar</h3>
                <p className="text-[10px] text-slate-500 font-mono uppercase">Multi-Factor Weighting Matrix</p>
              </div>
              <div className="flex gap-3">
                <button onClick={saveScenario} className="text-[9px] uppercase font-bold text-white bg-slate-800 px-4 py-1.5 rounded-full hover:bg-slate-700 transition-colors">
                  Save Snapshot
                </button>
                <button onClick={resetQuadrants} className="text-[9px] uppercase font-bold text-[#D4AF37] border border-[#D4AF37]/30 px-4 py-1.5 rounded-full hover:bg-[#D4AF37]/10 transition-colors">
                  Reset Model
                </button>
              </div>
            </div>
            <div className="h-[350px]">
              <QuadrantChart data={quadrants} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="h-[450px]">
            <GuardianChat financialState={quadrants} />
          </div>
          
          {scenarios.length > 0 && (
            <div className="bg-[#081a1a] p-6 rounded-2xl border border-teal-900/30">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Underwriting History</h3>
              <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
                {scenarios.map(s => (
                  <button key={s.id} onClick={() => loadScenario(s)} className="w-full p-3 bg-slate-900/40 border border-slate-800 rounded-xl hover:border-[#D4AF37]/40 transition-all flex justify-between items-center group">
                    <div className="text-left">
                      <p className="text-[10px] font-black text-white uppercase group-hover:text-[#D4AF37]">{s.name}</p>
                      <p className="text-[8px] text-slate-600 font-mono">{new Date(s.timestamp).toLocaleTimeString()}</p>
                    </div>
                    <span className="text-xs font-black text-[#D4AF37]">{s.score}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="bg-[#081a1a] p-6 rounded-2xl border border-teal-900/30">
            <h3 className="text-xs font-black text-[#D4AF37] uppercase tracking-widest mb-4">Underwriting Controls</h3>
            <QuickActions onReset={resetQuadrants} onActionComplete={showToast} />
          </div>

          <div className="bg-[#081a1a] p-6 rounded-2xl border border-teal-900/30">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Veracity Stream</h3>
            <NotificationCenter />
          </div>
        </div>
      </div>
    </div>
  );

  const renderMatrix = () => (
    <div className="space-y-8 animate-in slide-in-from-right duration-500">
      <div className="bg-[#081a1a] p-8 rounded-2xl border border-teal-900/30">
        <h2 className="text-2xl font-bold text-white mb-2 tracking-widest uppercase">Sensitivity Analysis Tool</h2>
        <p className="text-xs text-slate-500 uppercase font-black tracking-widest mb-8">Model impact on capital integrity in real-time</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {quadrants.map((q) => (
            <div key={q.name} className="p-8 bg-black/30 rounded-2xl border border-teal-900/20 hover:border-[#D4AF37]/40 transition-all group">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h4 className="text-[#D4AF37] font-bold uppercase tracking-widest text-sm">{q.name}</h4>
                  <p className="text-[9px] text-slate-500 mt-1 uppercase font-black">Weight: {q.name === 'Growth' ? '35%' : q.name === 'Stability' ? '30%' : q.name === 'Liquidity' ? '20%' : '15%'}</p>
                </div>
                <span className="text-4xl font-black text-white italic">{q.value}<span className="text-xs text-[#D4AF37] non-italic ml-1">%</span></span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-6 font-medium h-8">{q.description}</p>
              <div className="w-full bg-slate-900 h-1.5 rounded-full relative">
                <div 
                  className="h-full bg-gradient-to-r from-[#8B732A] to-[#D4AF37] rounded-full transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(212,175,55,0.5)]" 
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
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                />
              </div>
              <div className="mt-4 flex justify-between text-[8px] text-slate-600 uppercase font-mono">
                <span>Critical Threshold: 40%</span>
                <span>Optimized Zone: 85%+</span>
              </div>
            </div>
          ))}
        </div>
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
                 {activeSection === AppSection.MATRIX && 'Sensitivity Matrix'}
                 {activeSection === AppSection.ASSETS && 'Institutional Assets'}
                 {activeSection === AppSection.GUARDIAN && 'Guardian Intelligence'}
                 {activeSection === AppSection.INGEST && 'Pipeline Control'}
                 {activeSection === AppSection.VIDEO_ANALYSIS && 'Asset Forensics'}
               </h2>
               <p className="text-[10px] text-[#D4AF37] font-bold tracking-[0.4em] mt-1 uppercase">Client_Tier: Institutional_Elite</p>
             </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800 text-slate-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition-all flex items-center justify-center group"
              title="Toggle Deeper Dark Mode"
            >
              {isMidnight ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
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
          {activeSection === AppSection.ASSETS && <AssetRegistry />}
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

        {toast.visible && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom duration-300">
            <div className="bg-[#D4AF37] text-slate-900 px-6 py-3 rounded-full shadow-2xl font-black uppercase text-xs tracking-widest flex items-center gap-3">
              <div className="w-2 h-2 bg-slate-900 rounded-full"></div>
              {toast.message}
            </div>
          </div>
        )}

        <footer className="mt-12 py-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] uppercase tracking-widest font-black text-slate-600">
          <div className="flex gap-6">
            <span>© 2024 Capital Compass Ltd</span>
            <span>Institutional-Grade Feasibility Engine</span>
            <span className="text-[#D4AF37]/50">SHA-256 Verified Assets</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Risk Protocol</a>
            <a href="#" className="hover:text-white transition-colors">Compliance Hub</a>
            <a href="#" className="hover:text-white transition-colors">Underwriting Terms</a>
          </div>
        </footer>

        <div className="fixed bottom-0 right-0 p-10 opacity-[0.02] pointer-events-none select-none -z-10">
           <Logo className="w-[450px] h-[450px]" />
        </div>
      </main>
    </div>
  );
};

export default App;
