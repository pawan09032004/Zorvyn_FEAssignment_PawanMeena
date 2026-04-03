export const APP_TITLE = "LEDGER";
export const APP_SUBTITLE = "Financial Intelligence";

export const STORAGE_KEY = "ledger_state_v1";
export const DATE_RANGE_LABEL = "Jan 2025 - Jun 2025";

export const VIEWS = {
  OVERVIEW: "overview",
  TRANSACTIONS: "transactions",
  INSIGHTS: "insights",
};

export const ROLES = {
  VIEWER: "viewer",
  ADMIN: "admin",
};

export const TRANSACTION_TYPES = {
  ALL: "all",
  INCOME: "income",
  EXPENSE: "expense",
};

export const SORT_FIELDS = {
  DATE: "date",
  MERCHANT: "merchant",
  CATEGORY: "category",
  TYPE: "type",
  AMOUNT: "amount",
};

export const PAGE_SIZE = 10;

export const NAV_ITEMS = [
  { key: VIEWS.OVERVIEW, label: "Overview", icon: "LayoutDashboard" },
  { key: VIEWS.TRANSACTIONS, label: "Transactions", icon: "ReceiptText" },
  { key: VIEWS.INSIGHTS, label: "Insights", icon: "TrendingUp" },
];

export const MOBILE_TABS = [
  { key: VIEWS.OVERVIEW, label: "Overview", icon: "LayoutDashboard" },
  { key: VIEWS.TRANSACTIONS, label: "Transactions", icon: "ReceiptText" },
  { key: VIEWS.INSIGHTS, label: "Insights", icon: "TrendingUp" },
  { key: "theme", label: "Theme", icon: "SunMoon" },
];

export const CATEGORY_OPTIONS = [
  "Food & Dining",
  "Transport",
  "Shopping",
  "Entertainment",
  "Healthcare",
  "Utilities",
  "Salary",
  "Freelance",
  "Investments",
];

export const MERCHANT_OPTIONS = [
  "Swiggy",
  "Zomato",
  "Uber",
  "Ola",
  "Amazon",
  "Flipkart",
  "Netflix",
  "Hotstar",
  "Apollo Pharmacy",
  "BESCOM",
  "Razorpay Salary Credit",
  "Upwork",
  "Zerodha",
];

export const COPY = {
  topBarSearchPlaceholder: "Search Intel...",
  filterSearchPlaceholder: "Search transactions...",
  clearFilters: "Clear Filters",
  addTransaction: "Add Transaction",
  editTransaction: "Edit Transaction",
  newTransaction: "New Transaction",
  exportPdf: "Export PDF",
  generateReport: "Generate Report",
  intelligenceDossier: "Intelligence Dossier",
  portfolioInsights: "Portfolio Insights",
  monthlyComparison: "Monthly Comparison",
  smartObservationTitle: "Smart Observation",
  viewCompleteAuditLog: "View Complete Audit Log",
  emptyTransactionsTitle: "No transactions found",
  emptyTransactionsText:
    "Adjust your filters or add a new transaction to continue your analysis.",
  undo: "Undo",
};

export const KPI_LABELS = {
  totalBalance: "Total Balance",
  monthlyIncome: "Monthly Income",
  monthlyExpenses: "Monthly Expenses",
  savingsRate: "Savings Rate",
};

export const INSIGHT_CARD_LABELS = {
  peakSpending: "Peak Spending Category",
  delta: "vs Last Month",
  projectedBalance: "Projected Balance",
};

export const TABLE_HEADERS = [
  { key: SORT_FIELDS.DATE, label: "Date" },
  { key: SORT_FIELDS.MERCHANT, label: "Merchant" },
  { key: SORT_FIELDS.CATEGORY, label: "Category" },
  { key: SORT_FIELDS.TYPE, label: "Type" },
  { key: SORT_FIELDS.AMOUNT, label: "Amount" },
];

export const CHART_COLORS = {
  accent: "var(--color-accent)",
  accentGlow: "var(--color-accent-glow)",
  tertiary: "var(--color-tertiary)",
  positive: "var(--color-positive)",
  negative: "var(--color-negative)",
  border: "var(--color-border)",
  pie: [
    "var(--color-positive)",
    "var(--color-accent)",
    "var(--color-tertiary)",
    "var(--color-neutral-500)",
    "var(--color-neutral-600)",
    "var(--color-neutral-700)",
  ],
};

export const MARKET_TICKER = [
  { symbol: "S&P 500", value: "+0.42%", direction: "up" },
  { symbol: "BTC / USD", value: "-1.12%", direction: "down" },
  { symbol: "GOLD OUNCE", value: "+2.15%", direction: "up" },
  { symbol: "USD / EUR", value: "0.9142", direction: "flat" },
  { symbol: "NASDAQ", value: "+1.02%", direction: "up" },
];

export const THEME_CLASS = "light";
