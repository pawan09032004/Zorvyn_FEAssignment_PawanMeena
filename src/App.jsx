import { useCallback, useEffect, useMemo, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import {
  APP_TITLE,
  COPY,
  DATE_RANGE_LABEL,
  MARKET_TICKER,
  MERCHANT_OPTIONS,
  ROLES,
  VIEWS,
} from "./constants";
import { AppProvider, useAppContext } from "./context/AppContext";
import { CATEGORY_OPTIONS } from "./constants";
import { useInsights } from "./hooks/useInsights";
import { useTransactions } from "./hooks/useTransactions";
import TopBar from "./components/layout/TopBar";
import Sidebar from "./components/layout/Sidebar";
import MobileTabBar from "./components/layout/MobileTabBar";
import SummaryCards from "./components/overview/SummaryCards";
import BalanceTrendChart from "./components/overview/BalanceTrendChart";
import SpendingBreakdown from "./components/overview/SpendingBreakdown";
import FilterBar from "./components/transactions/FilterBar";
import TransactionTable from "./components/transactions/TransactionTable";
import TransactionModal from "./components/transactions/TransactionModal";
import EmptyState from "./components/transactions/EmptyState";
import InsightCards from "./components/insights/InsightCards";
import MonthlyComparison from "./components/insights/MonthlyComparison";
import SmartObservation from "./components/insights/SmartObservation";

const viewPathMap = {
  [VIEWS.OVERVIEW]: "/",
  [VIEWS.TRANSACTIONS]: "/transactions",
  [VIEWS.INSIGHTS]: "/insights",
};

const pathViewMap = {
  "/": VIEWS.OVERVIEW,
  "/transactions": VIEWS.TRANSACTIONS,
  "/insights": VIEWS.INSIGHTS,
};

const DashboardShell = () => {
  const {
    state,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    setRole,
    setTheme,
    setFilter,
    clearFilters,
    setView,
    setSelectedCategory,
  } = useAppContext();

  const navigate = useNavigate();
  const location = useLocation();

  const [modalState, setModalState] = useState({
    open: false,
    mode: "create",
    transaction: null,
  });
  const [page, setPage] = useState(1);

  const isAdmin = state.role === ROLES.ADMIN;

  const {
    monthlySeries,
    kpis,
    spendingBreakdown,
    topMerchants,
    insights,
  } = useInsights(state.transactions);

  const {
    availableCategories,
    filteredTransactions,
    getPaginatedTransactions,
    hasActiveFilters,
    totalPages,
    totalRows,
  } = useTransactions({
    transactions: state.transactions,
    filters: state.filters,
  });

  const currentPage = Math.min(Math.max(1, page), totalPages);

  const paginatedTransactions = useMemo(
    () => getPaginatedTransactions(currentPage),
    [currentPage, getPaginatedTransactions],
  );

  useEffect(() => {
    const currentView = pathViewMap[location.pathname] || VIEWS.OVERVIEW;

    if (currentView !== state.activeView) {
      setView(currentView);
    }
  }, [location.pathname, setView, state.activeView]);

  const handleNavigate = useCallback(
    (view) => {
      setView(view);
      navigate(viewPathMap[view]);
    },
    [navigate, setView],
  );

  const handleThemeToggle = useCallback(() => {
    setTheme(state.theme === "dark" ? "light" : "dark");
  }, [setTheme, state.theme]);

  const handleSearchChange = useCallback(
    (value) => {
      setPage(1);
      setFilter("search", value);
    },
    [setFilter],
  );

  const handleFilterChange = useCallback(
    (key, value) => {
      if (key !== "sort") {
        setPage(1);
      }
      setFilter(key, value);
    },
    [setFilter],
  );

  const handleClearFilters = useCallback(() => {
    setPage(1);
    clearFilters();
  }, [clearFilters]);

  const handleSortChange = useCallback(
    (value) => {
      setFilter("sort", value);
    },
    [setFilter],
  );

  const handleSaveTransaction = useCallback(
    (payload) => {
      if (modalState.mode === "edit") {
        updateTransaction(payload);
      } else {
        addTransaction(payload);
      }
    },
    [addTransaction, modalState.mode, updateTransaction],
  );

  const handleCategorySelect = useCallback(
    (category) => {
      setSelectedCategory(category);
      if (category) {
        handleNavigate(VIEWS.TRANSACTIONS);
      }
    },
    [handleNavigate, setSelectedCategory],
  );

  const overviewRoute = useMemo(
    () => (
      <div className="space-y-6 lg:space-y-8">
        <SummaryCards kpis={kpis} />
        <BalanceTrendChart data={monthlySeries} />
        <SpendingBreakdown
          data={spendingBreakdown}
          topMerchants={topMerchants}
          selectedCategory={state.selectedCategory}
          onSelectCategory={handleCategorySelect}
        />
      </div>
    ),
    [handleCategorySelect, kpis, monthlySeries, spendingBreakdown, state.selectedCategory, topMerchants],
  );

  const transactionsRoute = useMemo(
    () => (
      <div className="space-y-6">
        <FilterBar
          filters={state.filters}
          categories={availableCategories.length ? availableCategories : CATEGORY_OPTIONS}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
          isAdmin={isAdmin}
          onAddTransaction={() => setModalState({ open: true, mode: "create", transaction: null })}
        />

        {filteredTransactions.length ? (
          <TransactionTable
            transactions={paginatedTransactions}
            sort={state.filters.sort}
            onSortChange={handleSortChange}
            page={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
            totalRows={totalRows}
            isAdmin={isAdmin}
            onEdit={(transaction) =>
              setModalState({
                open: true,
                mode: "edit",
                transaction,
              })
            }
            onDelete={deleteTransaction}
            onUndoDelete={addTransaction}
          />
        ) : (
          <EmptyState
            title={COPY.emptyTransactionsTitle}
            description={COPY.emptyTransactionsText}
          />
        )}
      </div>
    ),
    [
      addTransaction,
      availableCategories,
      deleteTransaction,
      filteredTransactions.length,
      handleClearFilters,
      handleFilterChange,
      handleSortChange,
      hasActiveFilters,
      isAdmin,
      currentPage,
      paginatedTransactions,
      state.filters,
      totalPages,
      totalRows,
    ],
  );

  const insightsRoute = useMemo(
    () => (
      <div className="space-y-6 lg:space-y-8">
        <section className="flex items-end justify-between gap-4 border-b border-border/20 pb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-accent font-mono">
              {COPY.intelligenceDossier}
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-black tracking-tight text-text-primary">
              {COPY.portfolioInsights}
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button
              type="button"
              className="px-4 py-2 border border-border/30 text-[10px] uppercase tracking-[0.16em] font-mono text-text-primary"
            >
              {COPY.exportPdf}
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-accent text-on-accent text-[10px] uppercase tracking-[0.16em] font-mono"
            >
              {COPY.generateReport}
            </button>
          </div>
        </section>

        <InsightCards
          peakCategory={insights.peakCategory}
          expenseDelta={insights.expenseDelta}
          projectedBalance={insights.projectedBalance}
        />

        <section className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
          <div className="xl:col-span-8">
            <MonthlyComparison data={insights.monthlyComparison} />
          </div>
          <div className="xl:col-span-4">
            <SmartObservation text={insights.observation} />
          </div>
        </section>
      </div>
    ),
    [insights],
  );

  return (
    <div className={`min-h-screen bg-bg-base text-text-primary ${isAdmin ? "border-t-4 border-t-accent" : ""}`}>
      <Sidebar
        activeView={state.activeView}
        onNavigate={handleNavigate}
        role={state.role}
        onRoleChange={setRole}
      />

      <div className="md:ml-12 lg:ml-60 min-h-screen flex flex-col">
        <TopBar
          dateRangeLabel={DATE_RANGE_LABEL}
          search={state.filters.search}
          onSearchChange={handleSearchChange}
          theme={state.theme}
          onToggleTheme={handleThemeToggle}
        />

        <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-8 pb-24 md:pb-16">
          <Routes>
            <Route path="/" element={overviewRoute} />
            <Route path="/transactions" element={transactionsRoute} />
            <Route path="/insights" element={insightsRoute} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="hidden md:flex h-8 border-t border-border/20 bg-bg-surface items-center overflow-hidden">
          <div className="ticker-track">
            {[...MARKET_TICKER, ...MARKET_TICKER].map((item, index) => (
              <div key={`${item.symbol}-${index}`} className="inline-flex items-center gap-2 mr-10">
                <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-accent">
                  {item.symbol}
                </span>
                <span
                  className={`text-[10px] font-mono ${
                    item.direction === "up"
                      ? "text-positive"
                      : item.direction === "down"
                        ? "text-negative"
                        : "text-text-muted"
                  }`}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </footer>
      </div>

      <MobileTabBar
        activeView={state.activeView}
        onNavigate={handleNavigate}
        onToggleTheme={handleThemeToggle}
      />

      {isAdmin && modalState.open ? (
        <TransactionModal
          key={`${modalState.mode}-${modalState.transaction?.id || "new"}`}
          isOpen={modalState.open}
          mode={modalState.mode}
          initialTransaction={modalState.transaction}
          categories={CATEGORY_OPTIONS}
          merchants={MERCHANT_OPTIONS}
          onClose={() => setModalState({ open: false, mode: "create", transaction: null })}
          onSave={handleSaveTransaction}
        />
      ) : null}
    </div>
  );
};

const App = () => {
  useEffect(() => {
    document.title = APP_TITLE;
  }, []);

  return (
    <AppProvider>
      <BrowserRouter>
        <DashboardShell />
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
