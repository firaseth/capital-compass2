
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

export const PERFORMANCE_DATA = [
  { month: 'Jan', value: 450000, growth: 12 },
  { month: 'Feb', value: 475000, growth: 15 },
  { month: 'Mar', value: 460000, growth: 10 },
  { month: 'Apr', value: 510000, growth: 22 },
  { month: 'May', value: 550000, growth: 25 },
  { month: 'Jun', value: 590000, growth: 28 },
  { month: 'Jul', value: 620000, growth: 31 },
];

export const MARKET_INDICATORS = [
  { label: 'S&P 500', value: '5,123.42', change: '+0.84%', trend: 'up' },
  { label: 'BTC/USD', value: '$64,120', change: '-1.20%', trend: 'down' },
  { label: 'US 10Y', value: '4.21%', change: '+0.02%', trend: 'up' },
  { label: 'Gold', value: '$2,342', change: '+0.45%', trend: 'up' },
];

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
  )
};
