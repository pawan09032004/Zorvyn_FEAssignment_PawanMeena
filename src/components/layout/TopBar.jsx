import PropTypes from "prop-types";
import { Bell, CalendarDays, Moon, Search, Sun } from "lucide-react";
import { COPY } from "../../constants";

const TopBar = ({
  dateRangeLabel,
  search,
  onSearchChange,
  theme,
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 h-16 flex items-center justify-between px-4 md:px-6 lg:px-8 bg-bg-base border-b border-border/30 z-30">
      <div className="flex items-center gap-3 md:gap-4 min-w-0">
        <label
          htmlFor="global-search"
          className="hidden md:flex items-center gap-2 bg-bg-surface px-3 py-2 border border-border/20 focus-within:ring-1 focus-within:ring-accent"
        >
          <Search size={14} className="text-text-muted" />
          <input
            id="global-search"
            aria-label={COPY.topBarSearchPlaceholder}
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={COPY.topBarSearchPlaceholder}
            className="bg-transparent border-none p-0 text-xs font-mono uppercase tracking-[0.14em] placeholder:text-text-muted/60 text-text-primary focus:ring-0 min-w-[180px]"
          />
        </label>

        <div className="flex items-center gap-2 bg-bg-surface px-3 py-2 border border-border/20">
          <CalendarDays size={14} className="text-text-muted" />
          <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.16em] text-accent font-semibold">
            {dateRangeLabel}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <button
          type="button"
          aria-label="Notifications"
          className="text-text-muted hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent p-1"
        >
          <Bell size={16} />
        </button>

        <button
          type="button"
          aria-label="Toggle theme"
          onClick={onToggleTheme}
          className="text-text-muted hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent p-1"
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <div className="hidden md:flex items-center px-2 py-1 border border-border/20 bg-bg-surface text-[10px] uppercase tracking-[0.24em] text-text-muted font-mono">
          CMD K
        </div>
      </div>
    </header>
  );
};

TopBar.propTypes = {
  dateRangeLabel: PropTypes.string.isRequired,
  search: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  theme: PropTypes.oneOf(["dark", "light"]).isRequired,
  onToggleTheme: PropTypes.func.isRequired,
};

export default TopBar;
