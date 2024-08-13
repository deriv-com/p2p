import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppDataProvider } from '@deriv-com/api-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './main.scss';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <AppDataProvider>
                <App />
            </AppDataProvider>
        </QueryClientProvider>
    </React.StrictMode>
);
