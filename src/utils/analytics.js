import { formatMonthLabel, formatMonthLong } from "./formatters";

export const toMonthKey = (date) => date.slice(0, 7);

const normalizeAmount = (transaction) =>
  transaction.type === "income" ? transaction.amount : -transaction.amount;

const sortByDateAsc = (a, b) => new Date(a.date) - new Date(b.date);

const uniqueSortedMonthKeys = (transactions) => {
  const keys = [...new Set(transactions.map((item) => toMonthKey(item.date)))];
  return keys.sort();
};

const addMonths = (monthKey, delta) => {
  const [year, month] = monthKey.split("-").map(Number);
  const date = new Date(year, month - 1 + delta, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};

export const getLastNMonthKeys = (transactions, n = 6) => {
  const monthKeys = uniqueSortedMonthKeys(transactions);

  if (!monthKeys.length) {
    return [];
  }

  const latest = monthKeys[monthKeys.length - 1];
  const keys = [];

  for (let index = n - 1; index >= 0; index -= 1) {
    keys.push(addMonths(latest, -index));
  }

  return keys;
};

export const aggregateByMonth = (transactions) => {
  const result = {};

  transactions.forEach((item) => {
    const key = toMonthKey(item.date);

    if (!result[key]) {
      result[key] = {
        income: 0,
        expense: 0,
      };
    }

    if (item.type === "income") {
      result[key].income += item.amount;
    } else {
      result[key].expense += item.amount;
    }
  });

  return result;
};

export const buildMonthlySeries = (transactions, months = 6) => {
  const monthMap = aggregateByMonth(transactions);
  const keys = getLastNMonthKeys(transactions, months);

  let runningBalance = 0;
  const historical = [...transactions].sort(sortByDateAsc);

  if (keys.length) {
    const firstVisibleMonth = keys[0];
    runningBalance = historical
      .filter((item) => toMonthKey(item.date) < firstVisibleMonth)
      .reduce((total, item) => total + normalizeAmount(item), 0);
  }

  return keys.map((monthKey) => {
    const income = monthMap[monthKey]?.income ?? 0;
    const expense = monthMap[monthKey]?.expense ?? 0;
    const net = income - expense;

    runningBalance += net;

    return {
      monthKey,
      month: formatMonthLabel(monthKey),
      income,
      expense,
      net,
      balance: runningBalance,
    };
  });
};

const percentDelta = (current, previous) => {
  if (!previous && !current) {
    return 0;
  }

  if (!previous) {
    return 100;
  }

  return ((current - previous) / Math.abs(previous)) * 100;
};

export const computeKpiMetrics = (transactions) => {
  const monthlySeries = buildMonthlySeries(transactions, 6);
  const totalBalance = transactions.reduce(
    (total, item) => total + normalizeAmount(item),
    0,
  );
  const latest = monthlySeries[monthlySeries.length - 1] || {
    income: 0,
    expense: 0,
    net: 0,
  };
  const previous = monthlySeries[monthlySeries.length - 2] || {
    income: 0,
    expense: 0,
    net: 0,
  };

  const savingsRate = latest.income
    ? ((latest.income - latest.expense) / latest.income) * 100
    : 0;
  const previousSavingsRate = previous.income
    ? ((previous.income - previous.expense) / previous.income) * 100
    : 0;

  return {
    totalBalance,
    monthlyIncome: latest.income,
    monthlyExpenses: latest.expense,
    savingsRate,
    deltas: {
      totalBalance: percentDelta(latest.net, previous.net),
      monthlyIncome: percentDelta(latest.income, previous.income),
      monthlyExpenses: percentDelta(latest.expense, previous.expense),
      savingsRate: percentDelta(savingsRate, previousSavingsRate),
    },
  };
};

export const getSpendingByCategory = (transactions, monthKey) => {
  const grouped = {};
  let total = 0;

  transactions.forEach((item) => {
    if (item.type !== "expense" || toMonthKey(item.date) !== monthKey) {
      return;
    }

    grouped[item.category] = (grouped[item.category] || 0) + item.amount;
    total += item.amount;
  });

  return Object.entries(grouped)
    .map(([name, value]) => ({
      name,
      value,
      percent: total ? (value / total) * 100 : 0,
    }))
    .sort((a, b) => b.value - a.value);
};

export const getTopMerchants = (transactions, limit = 4, monthKey) => {
  const grouped = {};

  transactions.forEach((item) => {
    if (item.type !== "expense") {
      return;
    }

    if (monthKey && toMonthKey(item.date) !== monthKey) {
      return;
    }

    grouped[item.merchant] = (grouped[item.merchant] || 0) + item.amount;
  });

  return Object.entries(grouped)
    .map(([merchant, amount]) => ({ merchant, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit);
};

const linearProjection = (series, monthsAhead) => {
  if (!series.length) {
    return 0;
  }

  if (series.length === 1) {
    return series[0].balance;
  }

  const recent = series.slice(-3);
  const slopes = [];

  for (let index = 1; index < recent.length; index += 1) {
    slopes.push(recent[index].net - recent[index - 1].net);
  }

  const avgSlope = slopes.length
    ? slopes.reduce((total, value) => total + value, 0) / slopes.length
    : 0;

  const currentBalance = recent[recent.length - 1].balance;
  const currentNet = recent[recent.length - 1].net;

  let projected = currentBalance;

  for (let step = 1; step <= monthsAhead; step += 1) {
    projected += currentNet + avgSlope * step;
  }

  return projected;
};

const categoryGrowthObservation = (transactions, currentMonthKey, previousMonthKey) => {
  const current = getSpendingByCategory(transactions, currentMonthKey);
  const previous = getSpendingByCategory(transactions, previousMonthKey);
  const previousMap = new Map(previous.map((item) => [item.name, item.value]));

  let best = null;

  current.forEach((item) => {
    const previousValue = previousMap.get(item.name) || 0;
    const growth = previousValue
      ? ((item.value - previousValue) / previousValue) * 100
      : 100;

    if (!best || growth > best.growth) {
      best = {
        ...item,
        growth,
      };
    }
  });

  if (!best) {
    return "No material month-over-month spending changes were detected in your current portfolio activity.";
  }

  const cap = Math.max(1000, Math.round((best.value * 0.8) / 1000) * 1000);

  return `You spent ${Math.abs(best.growth).toFixed(0)}% ${
    best.growth >= 0 ? "more" : "less"
  } on ${best.name} in ${formatMonthLong(
    currentMonthKey,
  )}. Consider a ₹${cap.toLocaleString("en-IN")} monthly cap.`;
};

export const computeInsightMetrics = (transactions) => {
  const monthlySeries = buildMonthlySeries(transactions, 6);

  if (!monthlySeries.length) {
    return {
      peakCategory: { name: "N/A", value: 0 },
      expenseDelta: 0,
      projectedBalance: 0,
      monthlyComparison: [],
      observation:
        "No transaction history is available yet. Add entries to unlock narrative insights.",
    };
  }

  const currentMonthKey = monthlySeries[monthlySeries.length - 1].monthKey;
  const previousMonthKey =
    monthlySeries[monthlySeries.length - 2]?.monthKey || currentMonthKey;

  const currentSpending = getSpendingByCategory(transactions, currentMonthKey);
  const peakCategory = currentSpending[0] || { name: "N/A", value: 0 };

  const currentExpense = monthlySeries[monthlySeries.length - 1].expense;
  const previousExpense = monthlySeries[monthlySeries.length - 2]?.expense || 0;
  const expenseDelta = percentDelta(currentExpense, previousExpense);

  const projectedBalance = linearProjection(monthlySeries, 3);

  const observation = categoryGrowthObservation(
    transactions,
    currentMonthKey,
    previousMonthKey,
  );

  return {
    peakCategory,
    expenseDelta,
    projectedBalance,
    monthlyComparison: monthlySeries.map((item) => ({
      month: item.month,
      income: item.income,
      expense: item.expense,
    })),
    observation,
  };
};
