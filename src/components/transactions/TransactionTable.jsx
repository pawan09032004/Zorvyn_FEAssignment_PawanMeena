import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
} from "lucide-react";
import { TABLE_HEADERS } from "../../constants";
import { formatDate, formatINR } from "../../utils/formatters";

const TransactionTable = ({
  transactions,
  sort,
  onSortChange,
  page,
  totalPages,
  onPageChange,
  totalRows,
  isAdmin,
  onEdit,
  onDelete,
  onUndoDelete,
}) => {
  const [flashDeleteId, setFlashDeleteId] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(
    () => () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    },
    [],
  );

  const requestDelete = (transaction) => {
    setFlashDeleteId(transaction.id);

    window.setTimeout(() => {
      onDelete(transaction.id);
      setPendingDelete({ tx: transaction, secondsLeft: 3 });
      setFlashDeleteId(null);

      intervalRef.current = window.setInterval(() => {
        setPendingDelete((previous) => {
          if (!previous) {
            return previous;
          }

          return {
            ...previous,
            secondsLeft: Math.max(0, previous.secondsLeft - 1),
          };
        });
      }, 1000);

      timeoutRef.current = window.setTimeout(() => {
        setPendingDelete(null);
        window.clearInterval(intervalRef.current);
      }, 3000);
    }, 180);
  };

  const undoDelete = () => {
    if (!pendingDelete) {
      return;
    }

    onUndoDelete(pendingDelete.tx);
    setPendingDelete(null);

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }
  };

  const changeSort = (field) => {
    if (sort.field === field) {
      onSortChange({ field, dir: sort.dir === "asc" ? "desc" : "asc" });
      return;
    }

    onSortChange({ field, dir: "asc" });
  };

  return (
    <section className="relative bg-bg-base pb-12 md:pb-0">
      <div className="overflow-x-auto border-t-2 border-accent">
        <table className="w-full min-w-[880px] border-collapse">
          <thead className="bg-bg-base sticky top-0 z-10">
            <tr className="border-b border-border/30">
              {TABLE_HEADERS.map((header) => {
                const active = sort.field === header.key;

                return (
                  <th key={header.key} className={`py-4 px-4 ${header.key === "amount" ? "text-right" : "text-left"}`}>
                    <button
                      type="button"
                      onClick={() => changeSort(header.key)}
                      className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.16em] font-mono ${
                        active ? "text-accent" : "text-text-muted"
                      } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent`}
                    >
                      {header.label}
                      {active ? (
                        sort.dir === "asc" ? <ArrowUp size={12} /> : <ArrowDown size={12} />
                      ) : null}
                    </button>
                  </th>
                );
              })}
              {isAdmin ? <th className="w-24" /> : null}
            </tr>
          </thead>

          <tbody>
            {transactions.map((item, index) => (
              <tr
                key={item.id}
                tabIndex={0}
                onKeyDown={(event) => {
                  if (isAdmin && event.key === "Enter") {
                    onEdit(item);
                  }
                }}
                className={`group border-b border-border/10 ${
                  index % 2 === 0 ? "bg-bg-base" : "bg-bg-surface"
                } ${item.id === flashDeleteId ? "bg-negative/15" : "hover:bg-bg-surface-2"} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent`}
              >
                <td className="py-4 px-4 font-mono text-xs text-text-muted uppercase tracking-[0.12em]">
                  {formatDate(item.date)}
                </td>
                <td className="py-4 px-4 font-display text-2xl leading-none tracking-tight text-text-primary">
                  {item.merchant}
                </td>
                <td className="py-4 px-4">
                  <span className="inline-flex px-3 py-1 text-[10px] uppercase tracking-[0.12em] font-mono bg-bg-surface-2 border border-border/20 text-text-primary">
                    {item.category}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.14em] font-mono ${
                      item.type === "income" ? "text-tertiary" : "text-negative"
                    }`}
                  >
                    {item.type === "income" ? "IN" : "OUT"}
                  </span>
                </td>
                <td
                  className={`py-4 px-4 text-right font-mono text-sm md:text-base ${
                    item.type === "income" ? "text-tertiary" : "text-text-primary"
                  }`}
                >
                  {item.type === "income" ? "+" : "-"}
                  {formatINR(item.amount)}
                </td>
                {isAdmin ? (
                  <td className="py-4 px-4">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        aria-label={`Edit ${item.merchant}`}
                        onClick={() => onEdit(item)}
                        className="text-text-muted hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        aria-label={`Delete ${item.merchant}`}
                        onClick={() => requestDelete(item)}
                        className="text-text-muted hover:text-negative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-border/30 pt-4">
        <p className="text-[10px] uppercase tracking-[0.18em] text-text-muted font-mono">
          Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, totalRows)} of {totalRows} transactions
        </p>

        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Previous page"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            className="p-2 border border-border/20 bg-bg-surface disabled:opacity-30"
          >
            <ChevronLeft size={14} />
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map((value) => (
            <button
              key={value}
              type="button"
              aria-label={`Page ${value}`}
              onClick={() => onPageChange(value)}
              className={`px-3 py-2 text-[10px] font-mono ${
                value === page
                  ? "bg-accent text-on-accent"
                  : "bg-bg-surface border border-border/20 text-text-muted"
              }`}
            >
              {value}
            </button>
          ))}

          <button
            type="button"
            aria-label="Next page"
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="p-2 border border-border/20 bg-bg-surface disabled:opacity-30"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {pendingDelete ? (
        <div className="fixed bottom-20 md:bottom-6 right-4 bg-bg-surface-2 border border-border/30 px-4 py-3 flex items-center gap-3 shadow-ambient z-40">
          <p className="text-xs text-text-primary">
            Transaction removed. Undo in {pendingDelete.secondsLeft}s.
          </p>
          <button
            type="button"
            onClick={undoDelete}
            className="text-xs uppercase tracking-[0.14em] text-accent font-mono"
          >
            Undo
          </button>
        </div>
      ) : null}
    </section>
  );
};

TransactionTable.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      merchant: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      type: PropTypes.oneOf(["income", "expense"]).isRequired,
      amount: PropTypes.number.isRequired,
      note: PropTypes.string,
    }),
  ).isRequired,
  sort: PropTypes.shape({
    field: PropTypes.string.isRequired,
    dir: PropTypes.oneOf(["asc", "desc"]).isRequired,
  }).isRequired,
  onSortChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  totalRows: PropTypes.number.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUndoDelete: PropTypes.func.isRequired,
};

export default TransactionTable;
