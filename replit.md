# Capital Compass

Institutional-grade AI-powered financial underwriting and feasibility analysis tool.

## Stack
- **Frontend:** React 19 + Vite 6 + TypeScript
- **Styling:** Tailwind CSS via CDN (not PostCSS); custom CSS in `index.html <style>`
- **Charts:** Recharts (via ESM import map in index.html)
- **AI:** Google Gemini via `@google/genai` (ESM import map)
- **Port:** 5000

## Architecture
- `index.html` — entry point, Tailwind CDN, ESM import map for recharts/@google/genai, custom CSS (scrollbar, slider thumb, midnight theme, range input gold thumb)
- `index.tsx` — React root mount
- `App.tsx` — main app shell, section routing, dashboard/matrix/ingest renders, live clock
- `constants.tsx` — THEME, INITIAL_QUADRANTS, 8 SAMPLE_ASSETS with ytd/risk, 12-month PERFORMANCE_DATA with benchmark
- `types.ts` — AppSection enum, QuadrantScore, Scenario, Asset (with ytd/risk) interfaces
- `services/geminiService.ts` — Gemini AI feasibility report generation
- `hooks/useAnimatedCounter.ts` — ease-out cubic counter animation hook
- `components/` — all UI components

## Components
| File | Purpose |
|------|---------|
| `Sidebar.tsx` | Navigation sidebar with progress bar and veracity lock |
| `Logo.tsx` | Inline SVG star logo |
| `MarketOverview.tsx` | Live market ticker cards (S&P, BTC, US10Y, Gold) with SVG sparklines |
| `QuadrantCards.tsx` | 4 animated KPI cards (Liquidity, Stability, Growth, Risk) |
| `QuadrantChart.tsx` | Recharts RadarChart with custom color-coded angle ticks + score values |
| `PortfolioPerformance.tsx` | Recharts AreaChart — dual-series Portfolio (gold) + Benchmark (blue dashed) |
| `ScoreGauge.tsx` | SVG arc gauge (220° sweep, color-coded by %) for feasibility index |
| `ReportRenderer.tsx` | Inline markdown parser for AI report (bold, ##, bullets) |
| `AssetRegistry.tsx` | Asset ledger with KPI cards, allocation bar, 8 assets, expandable detail rows, YTD + risk columns, new Fixed Income/Real Estate types |
| `GuardianChat.tsx` | Guardian Underwriter AI chat panel |
| `VideoAnalyzer.tsx` | Asset forensics video analysis section |
| `NotificationCenter.tsx` | Veracity stream alerts |
| `QuickActions.tsx` | Underwriting control action buttons with spinner states |
| `IndicatorDetailModal.tsx` | Modal with Recharts history chart |

## Key Design Decisions
- **No PostCSS** — Tailwind via CDN; all custom CSS in `index.html <style>` block
- **Midnight theme** — `body.midnight` CSS class toggled via localStorage; `toggleTheme()` in App.tsx
- **Recharts warnings** — cosmetic only; suppressed via `debounce={50}` prop + deferred 50ms mount in PortfolioPerformance/QuadrantChart
- **Animated score** — `useAnimatedCounter` hook with ease-out cubic easing, used in dashboard + matrix live banner
- **Gemini key** — consumed as `process.env.API_KEY` (defined in vite.config.ts `define` → `GEMINI_API_KEY` secret)
- **Live clock** — `useState` + 1s `setInterval` in App.tsx, shown in header status pill and footer
- **Custom range slider** — CSS in index.html: transparent track, gold (#D4AF37) thumb with glow; sensitivity matrix sliders use positioned div track with visible input on top
- **Capital Metrics panel** — 6 KPI mini-cards (ROI, Payback, IRR, DSCR, LTV, Cap Rate) in right column of dashboard

## Sections
1. **Capital Overview** (dashboard) — market ticker context, quadrant cards, feasibility index w/ ScoreGauge, AI report w/ ReportRenderer, dual-series chart, Capital Metrics, Guardian chat preview
2. **Underwriting Matrix** — sensitivity sliders (gold thumb, color-coded tracks) with live animated score panel + score bar
3. **Asset Ledger** — 8-asset registry with KPI cards, allocation bar, expandable detail rows, YTD, risk rating, veracity hashes
4. **Guardian AI** — full-height AI chat interface
5. **Asset Forensics** — video analysis tool
6. **Data Ingestion** — 3-feed pipeline status + ledger sync log

## Environment Variables
- `API_KEY` / `GEMINI_API_KEY` — Google Gemini API key (set in Replit secrets, exposed via vite.config.ts `define`)
