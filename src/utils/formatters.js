const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const currencyWithPaiseFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const percentFormatter = new Intl.NumberFormat("en-IN", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export const formatINR = (value) => currencyFormatter.format(Number(value) || 0);

export const formatINRWithPaise = (value) =>
  currencyWithPaiseFormatter.format(Number(value) || 0);

export const formatCompactINR = (value) => {
  const amount = Number(value) || 0;

  if (Math.abs(amount) >= 1_00_00_000) {
    return `${amount < 0 ? "-" : ""}₹${(Math.abs(amount) / 1_00_00_000).toFixed(2)}Cr`;
  }

  if (Math.abs(amount) >= 1_00_000) {
    return `${amount < 0 ? "-" : ""}₹${(Math.abs(amount) / 1_00_000).toFixed(2)}L`;
  }

  if (Math.abs(amount) >= 1_000) {
    return `${amount < 0 ? "-" : ""}₹${(Math.abs(amount) / 1_000).toFixed(1)}K`;
  }

  return formatINR(amount);
};

export const formatPercentFromRatio = (ratio) => percentFormatter.format(ratio || 0);

export const formatPercentValue = (value) => `${(Number(value) || 0).toFixed(1)}%`;

export const formatDate = (date) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export const formatMonthLabel = (monthKey) =>
  new Date(`${monthKey}-01T00:00:00`).toLocaleDateString("en-IN", {
    month: "short",
    year: "2-digit",
  });

export const formatMonthLong = (monthKey) =>
  new Date(`${monthKey}-01T00:00:00`).toLocaleDateString("en-IN", {
    month: "long",
  });
