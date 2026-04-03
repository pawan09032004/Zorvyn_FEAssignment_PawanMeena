# LEDGER - Financial Intelligence Dashboard

Assignment submission for a production-style React dashboard that turns raw transactions into decision-ready financial insights.

![React](https://img.shields.io/badge/React-18.3-20232A?logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-8-1a1a1a?logo=vite&logoColor=646CFF)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3-0f172a?logo=tailwindcss&logoColor=38BDF8)
![Recharts](https://img.shields.io/badge/Recharts-Analytics-111827)
![State](https://img.shields.io/badge/State-Context%20%2B%20useReducer-1f2937)

## Why This Submission Stands Out

- Product thinking, not just UI: every screen answers a practical finance question (status, drill-down, forecast).
- Deterministic architecture: centralized reducer, explicit actions, and serializable state for predictable behavior.
- Analyst-grade interaction model: filters, sorting, pagination, chart-to-table drill-down, and undoable destructive actions.
- Thoughtful UX polish: animated KPI count-up, role-aware controls, market ticker, and responsive desktop/mobile navigation.
- Resilience by default: chart rendering is wrapped in an error boundary to avoid full-screen failures.

## What The App Does

### 1) Overview
- KPI cards for total balance, monthly income, monthly expense, and savings rate.
- Six-month balance trajectory chart with contextual tooltip (balance + net).
- Spending donut breakdown and top merchants for the active month.
- Clickable spending categories that route directly to pre-filtered transactions.

### 2) Transactions
- Debounced search (300ms) for smoother filtering on larger datasets.
- Multi-filter pipeline: category, type, date range, and sortable columns.
- Pagination with row counters and keyboard-friendly row actions.
- Admin-only create/edit modal with inline validation.
- Delete with visual flash + undo toast and 3-second recovery window.

### 3) Insights
- Computed insight cards for peak spending category, expense delta, and projected balance.
- Month-over-month income vs expense comparison.
- Generated narrative observation based on category growth trend and budget-cap suggestion.

## Engineering Decisions

### State Management
- Uses Context + useReducer for deterministic global behavior.
- App state is hydrated from localStorage with a safe fallback to seeded mock data.
- Persisted data includes transactions, filters, role, theme, and active view.

### Data & Analytics Layer
- Domain logic is separated into reusable hooks/utilities:
	- `useTransactions`: filtering, sorting, pagination, active-filter state.
	- `useInsights`: KPI and insight composition for dashboard views.
	- `utils/analytics.js`: monthly aggregation, deltas, merchant ranking, linear projection.
- Currency/percent/date formatting is centralized for consistency and locale correctness (`en-IN`, INR).

### Design System Discipline
- Token-driven styling through CSS variables (colors, typography, spacing, elevation).
- Tailwind utility usage is aligned to tokens to avoid hardcoded visual drift.
- Dark/light mode is controlled through root class toggling and semantic color variables.

## Quality Signals

- Production build verified successfully (`npm run build`).
- ESLint passes without errors (`npm run lint`).
- Repository cleanup completed by removing generated and unused artifacts before submission.

## Tech Stack

- React 18 + React Router DOM 6
- Vite 8
- Tailwind CSS 3
- Recharts
- Lucide React
- Context API + useReducer

## Quick Start

```bash
npm install
npm run dev
```

### Additional Scripts

```bash
npm run build
npm run preview
npm run lint
```

## Project Structure

```text
src/
	components/
		common/
		layout/
		overview/
		transactions/
		insights/
	context/
	data/
	hooks/
	utils/
	constants.js
	App.jsx
```

## Trade-offs & Next Steps

- Current persistence is localStorage (no backend sync).
- Suggested next upgrades:
	1. Unit tests for reducer and analytics utilities.
	2. API-backed persistence with optimistic updates and conflict handling.
	3. Code-splitting to reduce initial bundle size.
	4. Export flows (CSV/PDF) for reporting.

## Evaluation Guide (For Reviewers)

1. Start in Viewer mode and inspect the analytics flow across all tabs.
2. Switch to Admin mode and create/edit/delete transactions.
3. Use donut click-through from Overview to Transactions to validate cross-screen state coupling.
4. Refresh the page to confirm persisted state recovery.

---

If you are hiring for frontend engineers who can blend product intuition, data modeling, and design execution, this submission is built to demonstrate exactly that.
# Zorvyn_FEAssignment_PawanMeena
