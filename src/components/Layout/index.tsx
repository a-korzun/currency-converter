import React, { useEffect, useContext } from 'react';

import { AppStore } from '../../store/appStore';
import { localStorage } from '../../services/localStorage';
import Converter from '../../components/Converter';
import ExchangeHistory from '../../components/ExchangeHistory';
import ConversionHistory from '../../components/ConversionHistory';

import './style.css';

function Layout() {
  const { state: { tab }, dispatch } = useContext(AppStore);

  useEffect(() => {
    dispatch({ type: 'REPLACE_HISTORY', payload: (localStorage.getItem('history') as HistoryItem[] || []) })
  }, [])

  const tabContent = tab === 'converter'
    ? <>
        <Converter />
        <ExchangeHistory />
      </>
    : <ConversionHistory />;

  return (
    <div className="layout">
        <ul className="layout__tabs">
          <li>
            <button
              className={`layout__tab ${tab === 'converter' ? '_active' : ''}`}
              onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: 'converter' })}
            >
                Currency Converter
            </button>
          </li>
          <li>
            <button
              className={`layout__tab ${tab === 'history' ? '_active' : ''}`}
              onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: 'history' })}
            >
              Conversion History
            </button>
          </li>
      </ul>
      <div className="layout__content">
        {tabContent}
      </div>
    </div>
  )
}

export default Layout;
