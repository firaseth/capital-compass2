
import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import QuadrantChart from './components/QuadrantChart';
import QuadrantCards from './components/QuadrantCards';
import GuardianChat from './components/GuardianChat';
import VideoAnalyzer from './components/VideoAnalyzer';
import PortfolioPerformance from './components/PortfolioPerformance';
import MarketOverview from './components/MarketOverview';
import QuickActions from './components/QuickActions';
import NotificationCenter from './components/NotificationCenter';
import AssetRegistry from './components/AssetRegistry';
import Logo from './components/Logo';
import { useAnimatedCounter } from './hooks/useAnimatedCounter';
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

  const animatedScore = useAnimatedCounter(totalScore);

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

      {/* Quadrant Mini-Cards */}
      <QuadrantCards quadrants={quadrants} />

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
                  <h2 className="text-5xl font-bold text-white tracking-tighter leading-none tabular-nums">{animatedScore}</h2>
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

  const scoreRating = animatedScore >= 800 ? { label: 'OPTIMIZED', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' }
    : animatedScore >= 650 ? { label: 'VIABLE', color: 'text-[#D4AF37]', bg: 'bg-[#D4AF37]/10 border-[#D4AF37]/20' }
    : animatedScore >= 450 ? { label: 'MARGINAL', color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20' }
    : { label: 'HIGH RISK', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' };

  const renderMatrix = () => (
    <div className="space-y-5 animate-in slide-in-from-right duration-500">
      {/* Live Score Banner */}
      <div className="bg-[#081a1a] border border-teal-900/25 rounded-2xl p-5 flex items-center justify-between gap-6">
        <div>
          <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Live Feasibility Index</p>
          <div className="flex items-end gap-3">
            <span className="text-5xl font-bold text-white tracking-tighter tabular-nums">{animatedScore}</span>
            <span className="text-slate-600 font-light mb-1">/ 1000</span>
          </div>
          <p className="text-[9px] text-slate-600 font-mono mt-1 uppercase">Adjust sliders to model capital impact in real-time</p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <span className={`text-xs font-black px-4 py-1.5 rounded-full border ${scoreRating.bg} ${scoreRating.color}`}>{scoreRating.label}</span>
          <div className="w-48 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(animatedScore / 1000) * 100}%`,
                background: `linear-gradient(90deg, #8B732A, #D4AF37)`
              }}
            ></div>
          </div>
          <div className="flex gap-4 text-[9px] font-mono text-slate-600 uppercase">
            {quadrants.map(q => (
              <span key={q.name}>{q.name[0]}: <span className="text-slate-400">{q.value}</span></span>
            ))}
          </div>
        </div>
      </div>

      {/* Slider Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quadrants.map((q) => {
          const weight = q.name === 'Growth' ? 35 : q.name === 'Stability' ? 30 : q.name === 'Liquidity' ? 20 : 15;
          const valColor = q.name === 'Risk'
            ? (q.value <= 30 ? 'text-green-400' : q.value <= 60 ? 'text-amber-400' : 'text-red-400')
            : (q.value >= 75 ? 'text-green-400' : q.value >= 50 ? 'text-[#D4AF37]' : 'text-amber-400');
          const trackColor = q.name === 'Risk'
            ? (q.value <= 30 ? 'bg-green-500' : q.value <= 60 ? 'bg-amber-500' : 'bg-red-500')
            : (q.value >= 75 ? 'bg-green-500' : q.value >= 50 ? 'bg-[#D4AF37]' : 'bg-amber-500');
          return (
            <div key={q.name} className="p-6 bg-[#081a1a] rounded-2xl border border-teal-900/25 hover:border-[#D4AF37]/30 transition-all">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-white font-bold uppercase tracking-widest text-sm">{q.name}</h4>
                  <p className="text-[9px] text-slate-500 mt-0.5 font-mono uppercase">
                    {weight}% weight{q.name === 'Risk' ? ' · Inverse' : ''}
                  </p>
                </div>
                <span className={`text-4xl font-black tabular-nums ${valColor}`}>{q.value}<span className="text-xs text-slate-600 ml-1">/100</span></span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-5">{q.description}</p>
              <div className="relative group/slider">
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${trackColor} rounded-full transition-all duration-150`}
                    style={{ width: `${q.value}%` }}
                  ></div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={q.value}
                  onChange={(e) => {
                    const newVal = parseInt(e.target.value);
                    setQuadrants(prev => prev.map(curr => curr.name === q.name ? { ...curr, value: newVal } : curr));
                  }}
                  className="absolute inset-y-0 left-0 w-full opacity-0 cursor-pointer h-2 z-10"
                />
              </div>
              <div className="mt-3 flex justify-between text-[8px] text-slate-700 uppercase font-mono">
                <span>0 — Critical</span>
                <span>50 — Baseline</span>
                <span>100 — Peak</span>
              </div>
            </div>
          );
        })}
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
            <div className="space-y-5 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: 'Financials', status: 'SYNC_ACTIVE', pct: 94, color: 'text-green-400', bar: 'bg-green-500', items: ['Balance Sheet', 'P&L Statement', 'Cash Flow', 'Revenue Streams'] },
                  { label: 'Social',     status: 'SYNC_ACTIVE', pct: 87, color: 'text-blue-400',  bar: 'bg-blue-500',  items: ['Engagement Index', 'Follower Growth', 'Brand Sentiment', 'Creator Score'] },
                  { label: 'Markets',    status: 'SYNC_ACTIVE', pct: 99, color: 'text-[#D4AF37]', bar: 'bg-[#D4AF37]', items: ['S&P 500', 'BTC/USD', 'Gold Spot', 'US 10Y Yield'] },
                ].map(feed => (
                  <div key={feed.label} className="bg-[#081a1a] border border-teal-900/25 rounded-2xl p-5 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-black text-white uppercase tracking-widest">{feed.label}</h3>
                      <span className={`text-[9px] font-black font-mono ${feed.color} flex items-center gap-1.5`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${feed.bar} animate-pulse`}></span>
                        {feed.status}
                      </span>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-[9px] text-slate-500 font-mono uppercase">Integrity Score</span>
                        <span className={`text-[9px] font-black font-mono ${feed.color}`}>{feed.pct}%</span>
                      </div>
                      <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full ${feed.bar} rounded-full`} style={{ width: `${feed.pct}%` }}></div>
                      </div>
                    </div>
                    <div className="space-y-2 pt-1">
                      {feed.items.map(item => (
                        <div key={item} className="flex items-center justify-between py-1.5 border-b border-slate-800/50 last:border-0">
                          <span className="text-[10px] text-slate-400 font-medium">{item}</span>
                          <span className="text-[9px] text-green-500 font-mono font-black">✓ VERIFIED</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-[#081a1a] border border-teal-900/25 rounded-2xl p-5">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-xs font-black text-white uppercase tracking-widest">Ledger Sync Log</h3>
                    <p className="text-[9px] text-slate-500 font-mono mt-0.5">SHA-256 Secured Ledger Synchronization</p>
                  </div>
                  <span className="text-[9px] bg-green-500/10 text-green-400 px-3 py-1 rounded-full border border-green-500/20 font-black">ALL SYSTEMS NOMINAL</span>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-1 font-mono text-[10px]">
                  {[
                    { time: '08:21:44', msg: 'SHA-256 hash verified for block #00A4F2', type: 'success' },
                    { time: '08:21:39', msg: 'Market data ingested — 4 indicators synced', type: 'success' },
                    { time: '08:20:55', msg: 'Social sentiment index recalculated: 87.2', type: 'info' },
                    { time: '08:19:12', msg: 'Financial ledger block committed to chain', type: 'success' },
                    { time: '08:17:30', msg: 'Derivative asset AST-004 flagged for review', type: 'warn' },
                    { time: '08:15:00', msg: 'Full pipeline sync initiated — 3 data feeds', type: 'info' },
                  ].map((log, i) => (
                    <div key={i} className="flex items-start gap-3 py-1.5 border-b border-slate-800/40 last:border-0">
                      <span className="text-slate-600 flex-shrink-0">{log.time}</span>
                      <span className={`flex-shrink-0 font-black ${log.type === 'success' ? 'text-green-500' : log.type === 'warn' ? 'text-amber-500' : 'text-blue-400'}`}>
                        {log.type === 'success' ? '✓' : log.type === 'warn' ? '⚠' : 'ℹ'}
                      </span>
                      <span className="text-slate-400">{log.msg}</span>
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
