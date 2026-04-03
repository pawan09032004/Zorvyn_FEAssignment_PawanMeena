import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { CalendarDays, ChevronDown, Plus, Search, X } from "lucide-react";
import { COPY, TRANSACTION_TYPES } from "../../constants";

const FilterBar = ({
  filters,
  categories,
  onFilterChange,
  onClearFilters,
  hasActiveFilters,
  isAdmin,
  onAddTransaction,
}) => {
  const [searchDraft, setSearchDraft] = useState(filters.search);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      onFilterChange("search", searchDraft);
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [searchDraft, onFilterChange]);

  const toggleCategory = (category) => {
    if (filters.categories.includes(category)) {
      onFilterChange(
        "categories",
        filters.categories.filter((item) => item !== category),
      );
      return;
    }

    onFilterChange("categories", [...filters.categories, category]);
  };

  const clearAll = () => {
    setSearchDraft("");
    onClearFilters();
  };

  return (
    <section className="bg-bg-surface p-4 lg:p-5 border-b border-border/20 flex flex-col gap-4">
      <div className="flex flex-col xl:flex-row xl:items-center gap-3">
        <label
          htmlFor="transaction-search"
          className="relative flex-1 min-w-[220px]"
        >
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            id="transaction-search"
            aria-label={COPY.filterSearchPlaceholder}
            value={searchDraft}
            onChange={(event) => setSearchDraft(event.target.value)}
            placeholder={COPY.filterSearchPlaceholder}
            className="w-full bg-bg-surface-2 border border-border/20 focus:border-accent focus:ring-1 focus:ring-accent text-xs font-mono uppercase tracking-[0.12em] py-2.5 pl-9 pr-3"
          />
        </label>

        <details className="relative group">
          <summary className="list-none cursor-pointer bg-bg-surface-2 border border-border/20 hover:border-accent/40 transition-colors px-4 py-2.5 flex items-center gap-2 text-xs uppercase tracking-[0.12em] font-mono text-text-primary">
            <span>
              {filters.categories.length
                ? `${filters.categories.length} selected`
                : "All Categories"}
            </span>
            <ChevronDown size={13} className="text-text-muted" />
          </summary>
          <div className="absolute left-0 mt-2 w-64 bg-bg-surface-2 border border-border/40 p-3 z-20 shadow-ambient space-y-2 max-h-64 overflow-auto">
            {categories.map((category) => (
              <label
                key={category}
                className="flex items-center gap-2 text-xs uppercase tracking-[0.12em] font-mono text-text-primary"
              >
                <input
                  type="checkbox"
                  checked={filters.categories.includes(category)}
                  onChange={() => toggleCategory(category)}
                  className="border-border text-accent focus:ring-accent"
                />
                {category}
              </label>
            ))}
          </div>
        </details>

        <div className="flex bg-bg-surface-2 p-1 border border-border/20">
          {[TRANSACTION_TYPES.ALL, TRANSACTION_TYPES.INCOME, TRANSACTION_TYPES.EXPENSE].map(
            (type) => {
              const labels = {
                all: "All",
                income: "Income",
                expense: "Expense",
              };

              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => onFilterChange("type", type)}
                  className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.16em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    filters.type === type
                      ? "bg-accent text-on-accent"
                      : "text-text-muted hover:text-text-primary"
                  }`}
                >
                  {labels[type]}
                </button>
              );
            },
          )}
        </div>

        <div className="flex items-center gap-2 bg-bg-surface-2 border border-border/20 px-3 py-2.5">
          <CalendarDays size={14} className="text-text-muted" />
          <input
            aria-label="Date from"
            type="date"
            value={filters.dateFrom}
            onChange={(event) => onFilterChange("dateFrom", event.target.value)}
            className="bg-transparent border-none p-0 text-xs font-mono uppercase tracking-[0.1em] text-text-primary focus:ring-0"
          />
          <span className="text-text-muted text-xs font-mono">to</span>
          <input
            aria-label="Date to"
            type="date"
            value={filters.dateTo}
            onChange={(event) => onFilterChange("dateTo", event.target.value)}
            className="bg-transparent border-none p-0 text-xs font-mono uppercase tracking-[0.1em] text-text-primary focus:ring-0"
          />
        </div>

        {isAdmin ? (
          <button
            type="button"
            onClick={onAddTransaction}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-accent text-on-accent text-[11px] uppercase tracking-[0.18em] font-mono font-semibold hover:shadow-ambient transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <Plus size={13} />
            {COPY.addTransaction}
          </button>
        ) : null}
      </div>

      {hasActiveFilters ? (
        <div>
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex items-center gap-1 text-[11px] text-text-muted hover:text-accent uppercase tracking-[0.16em] font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <X size={13} />
            {COPY.clearFilters}
          </button>
        </div>
      ) : null}
    </section>
  );
};

FilterBar.propTypes = {
  filters: PropTypes.shape({
    categories: PropTypes.arrayOf(PropTypes.string).isRequired,
    type: PropTypes.oneOf(["all", "income", "expense"]).isRequired,
    dateFrom: PropTypes.string.isRequired,
    dateTo: PropTypes.string.isRequired,
    search: PropTypes.string.isRequired,
  }).isRequired,
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func.isRequired,
  hasActiveFilters: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  onAddTransaction: PropTypes.func.isRequired,
};

export default FilterBar;
