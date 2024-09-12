import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppDataProvider } from '@deriv-com/api-hooks';
import { OAuth2Provider } from '@deriv-com/auth-client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { getOauthUrl } from './constants';
import './main.scss';

const oauthUrl = getOauthUrl();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={new QueryClient()}>
            <AppDataProvider>
                <OAuth2Provider oauthUrl={oauthUrl}>
                    <App />
                </OAuth2Provider>
            </AppDataProvider>
        </QueryClientProvider>
    </React.StrictMode>
);
