import React from 'react';
import ReactDOM from 'react-dom/client';
import { ACCOUNT_TYPES, CURRENCIES } from '@/constants';
import { AppDataProvider } from '@deriv-com/api-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './main.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={new QueryClient()}>
            <AppDataProvider accountTypes={ACCOUNT_TYPES} currencies={CURRENCIES}>
                <App />
            </AppDataProvider>
        </QueryClientProvider>
    </React.StrictMode>
);
