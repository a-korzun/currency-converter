import React, { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react';
import { nanoid } from 'nanoid';

import { getRates } from '../../services/api';
import { localStorage } from '../../services/localStorage';
import { AppStore  } from '../../store/appStore';
import Button from '../Button';

import './style.css';

function Converter() {
  const { state, dispatch } = useContext(AppStore);
  const { rates, fromCurrency, amount: storedAmount, toCurrency, conversionError, result } = state;

  const [loadingState, setLoadingState] = useState<'idle' | 'pending' | 'done' | 'error'>('idle');
  const [to, setTo] = useState<string>(toCurrency);
  const [from, setFrom] = useState<string>(fromCurrency);
  const [amount, setAmount] = useState<string>(storedAmount);

  useEffect(() => {
    const loadRates = async () => {
      setLoadingState('pending');

      try {
        const rates = await getRates();

        dispatch({ type: 'LOAD_RATES', payload: rates });

        setLoadingState('done');
      } catch (err) {
        setLoadingState('error');

        console.error(err);
      }
    }

    if (rates.size === 0) {
      loadRates();
    }
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    dispatch({ type: 'CONVERT', payload: { to, from, amount } });

    const newItem: HistoryItem = {
      id: nanoid(),
      timestamp: Date.now(),
      from,
      to,
      amount,
    };

    dispatch({ type: 'ADD_TO_HISTORY', payload: newItem });

    localStorage.setItem(
      'history',
      [
        ...(localStorage.getItem('history') as HistoryItem[] || []),
        newItem
      ]
    )
  }

  const handleAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replaceAll(',', '.');

    if (Number.isFinite(Number(value))) {
      setAmount(value);
    }
  }

  const handleSwap = () => {
    const localFrom = from;
    const localTo = to;

    setTo(localFrom);
    setFrom(localTo);
  }

  return (
    <div className="converter">
      <form className="converter__form" onSubmit={handleSubmit}>
        <div className="converter__group converter__form-item">
          <input
            className="converter__input"
            id="amount"
            placeholder="amount"
            value={amount}
            onChange={handleAmountChange}
            autoComplete="off"
          />
          <label className="converter__label" htmlFor="amount">Amount:</label>
        </div>
        <div className="converter__group converter__form-item">
          <input
            className="converter__input"
            id="from"
            placeholder="from"
            value={from}
            onChange={(event) => setFrom(event.target.value.trim().toUpperCase())}
            autoComplete="off"
          />
          <label className="converter__label" htmlFor="from">From:</label>
        </div>
        <Button className="converter__form-item" type="button" onClick={handleSwap} label="Swap"/>
        <div className="converter__group converter__form-item">
          <input
            className="converter__input"
            id="to"
            placeholder="to"
            value={to}
            onChange={(event) => setTo(event.target.value.trim().toUpperCase())}
            autoComplete="off"
          />
          <label className="converter__label" htmlFor="to">To:</label>
        </div>
        <Button className="converter__form-item" type="submit" disabled={loadingState === 'pending'} label="Convert" />
      </form>

      { conversionError && <div className="converter__error">{conversionError}</div> }

      { result && <div className="converter__result">
        {storedAmount}&nbsp;{fromCurrency} = <span className="converter__highlight">{result}&nbsp;{toCurrency}</span>
      </div>}
    </div>
  );
}

export default Converter;
