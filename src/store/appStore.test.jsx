import React, { useContext, useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'

import { AppStore, AppStoreProvider } from './appStore';

describe('AppStore', () => {
  const item = {
    id: '00001',
    timestamp: Date.now(),
    from: 'USDT',
    to: 'EUR',
    amount: '70',
  };

  const rates = [
    { currency: 'EUR', rate: '0.876543', timestamp: Date.now() },
    { currency: 'USD', rate: '1.000000', timestamp: Date.now() },
    { currency: 'USDT', rate: '1.000001', timestamp: Date.now() },
  ];

  test('intial state', () => {
    const Comp = () => {
      const { state } = useContext(AppStore);

      return (
        <>
          <span data-testid="tab">{state.tab}</span>
          <span data-testid="history">{state.history}</span>
          <span data-testid="rates">{JSON.stringify(state.rates)}</span>
          <span data-testid="toCurrency">{state.toCurrency}</span>
          <span data-testid="fromCurrency">{state.fromCurrency}</span>
          <span data-testid="amount">{state.amount}</span>
          <span data-testid="result">{state.result}</span>
          <span data-testid="conversionError">{state.conversionError}</span>
        </>
      );
    }

    render(
      <AppStoreProvider>
        <Comp />
      </AppStoreProvider>
    );

    expect(screen.getByTestId('tab').textContent).toEqual('converter');
    expect(screen.getByTestId('history').textContent).toEqual('');
    expect(screen.getByTestId('rates').textContent).toEqual('{}');
    expect(screen.getByTestId('toCurrency').textContent).toEqual('');
    expect(screen.getByTestId('fromCurrency').textContent).toEqual('');
    expect(screen.getByTestId('amount').textContent).toEqual('');
    expect(screen.getByTestId('result').textContent).toEqual('');
    expect(screen.getByTestId('conversionError').textContent).toEqual('');
  });

  test('SET_ACTIVE_TAB', async () => {
    const Comp = () => {
      const { state, dispatch } = useContext(AppStore);

      useEffect(() => {
        dispatch({ type: 'SET_ACTIVE_TAB', payload: 'history' });
      }, [])

      return (
        <>
          <span data-testid="tab">{state.tab}</span>
        </>
      )
    }

    render(
      <AppStoreProvider>
        <Comp />
      </AppStoreProvider>
    );

    expect(screen.getByTestId('tab').textContent).toEqual('history');
  });

  test('ADD_TO_HISTORY', async () => {
    const Comp = () => {
      const { state, dispatch } = useContext(AppStore);

      useEffect(() => {
        dispatch({ type: 'ADD_TO_HISTORY', payload: { ...item } });
      }, [])

      return (
        <>
          <span data-testid="history">{JSON.stringify(state.history)}</span>
        </>
      )
    }

    render(
      <AppStoreProvider>
        <Comp />
      </AppStoreProvider>
    );

    expect(screen.getByTestId('history').textContent).toEqual(JSON.stringify([{ ...item }]));
  });

  test('DELETE_FROM_HISTORY', async () => {
    const Comp = () => {
      const { state, dispatch } = useContext(AppStore);

      useEffect(() => {
        dispatch({ type: 'ADD_TO_HISTORY', payload: { ...item } });
        dispatch({ type: 'ADD_TO_HISTORY', payload: { ...item, id: '00002' } });
        dispatch({ type: 'DELETE_FROM_HISTORY', payload: '00001' });
      }, [])

      return (
        <>
          <span data-testid="history">{JSON.stringify(state.history)}</span>
        </>
      )
    }

    render(
      <AppStoreProvider>
        <Comp />
      </AppStoreProvider>
    );

    expect(screen.getByTestId('history').textContent).toEqual(JSON.stringify([{ ...item, id: '00002' }]));
  });

  test('REPLACE_HISTORY', async () => {
    const Comp = () => {
      const { state, dispatch } = useContext(AppStore);

      useEffect(() => {
        dispatch({ type: 'ADD_TO_HISTORY', payload: { ...item } });
        dispatch({ type: 'ADD_TO_HISTORY', payload: { ...item, id: '00002' } });
        dispatch({ type: 'REPLACE_HISTORY', payload: [{ ...item, id: '00003' }, { ...item, id: '00004' }] });
      }, [])

      return (
        <>
          <span data-testid="history">{JSON.stringify(state.history)}</span>
        </>
      )
    }

    render(
      <AppStoreProvider>
        <Comp />
      </AppStoreProvider>
    );

    expect(screen.getByTestId('history').textContent).toEqual(JSON.stringify([{ ...item, id: '00003' }, { ...item, id: '00004' }]));
  });

  test('LOAD_RATES', async () => {
    const Comp = () => {
      const { state, dispatch } = useContext(AppStore);

      useEffect(() => {
        dispatch({ type: 'LOAD_RATES', payload: [ ...rates ] });
      }, [])

      return (
        <>
          <span data-testid="rates">{JSON.stringify(Array.from(state.rates))}</span>
        </>
      )
    }

    render(
      <AppStoreProvider>
        <Comp />
      </AppStoreProvider>
    );

    expect(screen.getByTestId('rates').textContent)
      .toEqual(JSON.stringify(rates.map(({ currency, rate }) => [currency, rate])));
  });

  test('CONVERT', async () => {
    const Comp = () => {
      const { state, dispatch } = useContext(AppStore);

      useEffect(() => {
        dispatch({ type: 'LOAD_RATES', payload: [ ...rates ] });
      }, [])


      useEffect(() => {
        dispatch({ type: 'CONVERT', payload: { from: 'EUR', to: 'USD', amount: 45 } }); // 39.444435
      }, [state.rates]);

      return (
        <>
          <span data-testid="result">{state.result}</span>
        </>
      )
    }

    render(
      <AppStoreProvider>
        <Comp />
      </AppStoreProvider>
    );

    expect(screen.getByTestId('result').textContent).toEqual('39.444');
  });
});