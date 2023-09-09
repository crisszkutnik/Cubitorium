import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { WalletContext } from './components/context/WalletContext.tsx';
import { NextUIProvider } from '@nextui-org/react';
import { AlertProvider } from './components/context/AlertContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WalletContext>
      <NextUIProvider>
        <main className="light">
          <AlertProvider>
            <App />
          </AlertProvider>
        </main>
      </NextUIProvider>
    </WalletContext>
  </React.StrictMode>,
);
