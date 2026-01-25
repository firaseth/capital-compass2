
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

export enum AppSection {
  DASHBOARD = 'DASHBOARD',
  MATRIX = 'MATRIX',
  GUARDIAN = 'GUARDIAN',
  INGEST = 'INGEST',
  VIDEO_ANALYSIS = 'VIDEO_ANALYSIS'
}
