import PropTypes from "prop-types";
import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts";
import { CHART_COLORS } from "../../constants";
import { formatINR, formatPercentValue } from "../../utils/formatters";
import ChartErrorBoundary from "../common/ChartErrorBoundary";

const SpendingBreakdown = ({
  data,
  topMerchants,
  selectedCategory,
  onSelectCategory,
}) => {
  const swatchClasses = [
    "bg-positive",
    "bg-accent",
    "bg-tertiary",
    "bg-neutral-500",
    "bg-neutral-600",
    "bg-neutral-700",
  ];

  return (
    <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <article className="bg-bg-surface p-6 lg:p-8 border-t-2 border-accent">
        <div className="flex items-start justify-between mb-6">
          <h3 className="font-display text-2xl italic text-text-primary">Spending Allocation</h3>
          <span className="text-[10px] uppercase tracking-[0.18em] text-text-muted font-mono">
            Donut View
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10">
          <div className="h-52 w-full lg:w-56">
            <ChartErrorBoundary title="spending breakdown chart">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={82}
                    paddingAngle={2}
                    onClick={(entry) => onSelectCategory(entry?.name || null)}
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={CHART_COLORS.pie[index % CHART_COLORS.pie.length]}
                        stroke={
                          selectedCategory === entry.name
                            ? "var(--color-text-primary)"
                            : "var(--color-bg-surface)"
                        }
                        strokeWidth={selectedCategory === entry.name ? 2 : 1}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </ChartErrorBoundary>
          </div>

          <ul className="flex-1 space-y-3">
            {data.map((entry, index) => {
              const active = selectedCategory === entry.name;
              return (
                <li key={entry.name}>
                  <button
                    type="button"
                    onClick={() => onSelectCategory(active ? null : entry.name)}
                    className={`w-full flex items-center justify-between text-xs px-2 py-1.5 border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                      active
                        ? "bg-bg-surface-2 border-accent/40"
                        : "border-transparent hover:border-border/40"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 ${swatchClasses[index % swatchClasses.length]}`}
                        aria-hidden
                      />
                      <span className="font-mono uppercase tracking-[0.12em] text-text-primary">
                        {entry.name}
                      </span>
                    </span>
                    <span className="font-mono text-text-muted">
                      {formatINR(entry.value)} • {formatPercentValue(entry.percent)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </article>

      <article className="bg-bg-surface p-6 lg:p-8 border-t-2 border-accent">
        <div className="flex items-start justify-between mb-6">
          <h3 className="font-display text-2xl italic text-text-primary">Principal Outlets</h3>
          <span className="text-[10px] uppercase tracking-[0.18em] text-text-muted font-mono">
            Sorted by volume
          </span>
        </div>

        <ul className="space-y-4">
          {topMerchants.map((item) => (
            <li key={item.merchant} className="border-b border-border/20 pb-3">
              <div className="flex items-end justify-between gap-4">
                <p className="font-display text-xl tracking-tight text-text-primary">{item.merchant}</p>
                <p className="font-mono text-sm text-text-primary">{formatINR(item.amount)}</p>
              </div>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
};

SpendingBreakdown.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      percent: PropTypes.number.isRequired,
    }),
  ).isRequired,
  topMerchants: PropTypes.arrayOf(
    PropTypes.shape({
      merchant: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
    }),
  ).isRequired,
  selectedCategory: PropTypes.string,
  onSelectCategory: PropTypes.func.isRequired,
};

SpendingBreakdown.defaultProps = {
  selectedCategory: null,
};

export default SpendingBreakdown;
