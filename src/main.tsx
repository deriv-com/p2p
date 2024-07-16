/* eslint-disable no-console */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { initTrackJS } from '@/utils/trackjs';
import { AppDataProvider } from '@deriv-com/api-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './main.scss';

initTrackJS();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={new QueryClient()}>
            <AppDataProvider>
                <App />
            </AppDataProvider>
        </QueryClientProvider>
    </React.StrictMode>
);
