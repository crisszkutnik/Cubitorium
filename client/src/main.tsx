import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { WalletContext } from './components/context/WalletContext.tsx';
import { NextUIProvider } from '@nextui-org/react';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WalletContext>
      <NextUIProvider>
        <div>
          <App />
        </div>
      </NextUIProvider>
    </WalletContext>
  </React.StrictMode>,
);
