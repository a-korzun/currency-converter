import React, { ChangeEvent, useContext, useEffect, useState } from 'react';

import { getExchangeHistory } from '../../services/api';
import { AppStore  } from '../../store/appStore';

import Chart from '../Chart';

import './style.css';

function ExchangeHistory() {
  const { state: { fromCurrency, result } } = useContext(AppStore);

  const [loadingState, setLoadingState] = useState<'idle' | 'pending' | 'done' | 'error'>('idle');
  const [duration, setDuration] = useState<number>(7);
  const [history, setHistory] = useState<ExchangeHistoryItem[]>([]);
  const [view, setView] = useState<'table' | 'chart'>('table');

  const loadHistory = async () => {
    const start = new Date();
    const end = new Date();

    start.setDate(start.getDate() - duration);

    setLoadingState('pending');

    try {
      const history = await getExchangeHistory(fromCurrency, start, end);

      setHistory(history);

      setLoadingState('done');
    } catch (err) {
      setLoadingState('error');

      console.error(err);
    }
  }

  useEffect(() => {
    if (fromCurrency) {
      loadHistory()
    }
  }, [duration, result]);

  const handleDurationChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setDuration(Number(event.target.value));
  }

  if (!result) {
    return null;
  }

  const table = (
    <table className="exchange-history__table table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Exchange rate</th>
        </tr>
      </thead>
      <tbody>
        {history.map(el => (
          <tr key={el.timestamp}>
            <td>{el.timestamp.split('T')[0]}</td>
            <td>{Number(el.rate).toFixed(6)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const chart = <Chart history={history} width={600} height={200} />;

  return (
    <div className="exchange-history">
      <h3>Exchange history</h3>
      <select
        disabled={loadingState === 'pending'}
        value={duration}
        onChange={handleDurationChange}
      >
        <option value="7">7 days</option>
        <option value="14">14 days</option>
        <option value="30">30 days</option>
      </select>

      <label>
        <input name="view" type="radio" checked={view === 'table'} onChange={() => setView('table')} />
        Table
      </label>

      <label>
        <input name="view" type="radio" checked={view === 'chart'} onChange={() => setView('chart')} />
        Chart
      </label>

      { view === 'table' ? table : chart }

    </div>
  )
}

export default ExchangeHistory;
