/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import PropTypes from "prop-types";
import { STORAGE_KEY, THEME_CLASS } from "../constants";
import { mockTransactions } from "../data/mockData";
import { appReducer, defaultFilters, defaultState } from "./AppReducer";

const AppContext = createContext(null);

const hydrateState = () => {
  if (typeof window === "undefined") {
    return {
      ...defaultState,
      transactions: mockTransactions,
    };
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return {
        ...defaultState,
        transactions: mockTransactions,
      };
    }

    const parsed = JSON.parse(stored);

    return {
      ...defaultState,
      ...parsed,
      filters: {
        ...defaultFilters,
        ...(parsed.filters || {}),
      },
      transactions: parsed.transactions?.length ? parsed.transactions : mockTransactions,
    };
  } catch {
    return {
      ...defaultState,
      transactions: mockTransactions,
    };
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, undefined, hydrateState);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    document.documentElement.classList.toggle(THEME_CLASS, state.theme === "light");
  }, [state.theme]);

  const addTransaction = useCallback(
    (payload) => dispatch({ type: "ADD_TRANSACTION", payload }),
    [],
  );

  const updateTransaction = useCallback(
    (payload) => dispatch({ type: "UPDATE_TRANSACTION", payload }),
    [],
  );

  const deleteTransaction = useCallback(
    (payload) => dispatch({ type: "DELETE_TRANSACTION", payload }),
    [],
  );

  const setRole = useCallback((payload) => dispatch({ type: "SET_ROLE", payload }), []);

  const setTheme = useCallback((payload) => dispatch({ type: "SET_THEME", payload }), []);

  const setFilter = useCallback(
    (key, value) => dispatch({ type: "SET_FILTER", payload: { key, value } }),
    [],
  );

  const clearFilters = useCallback(() => dispatch({ type: "CLEAR_FILTERS" }), []);

  const setView = useCallback((payload) => dispatch({ type: "SET_VIEW", payload }), []);

  const setSelectedCategory = useCallback(
    (payload) => dispatch({ type: "SET_SELECTED_CATEGORY", payload }),
    [],
  );

  const value = useMemo(
    () => ({
      state,
      dispatch,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      setRole,
      setTheme,
      setFilter,
      clearFilters,
      setView,
      setSelectedCategory,
    }),
    [
      state,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      setRole,
      setTheme,
      setFilter,
      clearFilters,
      setView,
      setSelectedCategory,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used inside AppProvider");
  }

  return context;
};
