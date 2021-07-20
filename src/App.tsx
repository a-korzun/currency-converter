import React from 'react';

import { AppStoreProvider } from './store/appStore';
import Layout from './components/Layout';

function App() {
  return (
    <AppStoreProvider>
      <Layout />
    </AppStoreProvider>
  );
}

export default App;
