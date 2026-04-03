import { useCallback, useMemo } from "react";
import { PAGE_SIZE } from "../constants";

const compareValues = (left, right, dir) => {
  if (left < right) {
    return dir === "asc" ? -1 : 1;
  }

  if (left > right) {
    return dir === "asc" ? 1 : -1;
  }

  return 0;
};

export const useTransactions = ({ transactions, filters }) => {
  const availableCategories = useMemo(
    () => [...new Set(transactions.map((item) => item.category))].sort(),
    [transactions],
  );

  const filteredTransactions = useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    return transactions
      .filter((item) => {
        if (filters.categories.length && !filters.categories.includes(item.category)) {
          return false;
        }

        if (filters.type !== "all" && item.type !== filters.type) {
          return false;
        }

        if (filters.dateFrom && item.date < filters.dateFrom) {
          return false;
        }

        if (filters.dateTo && item.date > filters.dateTo) {
          return false;
        }

        if (search) {
          const haystack = `${item.merchant} ${item.note}`.toLowerCase();
          return haystack.includes(search);
        }

        return true;
      })
      .sort((a, b) => {
        const { field, dir } = filters.sort;

        if (field === "amount") {
          return compareValues(a.amount, b.amount, dir);
        }

        if (field === "date") {
          return compareValues(a.date, b.date, dir);
        }

        return compareValues(
          String(a[field] ?? "").toLowerCase(),
          String(b[field] ?? "").toLowerCase(),
          dir,
        );
      });
  }, [transactions, filters]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredTransactions.length / PAGE_SIZE)),
    [filteredTransactions.length],
  );

  const getPaginatedTransactions = useCallback(
    (page) => {
      const safePage = Math.min(Math.max(1, page), totalPages);
      const start = (safePage - 1) * PAGE_SIZE;
      return filteredTransactions.slice(start, start + PAGE_SIZE);
    },
    [filteredTransactions, totalPages],
  );

  const hasActiveFilters = useMemo(
    () =>
      Boolean(
        filters.categories.length ||
          filters.type !== "all" ||
          filters.dateFrom ||
          filters.dateTo ||
          filters.search,
      ),
    [filters],
  );

  return {
    availableCategories,
    filteredTransactions,
    getPaginatedTransactions,
    hasActiveFilters,
    totalPages,
    totalRows: filteredTransactions.length,
  };
};
