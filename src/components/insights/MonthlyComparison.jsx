import PropTypes from "prop-types";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartErrorBoundary from "../common/ChartErrorBoundary";
import { formatINR } from "../../utils/formatters";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="bg-bg-surface-2 border border-border/30 p-3 text-xs shadow-ambient">
      <p className="text-text-muted uppercase tracking-[0.16em] font-mono">{label}</p>
      <p className="text-tertiary mt-1 font-mono">Income: {formatINR(payload[0].value)}</p>
      <p className="text-negative mt-1 font-mono">Expense: {formatINR(payload[1].value)}</p>
    </div>
  );
};

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.arrayOf(PropTypes.object),
  label: PropTypes.string,
};

CustomTooltip.defaultProps = {
  active: false,
  payload: [],
  label: "",
};

const MonthlyComparison = ({ data }) => {
  return (
    <section className="bg-bg-surface p-6 lg:p-8 border-t-2 border-accent">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h3 className="font-display text-3xl italic tracking-tight text-text-primary">
            Flow Analysis
          </h3>
          <p className="text-xs text-text-muted italic">Historical Comparison</p>
        </div>

        <div className="flex items-center gap-5 text-[10px] uppercase tracking-[0.14em] font-mono text-text-muted">
          <span className="inline-flex items-center gap-2">
            <span className="w-2 h-2 bg-tertiary" />
            Income
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="w-2 h-2 bg-negative" />
            Expense
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[640px] h-72">
          <ChartErrorBoundary title="monthly comparison chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} barGap={8}>
                <CartesianGrid stroke="var(--color-border)" strokeOpacity={0.2} vertical={false} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  stroke="var(--color-text-muted)"
                  tick={{ fontSize: 10, fontFamily: "var(--font-mono)", letterSpacing: "0.14em" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  stroke="var(--color-text-muted)"
                  tickFormatter={(value) => `₹${Math.round(value / 1000)}k`}
                  tick={{ fontSize: 10, fontFamily: "var(--font-mono)" }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--color-bg-surface-2)" }} />
                <Bar dataKey="income" fill="var(--color-tertiary)" radius={0} />
                <Bar dataKey="expense" fill="var(--color-accent)" radius={0} />
              </BarChart>
            </ResponsiveContainer>
          </ChartErrorBoundary>
        </div>
      </div>
    </section>
  );
};

MonthlyComparison.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      month: PropTypes.string.isRequired,
      income: PropTypes.number.isRequired,
      expense: PropTypes.number.isRequired,
    }),
  ).isRequired,
};

export default MonthlyComparison;
