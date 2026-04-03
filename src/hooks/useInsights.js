import { useMemo } from "react";
import {
  buildMonthlySeries,
  computeInsightMetrics,
  computeKpiMetrics,
  getSpendingByCategory,
  getTopMerchants,
} from "../utils/analytics";

export const useInsights = (transactions) => {
  return useMemo(() => {
    const monthlySeries = buildMonthlySeries(transactions, 6);
    const latestMonthKey = monthlySeries[monthlySeries.length - 1]?.monthKey;

    const kpis = computeKpiMetrics(transactions);
    const insights = computeInsightMetrics(transactions);
    const spendingBreakdown = latestMonthKey
      ? getSpendingByCategory(transactions, latestMonthKey)
      : [];
    const topMerchants = getTopMerchants(transactions, 4, latestMonthKey);

    return {
      monthlySeries,
      latestMonthKey,
      kpis,
      insights,
      spendingBreakdown,
      topMerchants,
    };
  }, [transactions]);
};
