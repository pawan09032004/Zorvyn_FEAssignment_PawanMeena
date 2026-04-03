import PropTypes from "prop-types";
import {
  Cog,
  Eye,
  LayoutDashboard,
  ReceiptText,
  Settings,
  TrendingUp,
} from "lucide-react";
import { APP_SUBTITLE, APP_TITLE, NAV_ITEMS, ROLES } from "../../constants";

const iconMap = {
  LayoutDashboard,
  ReceiptText,
  TrendingUp,
};

const roleButtonClass =
  "flex-1 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] font-mono border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

const Sidebar = ({ activeView, onNavigate, role, onRoleChange }) => {
  return (
    <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:flex md:w-12 lg:w-60 flex-col justify-between bg-bg-base border-r border-border/20 z-40">
      <div className="pt-6">
        <div className="px-3 lg:px-6 pb-8">
          <p className="font-display text-xl lg:text-2xl font-black tracking-[0.2em] text-accent leading-none">
            {APP_TITLE}
          </p>
          <p className="hidden lg:block text-[10px] uppercase tracking-[0.2em] text-text-muted mt-1 font-mono">
            {APP_SUBTITLE}
          </p>
        </div>

        <nav className="space-y-2 px-2 lg:px-4" aria-label="Primary">
          {NAV_ITEMS.map((item) => {
            const Icon = iconMap[item.icon];
            const isActive = activeView === item.key;

            return (
              <button
                type="button"
                key={item.key}
                onClick={() => onNavigate(item.key)}
                aria-label={item.label}
                className={`w-full flex items-center gap-3 px-2 lg:px-4 py-2.5 border-l-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  isActive
                    ? "bg-bg-surface text-accent border-accent"
                    : "text-text-muted border-transparent hover:bg-bg-surface hover:text-text-primary"
                }`}
              >
                <Icon size={16} strokeWidth={1.8} />
                <span className="hidden lg:block font-mono text-xs uppercase tracking-[0.16em]">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="px-2 lg:px-4 pb-6 space-y-4">
        <button
          type="button"
          aria-label="Settings"
          className="w-full flex items-center gap-3 px-2 lg:px-4 py-2 text-text-muted hover:text-text-primary hover:bg-bg-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <Settings size={16} strokeWidth={1.8} />
          <span className="hidden lg:block font-mono text-xs uppercase tracking-[0.16em]">Settings</span>
        </button>

        <div className="bg-bg-surface p-2 border border-border/30">
          <div className="hidden lg:flex items-center gap-2 mb-2">
            <span className="text-text-muted text-[10px] uppercase tracking-[0.2em] font-mono">Mode</span>
          </div>

          <div className="flex lg:flex-row flex-col gap-1">
            <button
              type="button"
              onClick={() => onRoleChange(ROLES.VIEWER)}
              className={`${roleButtonClass} ${
                role === ROLES.VIEWER
                  ? "bg-bg-surface-2 text-text-primary border-accent/30"
                  : "text-text-muted border-border/30"
              }`}
            >
              <span className="inline-flex items-center gap-1 justify-center">
                <Eye size={12} />
                <span className="hidden lg:inline">👁 Viewer</span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => onRoleChange(ROLES.ADMIN)}
              className={`${roleButtonClass} ${
                role === ROLES.ADMIN
                  ? "bg-accent text-on-accent border-accent"
                  : "text-text-muted border-border/30"
              }`}
            >
              <span className="inline-flex items-center gap-1 justify-center">
                <Cog size={12} />
                <span className="hidden lg:inline">⚙ Admin</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

Sidebar.propTypes = {
  activeView: PropTypes.oneOf(["overview", "transactions", "insights"]).isRequired,
  onNavigate: PropTypes.func.isRequired,
  role: PropTypes.oneOf(["viewer", "admin"]).isRequired,
  onRoleChange: PropTypes.func.isRequired,
};

export default Sidebar;
