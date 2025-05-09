import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppDataProvider } from '@deriv-com/api-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './main.scss';

const urlParams = new URLSearchParams(location.search);
const currency = urlParams.get('account');
if (currency) localStorage.setItem('accountCurrency', currency);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={new QueryClient()}>
            <AppDataProvider accountType='CR' currency={localStorage.getItem('accountCurrency') ?? 'USD'}>
                <App />
            </AppDataProvider>
        </QueryClientProvider>
    </React.StrictMode>
);
