import PropTypes from "prop-types";
import { LayoutDashboard, ReceiptText, SunMoon, TrendingUp } from "lucide-react";
import { MOBILE_TABS, VIEWS } from "../../constants";

const iconMap = {
  LayoutDashboard,
  ReceiptText,
  TrendingUp,
  SunMoon,
};

const MobileTabBar = ({ activeView, onNavigate, onToggleTheme }) => {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 h-16 bg-bg-surface border-t border-border/30 z-40 grid grid-cols-4">
      {MOBILE_TABS.map((item) => {
        const Icon = iconMap[item.icon];
        const isThemeButton = item.key === "theme";
        const isActive = !isThemeButton && activeView === item.key;

        return (
          <button
            key={item.key}
            type="button"
            aria-label={item.label}
            onClick={() => {
              if (isThemeButton) {
                onToggleTheme();
                return;
              }
              onNavigate(item.key);
            }}
            className={`flex flex-col items-center justify-center gap-1 text-[10px] uppercase tracking-[0.14em] font-mono transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              isActive ? "text-accent" : "text-text-muted"
            }`}
          >
            <Icon size={15} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

MobileTabBar.propTypes = {
  activeView: PropTypes.oneOf([VIEWS.OVERVIEW, VIEWS.TRANSACTIONS, VIEWS.INSIGHTS]).isRequired,
  onNavigate: PropTypes.func.isRequired,
  onToggleTheme: PropTypes.func.isRequired,
};

export default MobileTabBar;
