import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";
import { COPY } from "../../constants";

const emptyForm = {
  date: "",
  merchant: "",
  category: "",
  type: "expense",
  amount: "",
  note: "",
};

const buildInitialForm = (initialTransaction) => {
  if (!initialTransaction) {
    return emptyForm;
  }

  return {
    date: initialTransaction.date,
    merchant: initialTransaction.merchant,
    category: initialTransaction.category,
    type: initialTransaction.type,
    amount: String(initialTransaction.amount),
    note: initialTransaction.note,
  };
};

const TransactionModal = ({
  isOpen,
  mode,
  initialTransaction,
  categories,
  merchants,
  onClose,
  onSave,
}) => {
  const [form, setForm] = useState(() => buildInitialForm(initialTransaction));
  const [errors, setErrors] = useState({});

  const warning = useMemo(() => {
    if (!form.date) {
      return "";
    }

    const today = new Date();
    const inputDate = new Date(`${form.date}T00:00:00`);
    return inputDate > today ? "This date is in the future." : "";
  }, [form.date]);

  if (!isOpen) {
    return null;
  }

  const onFieldChange = (key, value) => {
    setForm((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: "" }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.date) nextErrors.date = "Date is required";
    if (!form.merchant) nextErrors.merchant = "Merchant is required";
    if (!form.category) nextErrors.category = "Category is required";
    if (!form.amount) nextErrors.amount = "Amount is required";
    if (Number(form.amount) <= 0) nextErrors.amount = "Amount must be greater than zero";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const payload = {
      id:
        initialTransaction?.id ||
        (typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `t-${Date.now()}`),
      date: form.date,
      merchant: form.merchant,
      category: form.category,
      type: form.type,
      amount: Number(form.amount),
      note: form.note.trim(),
    };

    onSave(payload);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-bg-base/80 backdrop-blur-[2px] flex items-end md:items-center justify-center animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label={mode === "edit" ? COPY.editTransaction : COPY.newTransaction}
    >
      <form
        onSubmit={submit}
        className="w-full md:max-w-2xl bg-bg-surface border-t-2 border-accent p-6 md:p-8 animate-slideUp"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-3xl italic text-text-primary">
            {mode === "edit" ? COPY.editTransaction : COPY.newTransaction}
          </h2>
          <button
            type="button"
            aria-label="Close modal"
            onClick={onClose}
            className="text-text-muted hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="space-y-1">
            <span className="text-[10px] uppercase tracking-[0.16em] text-text-muted font-mono">Date</span>
            <input
              type="date"
              value={form.date}
              onChange={(event) => onFieldChange("date", event.target.value)}
              className="w-full bg-bg-surface-2 border border-border/20 focus:border-accent focus:ring-1 focus:ring-accent text-sm"
            />
            {errors.date ? <span className="text-negative text-xs">{errors.date}</span> : null}
            {warning ? <span className="text-accent text-xs">{warning}</span> : null}
          </label>

          <label className="space-y-1">
            <span className="text-[10px] uppercase tracking-[0.16em] text-text-muted font-mono">Merchant</span>
            <input
              type="text"
              value={form.merchant}
              onChange={(event) => onFieldChange("merchant", event.target.value)}
              list="merchant-options"
              className="w-full bg-bg-surface-2 border border-border/20 focus:border-accent focus:ring-1 focus:ring-accent text-sm"
            />
            <datalist id="merchant-options">
              {merchants.map((merchant) => (
                <option key={merchant} value={merchant} />
              ))}
            </datalist>
            {errors.merchant ? <span className="text-negative text-xs">{errors.merchant}</span> : null}
          </label>

          <label className="space-y-1">
            <span className="text-[10px] uppercase tracking-[0.16em] text-text-muted font-mono">Category</span>
            <select
              value={form.category}
              onChange={(event) => onFieldChange("category", event.target.value)}
              className="w-full bg-bg-surface-2 border border-border/20 focus:border-accent focus:ring-1 focus:ring-accent text-sm"
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category ? <span className="text-negative text-xs">{errors.category}</span> : null}
          </label>

          <fieldset className="space-y-1">
            <legend className="text-[10px] uppercase tracking-[0.16em] text-text-muted font-mono mb-1">
              Type
            </legend>
            <div className="inline-flex bg-bg-surface-2 border border-border/20 p-1">
              {[
                { label: "Income", value: "income" },
                { label: "Expense", value: "expense" },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => onFieldChange("type", item.value)}
                  className={`px-4 py-1.5 text-[10px] uppercase tracking-[0.16em] font-mono ${
                    form.type === item.value
                      ? "bg-accent text-on-accent"
                      : "text-text-muted"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="space-y-1">
            <span className="text-[10px] uppercase tracking-[0.16em] text-text-muted font-mono">Amount</span>
            <input
              type="number"
              min="0"
              value={form.amount}
              onChange={(event) => onFieldChange("amount", event.target.value)}
              className="w-full bg-bg-surface-2 border border-border/20 focus:border-accent focus:ring-1 focus:ring-accent text-sm"
            />
            {errors.amount ? <span className="text-negative text-xs">{errors.amount}</span> : null}
          </label>

          <label className="space-y-1 md:col-span-2">
            <span className="text-[10px] uppercase tracking-[0.16em] text-text-muted font-mono">Note</span>
            <textarea
              rows={3}
              value={form.note}
              onChange={(event) => onFieldChange("note", event.target.value)}
              className="w-full bg-bg-surface-2 border border-border/20 focus:border-accent focus:ring-1 focus:ring-accent text-sm resize-none"
            />
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs uppercase tracking-[0.16em] font-mono border border-border/30 text-text-muted hover:text-text-primary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 text-xs uppercase tracking-[0.16em] font-mono bg-accent text-on-accent hover:shadow-ambient"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

TransactionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  mode: PropTypes.oneOf(["create", "edit"]).isRequired,
  initialTransaction: PropTypes.shape({
    id: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    merchant: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    type: PropTypes.oneOf(["income", "expense"]).isRequired,
    amount: PropTypes.number.isRequired,
    note: PropTypes.string,
  }),
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  merchants: PropTypes.arrayOf(PropTypes.string).isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

TransactionModal.defaultProps = {
  initialTransaction: null,
};

export default TransactionModal;
