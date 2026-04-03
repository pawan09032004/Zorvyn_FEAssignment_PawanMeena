import { ROLES, SORT_FIELDS, TRANSACTION_TYPES, VIEWS } from "../constants";

export const defaultFilters = {
  categories: [],
  type: TRANSACTION_TYPES.ALL,
  dateFrom: "",
  dateTo: "",
  search: "",
  sort: {
    field: SORT_FIELDS.DATE,
    dir: "desc",
  },
};

export const defaultState = {
  transactions: [],
  role: ROLES.VIEWER,
  theme: "dark",
  filters: defaultFilters,
  activeView: VIEWS.OVERVIEW,
  selectedCategory: null,
};

export const appReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TRANSACTION": {
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };
    }

    case "UPDATE_TRANSACTION": {
      return {
        ...state,
        transactions: state.transactions.map((item) =>
          item.id === action.payload.id ? action.payload : item,
        ),
      };
    }

    case "DELETE_TRANSACTION": {
      return {
        ...state,
        transactions: state.transactions.filter((item) => item.id !== action.payload),
      };
    }

    case "SET_ROLE": {
      return {
        ...state,
        role: action.payload,
      };
    }

    case "SET_THEME": {
      return {
        ...state,
        theme: action.payload,
      };
    }

    case "SET_FILTER": {
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.key]: action.payload.value,
        },
      };
    }

    case "CLEAR_FILTERS": {
      return {
        ...state,
        filters: defaultFilters,
        selectedCategory: null,
      };
    }

    case "SET_VIEW": {
      return {
        ...state,
        activeView: action.payload,
      };
    }

    case "SET_SELECTED_CATEGORY": {
      return {
        ...state,
        selectedCategory: action.payload,
        filters: {
          ...state.filters,
          categories: action.payload ? [action.payload] : [],
        },
      };
    }

    default:
      return state;
  }
};
