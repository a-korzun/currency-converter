import React, { createContext, useReducer, Dispatch } from 'react';

import { Currency } from '../services/currency';

interface State {
  tab: 'converter' | 'history';
  history: HistoryItem[];
  rates: Map<string, string>;
  toCurrency: string;
  fromCurrency: string;
  amount: string;
  result: string;
  conversionError: string;
}

type Actions = { type: 'SET_ACTIVE_TAB', payload: State['tab'] }
  | { type: 'ADD_TO_HISTORY', payload: HistoryItem }
  | { type: 'DELETE_FROM_HISTORY', payload: HistoryItem['id'] }
  | { type: 'REPLACE_HISTORY', payload: HistoryItem[] }
  | { type: 'LOAD_RATES', payload: { currency: string; rate: string; timestamp: string; }[] }
  | { type: 'CONVERT', payload: { from: string, to: string, amount: string } };

const initialState: State = {
  tab: 'converter',
  history: [],
  rates: new Map(),
  toCurrency: '',
  fromCurrency: '',
  amount: '',
  result: '',
  conversionError: '',
}

function reducer(state: State, action: Actions): State {
  switch (action.type) {
    case 'SET_ACTIVE_TAB': {
      return {
        ...state,
        tab: action.payload,
      };
    }
    case 'ADD_TO_HISTORY': {
      return {
        ...state,
        history: [...state.history, action.payload],
      };
    }
    case 'DELETE_FROM_HISTORY': {
      return {
        ...state,
        history: state.history.filter(x => x.id !== action.payload),
      };
    }
    case 'REPLACE_HISTORY': {
      return {
        ...state,
        history: action.payload,
      };
    }
    case 'LOAD_RATES': {
      const rates = new Map(action.payload.map(({ currency, rate }) => [currency, rate]));

      return {
        ...state,
        rates,
      };
    }
    case 'CONVERT': {
      const { to, from, amount } = action.payload;
      if (!amount) {
        return {
          ...state,
          conversionError: 'Incorrect amount'
        };
      }

      if (!state.rates.has(from)) {
        return {
          ...state,
          conversionError: 'Incorrect source currency name'
        };
      }

      if (!state.rates.has(to)) {
        return {
          ...state,
          conversionError: 'Incorrect target currency name'
        };
      }

      const fromCurrencyInUSD = new Currency(state.rates.get(from) as string, 8).multiply(new Currency(amount));
      const toCurrencyInUSD = new Currency(state.rates.get(to) as string, 8).multiply(new Currency(amount));
      const result = new Currency(amount).multiply(fromCurrencyInUSD).divide(toCurrencyInUSD).format(3);

      return {
        ...state,
        conversionError: '',
        fromCurrency: from,
        toCurrency: to,
        amount,
        result,
      };
    }
  }
}

export const AppStore = createContext<{
  state: State;
  dispatch: Dispatch<Actions>;
}>({
  state: initialState,
  dispatch: () => null
});

export const AppStoreProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return <AppStore.Provider value={{ state, dispatch }}>{children}</AppStore.Provider>;
};
