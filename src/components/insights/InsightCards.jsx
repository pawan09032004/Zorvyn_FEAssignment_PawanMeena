import PropTypes from "prop-types";
import {
  ArrowDownRight,
  ArrowUpRight,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { INSIGHT_CARD_LABELS } from "../../constants";
import { formatINR, formatPercentValue } from "../../utils/formatters";

const InsightCards = ({ peakCategory, expenseDelta, projectedBalance }) => {
  const isExpenseDown = expenseDelta <= 0;

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
      <article className="bg-bg-surface p-6 border-t-2 border-accent min-h-44 flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <TrendingUp className="text-accent" size={24} />
          <span className="text-[10px] uppercase tracking-[0.16em] text-text-muted font-mono">
            {INSIGHT_CARD_LABELS.peakSpending}
          </span>
        </div>
        <div>
          <p className="font-display text-2xl text-text-primary tracking-tight">{peakCategory.name}</p>
          <p className="font-mono text-3xl text-accent mt-1">{formatINR(peakCategory.value)}</p>
        </div>
      </article>

      <article className="bg-bg-surface p-6 border-t-2 border-accent min-h-44 flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <Target className="text-tertiary" size={24} />
          <span className="text-[10px] uppercase tracking-[0.16em] text-text-muted font-mono">
            Efficiency Delta
          </span>
        </div>
        <div>
          <p className="font-display text-2xl text-text-primary tracking-tight">{INSIGHT_CARD_LABELS.delta}</p>
          <p className={`font-mono text-3xl mt-1 inline-flex items-center gap-1 ${isExpenseDown ? "text-tertiary" : "text-negative"}`}>
            {isExpenseDown ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
            {formatPercentValue(Math.abs(expenseDelta))}
          </p>
        </div>
      </article>

      <article className="bg-bg-surface p-6 border-t-2 border-accent min-h-44 flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <Wallet className="text-text-primary" size={24} />
          <span className="text-[10px] uppercase tracking-[0.16em] text-text-muted font-mono">
            Year End Outlook
          </span>
        </div>
        <div>
          <p className="font-display text-2xl text-text-primary tracking-tight">
            {INSIGHT_CARD_LABELS.projectedBalance}
          </p>
          <p className="font-mono text-3xl text-text-primary mt-1">{formatINR(projectedBalance)}</p>
        </div>
      </article>
    </section>
  );
};

InsightCards.propTypes = {
  peakCategory: PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
  }).isRequired,
  expenseDelta: PropTypes.number.isRequired,
  projectedBalance: PropTypes.number.isRequired,
};

export default InsightCards;
