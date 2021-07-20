import React, { useContext } from 'react';

import { localStorage } from '../../services/localStorage';
import { AppStore  } from '../../store/appStore';
import Button from '../Button';

import './style.css';

function ConversionHistory () {
  const { state: { history }, dispatch } = useContext(AppStore);

  const handleView = (item: HistoryItem) => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: 'converter' });
    dispatch({ type: 'CONVERT', payload: { to: item.to, from: item.from, amount: item.amount } });
  }

  const handleDelete = (item: HistoryItem) => {
    dispatch({ type: 'DELETE_FROM_HISTORY', payload: item.id });

    localStorage.setItem(
      'history',
      (localStorage.getItem('history') as HistoryItem[] || []).filter(el => el.id !== item.id),
    )
  }

  if (history.length === 0) {
    return <div className="conversion-history__placeholder">History is empty...</div>;
  }

  return (
    <table className="conversion-history table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Event</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {
          [...history].reverse().map(el => (
            <tr key={el.id} className="conversion-history__row">
              <td>{(new Date(el.timestamp)).toLocaleString()}</td>
              <td>Converted an amount of {el.amount} from {el.from} to {el.to}</td>
              <td>
                <div className="conversion-history__actions">
                  <Button className="conversion-history__action" onClick={() => handleView(el)} label="View" />
                  <Button className="conversion-history__action _delete" onClick={() => handleDelete(el)} label="Delete" />
                </div>
              </td>
            </tr>
          ))
        }
      </tbody>
    </table>
  )
}

export default ConversionHistory;
