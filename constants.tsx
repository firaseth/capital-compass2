
import React from 'react';

export const THEME = {
  primary: '#0B1222', // Deep Slate Navy from the logo background
  accent: '#D4AF37',  // Executive Gold from the arrow
  secondary: '#1E40AF', // Compass Needle Blue
  success: '#1B3022',
  bgCard: '#0f172a',  // Darker Slate for cards
  textMuted: '#94A3B8'
};

export const INITIAL_QUADRANTS = [
  { name: 'Liquidity', value: 82, description: 'Measures immediate cash accessibility and short-term solvency.' },
  { name: 'Stability', value: 74, description: 'Assesses historical performance and long-term asset retention.' },
  { name: 'Growth', value: 91, description: 'Evaluation of asset appreciation and market expansion potential.' },
  { name: 'Risk', value: 25, description: 'Weighted liability exposure and volatility index.' }
];

export const SAMPLE_ASSETS = [
  { id: 'AST-001', name: 'Creator Portfolio Alpha',     type: 'Equity',               value: 1250000, veracityHash: 'sha256:7f83...a9b2', status: 'verified', ytd: '+24.1%', risk: 'Low' },
  { id: 'AST-002', name: 'Global Rights Catalog',       type: 'Intellectual Property', value:  850000, veracityHash: 'sha256:3e12...f9c0', status: 'verified', ytd: '+11.7%', risk: 'Low' },
  { id: 'AST-003', name: 'Liquid Reserves (USD)',        type: 'Cash',                 value:  340000, veracityHash: 'sha256:a221...e3b4', status: 'verified', ytd: '+5.1%',  risk: 'None' },
  { id: 'AST-004', name: 'Emerging Market Option',       type: 'Derivative',           value:  150000, veracityHash: 'sha256:d889...b112', status: 'flagged', ytd: '-8.3%',  risk: 'High' },
  { id: 'AST-005', name: 'Institutional Bond Series C',  type: 'Fixed Income',         value:  620000, veracityHash: 'sha256:b41c...22e1', status: 'verified', ytd: '+6.8%',  risk: 'Low' },
  { id: 'AST-006', name: 'Offshore Real Estate Fund',    type: 'Real Estate',          value:  490000, veracityHash: 'sha256:f992...8d77', status: 'verified', ytd: '+18.2%', risk: 'Med' },
  { id: 'AST-007', name: 'Media IP Pool — Catalog Q3',  type: 'Intellectual Property', value:  275000, veracityHash: 'sha256:c100...9f3a', status: 'pending', ytd: '+3.4%',  risk: 'Med' },
  { id: 'AST-008', name: 'Digital Infrastructure REIT',  type: 'Real Estate',          value:  380000, veracityHash: 'sha256:e554...a1b8', status: 'verified', ytd: '+31.0%', risk: 'Low' },
];

export const PERFORMANCE_DATA = [
  { month: 'Jan', value: 450000, benchmark: 420000 },
  { month: 'Feb', value: 475000, benchmark: 438000 },
  { month: 'Mar', value: 460000, benchmark: 445000 },
  { month: 'Apr', value: 510000, benchmark: 455000 },
  { month: 'May', value: 550000, benchmark: 462000 },
  { month: 'Jun', value: 590000, benchmark: 470000 },
  { month: 'Jul', value: 620000, benchmark: 480000 },
  { month: 'Aug', value: 605000, benchmark: 490000 },
  { month: 'Sep', value: 648000, benchmark: 498000 },
  { month: 'Oct', value: 690000, benchmark: 508000 },
  { month: 'Nov', value: 720000, benchmark: 515000 },
  { month: 'Dec', value: 762000, benchmark: 522000 },
];

export const MARKET_INDICATORS = [
  { label: 'S&P 500', value: '5,123.42', change: '+0.84%', trend: 'up' },
  { label: 'BTC/USD', value: '$64,120', change: '-1.20%', trend: 'down' },
  { label: 'US 10Y', value: '4.21%', change: '+0.02%', trend: 'up' },
  { label: 'Gold', value: '$2,342', change: '+0.45%', trend: 'up' },
];

export const INDICATOR_DETAILS: Record<string, {
  history: { date: string; value: number }[];
  news: { title: string; source: string; time: string }[];
}> = {
  'S&P 500': {
    history: [
      { date: 'Mon', value: 5080 }, { date: 'Tue', value: 5095 }, { date: 'Wed', value: 5110 }, 
      { date: 'Thu', value: 5105 }, { date: 'Fri', value: 5123 }
    ],
    news: [
      { title: 'Tech Sector Rally Drives Benchmarks to Record Highs', source: 'Institutional Weekly', time: '2h ago' },
      { title: 'Fed Outlook: Stability Measures Impacting Index Growth', source: 'Capital Intelligence', time: '5h ago' }
    ]
  },
  'BTC/USD': {
    history: [
      { date: 'Mon', value: 66000 }, { date: 'Tue', value: 65200 }, { date: 'Wed', value: 64800 }, 
      { date: 'Thu', value: 63500 }, { date: 'Fri', value: 64120 }
    ],
    news: [
      { title: 'Spot ETF Inflows Stabilize After Volatility Peak', source: 'Digital Asset Ledger', time: '1h ago' },
      { title: 'Regulatory Integrity Check: New Custody Protocols Verified', source: 'Veracity News', time: '4h ago' }
    ]
  },
  'US 10Y': {
    history: [
      { date: 'Mon', value: 4.15 }, { date: 'Tue', value: 4.18 }, { date: 'Wed', value: 4.19 }, 
      { date: 'Thu', value: 4.20 }, { date: 'Fri', value: 4.21 }
    ],
    news: [
      { title: 'Treasury Auction Shows Strong Institutional Demand', source: 'Bond Market Daily', time: '3h ago' },
      { title: 'Inflation Data Veracity Reaffirms Stability Target', source: 'Economic Guardian', time: '7h ago' }
    ]
  },
  'Gold': {
    history: [
      { date: 'Mon', value: 2310 }, { date: 'Tue', value: 2325 }, { date: 'Wed', value: 2330 }, 
      { date: 'Thu', value: 2335 }, { date: 'Fri', value: 2342 }
    ],
    news: [
      { title: 'Central Bank Accumulation Continues Amid Risk Vectors', source: 'Bullion Report', time: '30m ago' },
      { title: 'Safe Haven Demand Spikes in Emerging Markets', source: 'Global Capital Forensics', time: '6h ago' }
    ]
  }
};

export const NOTIFICATIONS = [
  { id: 1, title: 'Veracity Check Complete', time: '2m ago', type: 'success', message: 'SHA-256 Ledger synchronized.' },
  { id: 2, title: 'Risk Alert: Stability', time: '1h ago', type: 'warning', message: 'Stability quadrant dipped below 75% threshold.' },
  { id: 3, title: 'Guardian Nudge', time: '3h ago', type: 'info', message: 'New stabilization plan generated for Q3.' },
];

export const ICONS = {
  Dashboard: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  Matrix: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  Guardian: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  Ingest: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  ),
  Assets: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  )
};
