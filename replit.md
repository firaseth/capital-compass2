# Capital Compass

Institutional-grade AI-powered financial underwriting and feasibility analysis tool.

## Stack
- **Frontend:** React 19 + Vite 6 + TypeScript
- **Styling:** Tailwind CSS via CDN (not PostCSS)
- **Charts:** Recharts (via ESM import map in index.html)
- **AI:** Google Gemini via `@google/genai` (ESM import map)
- **Port:** 5000

## Architecture
- `index.html` — entry point, Tailwind CDN, ESM import map for recharts/@google/genai
- `index.tsx` — React root mount
- `App.tsx` — main app shell, section routing, dashboard/matrix/ingest renders
- `constants.ts` — THEME, INITIAL_QUADRANTS, KPI data
- `types.ts` — AppSection enum, QuadrantScore, Scenario interfaces
- `services/geminiService.ts` — Gemini AI feasibility report generation
- `hooks/useAnimatedCounter.ts` — ease-out cubic counter animation hook
- `components/` — all UI components

## Components
| File | Purpose |
|------|---------|
| `Sidebar.tsx` | Navigation sidebar with progress bar and veracity lock |
| `Logo.tsx` | Inline SVG star logo |
| `MarketOverview.tsx` | Live market ticker cards (S&P, BTC, US10Y, Gold) |
| `QuadrantCards.tsx` | 4 mini score cards (Liquidity, Stability, Growth, Risk) |
| `QuadrantChart.tsx` | Recharts RadarChart for quadrant visualization |
| `PortfolioPerformance.tsx` | Recharts AreaChart for performance trend |
| `AssetRegistry.tsx` | Asset ledger with KPI cards, allocation bars, sortable rows |
| `GuardianChat.tsx` | Guardian Underwriter AI chat panel |
| `VideoAnalyzer.tsx` | Asset forensics video analysis section |
| `NotificationCenter.tsx` | Veracity stream alerts |
| `QuickActions.tsx` | Underwriting control action buttons |
| `IndicatorDetailModal.tsx` | Modal with Recharts history chart |

## Key Design Decisions
- **No PostCSS** — Tailwind via CDN; custom CSS in `index.html <style>` for midnight theme
- **Midnight theme** — `body.midnight` CSS class toggled via localStorage
- **Recharts warnings** — suppressed via `debounce={50}` prop + deferred 50ms mount
- **Animated score** — `useAnimatedCounter` hook with ease-out cubic easing
- **Gemini key** — consumed as `process.env.API_KEY` (defined in vite.config.ts `define`)

## Environment Variables
- `API_KEY` — Google Gemini API key (set in Replit secrets as `GEMINI_API_KEY`, exposed via vite.config.ts)

## Sections
1. **Capital Overview** (dashboard) — market context, quadrant cards, feasibility index, charts, AI report
2. **Underwriting Matrix** — sensitivity sliders with live animated score panel
3. **Asset Ledger** — asset registry with KPI cards and allocation visualization
4. **Guardian AI** — full-height AI chat interface
5. **Asset Forensics** — video analysis tool
6. **Data Ingestion** — 3-feed pipeline status + ledger sync log
