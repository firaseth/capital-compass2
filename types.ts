
export interface FinancialData {
  liquidity: number;
  stability: number;
  growth: number;
  risk: number;
  totalScore: number;
}

export interface QuadrantScore {
  name: string;
  value: number;
  description: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  isThinking?: boolean;
  sources?: { title: string; uri: string }[];
}

export interface Scenario {
  id: string;
  name: string;
  quadrants: QuadrantScore[];
  score: number;
  timestamp: number;
}

export interface Asset {
  id: string;
  name: string;
  type: string;
  value: number;
  veracityHash: string;
  status: 'verified' | 'pending' | 'flagged';
  ytd?: string;
  risk?: string;
}

export enum AppSection {
  DASHBOARD = 'DASHBOARD',
  MATRIX = 'MATRIX',
  GUARDIAN = 'GUARDIAN',
  ASSETS = 'ASSETS',
  INGEST = 'INGEST',
  VIDEO_ANALYSIS = 'VIDEO_ANALYSIS'
}
