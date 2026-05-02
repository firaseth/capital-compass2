
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

  const sectionTitle: Record<AppSection, string> = {
    [AppSection.DASHBOARD]: 'Feasibility Suite',
    [AppSection.MATRIX]: 'Sensitivity Matrix',
    [AppSection.ASSETS]: 'Institutional Assets',
    [AppSection.GUARDIAN]: 'Guardian Intelligence',
    [AppSection.INGEST]: 'Pipeline Control',
    [AppSection.VIDEO_ANALYSIS]: 'Asset Forensics',
  };

  const renderDashboard = () => (
    <div className="space-y-5 animate-in fade-in duration-500">
      {/* Market Context */}
      <div className="bg-[#081a1a] px-5 py-4 rounded-2xl border border-teal-900/25">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Global Market Context</h3>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[9px] text-green-500 font-mono uppercase tracking-wider">Sync Active</span>
          </div>
        </div>
        <MarketOverview />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: charts */}
        <div className="lg:col-span-2 space-y-5">

          {/* Feasibility Index card */}
          <div className="bg-[#081a1a] p-6 rounded-2xl border border-teal-900/25 gold-glow relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none" style={{ background: 'radial-gradient(circle at top right, rgba(212,175,55,0.04) 0%, transparent 70%)' }}></div>
            <div className="flex justify-between items-start mb-5">
              <div>
                <p className="text-[9px] text-[#D4AF37] uppercase font-black tracking-widest mb-1">Total Feasibility Index</p>
                <div className="flex items-end gap-3">
                  <h2 className="text-5xl font-bold text-white tracking-tighter leading-none">{totalScore}</h2>
                  <span className="text-base text-slate-600 font-light mb-1">/ 1000</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-mono text-slate-500 block uppercase tracking-wider mb-1">Confidence</p>
                <span className="text-green-400 text-xl font-bold">94.2%</span>
              </div>
            </div>

            <PortfolioPerformance />

            <div className="mt-5 pt-4 border-t border-slate-800/70 flex justify-between items-center">
              <div className="flex gap-6">
                <div>
                  <p className="text-[9px] text-slate-500 uppercase font-black tracking-wider">Target ROI</p>
                  <p className="text-white font-bold mt-0.5">18.4%</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-500 uppercase font-black tracking-wider">Payback</p>
                  <p className="text-white font-bold mt-0.5">14.2 Mo</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-500 uppercase font-black tracking-wider">IRR</p>
                  <p className="text-white font-bold mt-0.5">22.1%</p>
                </div>
              </div>
              <button
                onClick={handleGenerateReport}
                disabled={isGeneratingReport}
                className="bg-[#D4AF37] text-slate-900 px-5 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-[#c9a730] transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isGeneratingReport ? (
                  <>
                    <div className="w-3 h-3 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                    Compiling...
                  </>
                ) : (
                  'Generate AI Summary'
                )}
              </button>
            </div>
          </div>

          {/* AI report */}
          {report && (
            <div className="bg-[#0b2222] p-6 rounded-2xl border border-[#D4AF37]/25 animate-in slide-in-from-bottom duration-500">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-[9px] text-[#D4AF37] uppercase font-black tracking-widest">Executive Feasibility Summary</p>
                </div>
                <button onClick={() => setReport(null)} className="text-slate-500 hover:text-white transition-colors p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <div className="text-sm text-slate-300 leading-relaxed font-medium whitespace-pre-wrap max-h-[280px] overflow-y-auto custom-scrollbar pr-2">
                {report}
              </div>
            </div>
          )}

          {/* Radar */}
          <div className="bg-[#081a1a] p-6 rounded-2xl border border-teal-900/25">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Underwriting Radar</h3>
                <p className="text-[9px] text-slate-500 font-mono uppercase tracking-wider mt-0.5">Multi-Factor Weighting Matrix</p>
              </div>
              <div className="flex gap-2">
                <button onClick={saveScenario} className="text-[9px] uppercase font-bold text-white bg-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-700 transition-colors">
                  Save Snapshot
                </button>
                <button onClick={resetQuadrants} className="text-[9px] uppercase font-bold text-[#D4AF37] border border-[#D4AF37]/30 px-3 py-1.5 rounded-lg hover:bg-[#D4AF37]/10 transition-colors">
                  Reset
                </button>
              </div>
            </div>
            <div className="h-[300px]">
              <QuadrantChart data={quadrants} />
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Guardian chat */}
          <div className="h-[420px]">
            <GuardianChat financialState={quadrants} />
          </div>

          {/* Scenario history */}
          {scenarios.length > 0 && (
            <div className="bg-[#081a1a] p-5 rounded-2xl border border-teal-900/25">
              <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">Underwriting History</h3>
              <div className="space-y-1.5 max-h-[160px] overflow-y-auto custom-scrollbar pr-1">
                {scenarios.map(s => (
                  <button key={s.id} onClick={() => loadScenario(s)} className="w-full p-2.5 bg-slate-900/40 border border-slate-800 rounded-lg hover:border-[#D4AF37]/30 transition-all flex justify-between items-center group">
                    <div className="text-left">
                      <p className="text-[10px] font-black text-white uppercase group-hover:text-[#D4AF37] transition-colors">{s.name}</p>
                      <p className="text-[8px] text-slate-600 font-mono mt-0.5">{new Date(s.timestamp).toLocaleTimeString()}</p>
                    </div>
                    <span className="text-sm font-black text-[#D4AF37]">{s.score}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick actions */}
          <div className="bg-[#081a1a] p-5 rounded-2xl border border-teal-900/25">
            <h3 className="text-[9px] font-black text-[#D4AF37] uppercase tracking-widest mb-3">Underwriting Controls</h3>
            <QuickActions onReset={resetQuadrants} onActionComplete={showToast} />
          </div>

          {/* Veracity stream */}
          <div className="bg-[#081a1a] p-5 rounded-2xl border border-teal-900/25">
            <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">Veracity Stream</h3>
            <NotificationCenter />
          </div>
        </div>
      </div>
    </div>
  );

  const renderMatrix = () => (
    <div className="space-y-6 animate-in slide-in-from-right duration-500">
      <div className="bg-[#081a1a] p-8 rounded-2xl border border-teal-900/25">
        <h2 className="text-xl font-bold text-white mb-1 tracking-widest uppercase">Sensitivity Analysis Tool</h2>
        <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-8">Model impact on capital integrity in real-time</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quadrants.map((q) => (
            <div key={q.name} className="p-6 bg-black/30 rounded-2xl border border-teal-900/20 hover:border-[#D4AF37]/30 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-[#D4AF37] font-bold uppercase tracking-widest text-sm">{q.name}</h4>
                  <p className="text-[9px] text-slate-500 mt-0.5 uppercase font-black">
                    Weight: {q.name === 'Growth' ? '35%' : q.name === 'Stability' ? '30%' : q.name === 'Liquidity' ? '20%' : '15%'}
                  </p>
                </div>
                <span className="text-4xl font-black text-white tabular-nums">{q.value}<span className="text-xs text-[#D4AF37] ml-1">%</span></span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-5 font-medium">{q.description}</p>
              <div className="w-full bg-slate-900 h-1 rounded-full relative">
                <div
                  className="h-full bg-gradient-to-r from-[#8B732A] to-[#D4AF37] rounded-full transition-all duration-300"
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
              <div className="mt-3 flex justify-between text-[8px] text-slate-600 uppercase font-mono">
                <span>Threshold: 40%</span>
                <span>Optimized: 85%+</span>
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

      <main className="flex-1 overflow-y-auto custom-scrollbar relative flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 flex justify-between items-center px-8 py-4 border-b border-slate-800/60 bg-[#061616]/90 backdrop-blur-sm">
          <div>
            <h2 className="text-lg font-black text-white tracking-[0.15em] uppercase">
              {sectionTitle[activeSection]}
            </h2>
            <p className="text-[9px] text-[#D4AF37] font-bold tracking-[0.3em] uppercase mt-0.5">Client_Tier: Institutional_Elite</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-900/50 border border-slate-800 text-slate-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/40 transition-all"
              title="Toggle theme"
            >
              {isMidnight ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <div className="bg-slate-900/50 border border-slate-800 rounded-full px-3 py-1.5 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[9px] font-mono font-bold text-slate-400">API_HEALTH: 99.9%</span>
            </div>
            <div className="w-9 h-9 rounded-xl border border-teal-900/40 bg-black/20 overflow-hidden">
              <img
                src="https://picsum.photos/seed/institutional/100/100"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500 cursor-pointer"
                alt="profile"
              />
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 px-8 py-6">
          {activeSection === AppSection.DASHBOARD && renderDashboard()}
          {activeSection === AppSection.MATRIX && renderMatrix()}
          {activeSection === AppSection.ASSETS && <AssetRegistry />}
          {activeSection === AppSection.GUARDIAN && (
            <div className="h-[calc(100vh-140px)]">
              <GuardianChat financialState={quadrants} />
            </div>
          )}
          {activeSection === AppSection.INGEST && (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="bg-[#081a1a] p-12 rounded-3xl border border-teal-900/25 text-center max-w-2xl">
                <Logo className="w-20 h-20 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-white mb-2 tracking-widest uppercase">Data Acquisition Pipeline</h2>
                <p className="text-slate-500 text-sm mb-10 font-medium uppercase tracking-widest">SHA-256 Secured Ledger Synchronization</p>
                <div className="grid grid-cols-3 gap-4">
                  {['Financials', 'Social', 'Markets'].map(item => (
                    <div key={item} className="p-5 bg-black/40 border border-teal-900/20 rounded-2xl hover:border-[#D4AF37]/20 transition-colors">
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

        {/* Footer */}
        <footer className="px-8 py-5 border-t border-slate-800/50 flex justify-between items-center text-[9px] uppercase tracking-widest font-black text-slate-600">
          <div className="flex gap-5">
            <span>© 2024 Capital Compass Ltd</span>
            <span className="text-[#D4AF37]/40">SHA-256 Verified</span>
          </div>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white transition-colors">Risk Protocol</a>
            <a href="#" className="hover:text-white transition-colors">Compliance Hub</a>
          </div>
        </footer>

        {/* Watermark */}
        <div className="fixed bottom-0 right-0 p-8 opacity-[0.015] pointer-events-none select-none -z-10">
          <Logo className="w-[400px] h-[400px]" />
        </div>
      </main>

      {/* Toast */}
      {toast.visible && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom duration-300">
          <div className="bg-[#D4AF37] text-slate-900 px-5 py-2.5 rounded-full shadow-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2.5">
            <div className="w-1.5 h-1.5 bg-slate-900 rounded-full"></div>
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
