import PropTypes from "prop-types";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartErrorBoundary from "../common/ChartErrorBoundary";
import { formatINR, formatMonthLabel } from "../../utils/formatters";

const TooltipCard = ({ active, payload, label }) => {
  if (!active || !payload?.length) {
    return null;
  }

  const point = payload[0].payload;

  return (
    <div className="bg-bg-surface-2 border border-border/30 p-3 text-xs shadow-ambient">
      <p className="text-text-muted uppercase tracking-[0.16em] font-mono">{formatMonthLabel(label)}</p>
      <p className="text-text-primary font-mono text-sm mt-1">{formatINR(point.balance)}</p>
      <p className={`text-[10px] uppercase tracking-[0.12em] font-mono mt-1 ${point.net >= 0 ? "text-positive" : "text-negative"}`}>
        {point.net >= 0 ? "+" : ""}
        {formatINR(point.net)} net
      </p>
    </div>
  );
};

TooltipCard.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.arrayOf(PropTypes.object),
  label: PropTypes.string,
};

TooltipCard.defaultProps = {
  active: false,
  payload: [],
  label: "",
};

const BalanceTrendChart = ({ data }) => {
  return (
    <section className="bg-bg-surface p-6 lg:p-8 border-t-2 border-accent shadow-ambient">
      <div className="flex items-end justify-between gap-6 mb-8">
        <div>
          <h2 className="font-display text-2xl lg:text-4xl italic tracking-tight text-text-primary">
            6-Month Balance Trajectory
          </h2>
          <p className="text-[10px] uppercase tracking-[0.24em] text-text-muted font-mono mt-2">
            Aggregate net position across all linked accounts
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[640px] h-[280px]">
          <ChartErrorBoundary title="balance trend chart">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 16, right: 12, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--color-border)" strokeOpacity={0.2} vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke="var(--color-text-muted)"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10, fontFamily: "var(--font-mono)", letterSpacing: "0.15em" }}
                />
                <YAxis
                  stroke="var(--color-text-muted)"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `₹${Math.round(value / 1000)}k`}
                  tick={{ fontSize: 10, fontFamily: "var(--font-mono)", letterSpacing: "0.08em" }}
                />
                <Tooltip content={<TooltipCard />} cursor={{ stroke: "var(--color-accent)", strokeOpacity: 0.2 }} />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="var(--color-accent)"
                  strokeWidth={2}
                  fill="url(#balanceGradient)"
                  dot={{ r: 2, fill: "var(--color-accent)", stroke: "var(--color-accent)" }}
                  activeDot={{ r: 4, fill: "var(--color-bg-base)", stroke: "var(--color-accent)", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartErrorBoundary>
        </div>
      </div>
    </section>
  );
};

BalanceTrendChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      month: PropTypes.string.isRequired,
      monthKey: PropTypes.string.isRequired,
      balance: PropTypes.number.isRequired,
      net: PropTypes.number.isRequired,
    }),
  ).isRequired,
};

export default BalanceTrendChart;
