import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { KPI_LABELS } from "../../constants";
import {
  formatCompactINR,
  formatPercentValue,
  formatPercentFromRatio,
} from "../../utils/formatters";

const useAnimatedValue = (target) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame;
    const duration = 900;
    const start = performance.now();

    const run = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - progress) * (1 - progress);
      setValue(target * eased);

      if (progress < 1) {
        frame = requestAnimationFrame(run);
      }
    };

    frame = requestAnimationFrame(run);

    return () => cancelAnimationFrame(frame);
  }, [target]);

  return value;
};

const DeltaBadge = ({ value, inverted }) => {
  const adjusted = inverted ? -value : value;
  const isUp = adjusted >= 0;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono uppercase tracking-[0.16em] ${
        isUp ? "text-positive bg-positive/10" : "text-negative bg-negative/10"
      }`}
    >
      {isUp ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
      {`${isUp ? "+" : ""}${adjusted.toFixed(1)}% vs last month`}
    </span>
  );
};

DeltaBadge.propTypes = {
  value: PropTypes.number.isRequired,
  inverted: PropTypes.bool,
};

DeltaBadge.defaultProps = {
  inverted: false,
};

const AnimatedMetric = ({ value, variant }) => {
  const animated = useAnimatedValue(value);

  if (variant === "percent") {
    return (
      <span className="text-3xl font-mono tracking-tight text-tertiary">
        {formatPercentValue(animated)}
      </span>
    );
  }

  return (
    <span className="text-3xl font-mono tracking-tight text-text-primary">
      {formatCompactINR(animated)}
    </span>
  );
};

AnimatedMetric.propTypes = {
  value: PropTypes.number.isRequired,
  variant: PropTypes.oneOf(["currency", "percent"]),
};

AnimatedMetric.defaultProps = {
  variant: "currency",
};

const SummaryCards = ({ kpis }) => {
  const cards = useMemo(
    () => [
      {
        key: "totalBalance",
        label: KPI_LABELS.totalBalance,
        value: kpis.totalBalance,
        delta: kpis.deltas.totalBalance,
        variant: "currency",
      },
      {
        key: "monthlyIncome",
        label: KPI_LABELS.monthlyIncome,
        value: kpis.monthlyIncome,
        delta: kpis.deltas.monthlyIncome,
        variant: "currency",
      },
      {
        key: "monthlyExpenses",
        label: KPI_LABELS.monthlyExpenses,
        value: kpis.monthlyExpenses,
        delta: kpis.deltas.monthlyExpenses,
        variant: "currency",
        invertedDelta: true,
      },
      {
        key: "savingsRate",
        label: KPI_LABELS.savingsRate,
        value: kpis.savingsRate,
        delta: kpis.deltas.savingsRate,
        variant: "percent",
      },
    ],
    [kpis],
  );

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
      {cards.map((card) => (
        <article
          key={card.key}
          className="bg-bg-surface p-5 lg:p-6 border-t-2 border-accent hover:shadow-ambient transition-shadow"
        >
          <div className="flex items-start justify-between gap-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-text-muted font-mono">
              {card.label}
            </span>
            <DeltaBadge value={card.delta} inverted={card.invertedDelta} />
          </div>

          <div className="mt-4">
            <AnimatedMetric value={card.value} variant={card.variant} />
          </div>

          <p className="mt-3 text-[10px] text-text-muted uppercase tracking-[0.16em] font-mono">
            {formatPercentFromRatio(Math.max(0, Math.min(1, kpis.monthlyIncome ? (kpis.monthlyIncome - kpis.monthlyExpenses) / kpis.monthlyIncome : 0)))}
            {" "}
            savings efficiency
          </p>
        </article>
      ))}
    </section>
  );
};

SummaryCards.propTypes = {
  kpis: PropTypes.shape({
    totalBalance: PropTypes.number.isRequired,
    monthlyIncome: PropTypes.number.isRequired,
    monthlyExpenses: PropTypes.number.isRequired,
    savingsRate: PropTypes.number.isRequired,
    deltas: PropTypes.shape({
      totalBalance: PropTypes.number.isRequired,
      monthlyIncome: PropTypes.number.isRequired,
      monthlyExpenses: PropTypes.number.isRequired,
      savingsRate: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
};

export default SummaryCards;
