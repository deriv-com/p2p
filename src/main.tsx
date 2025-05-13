import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { AppDataProvider } from '@deriv-com/api-hooks';
import { Loader } from '@deriv-com/ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { useTMB } from './hooks';
import './main.scss';

const urlParams = new URLSearchParams(location.search);
const currency = urlParams.get('currency') || 'USD';
const isTMBEnabled = JSON.parse(localStorage.getItem('is_tmb_enabled') ?? 'false');

const CustomAppDataProvider = memo(() => {
    const [isSessionActive, setIsSessionActive] = useState(false);
    const { onRenderTMBCheck } = useTMB();
    const initRef = useRef(false);

    // Use useCallback to memoize the init function
    const initSession = useCallback(async () => {
        // Check both the module-level flag and the ref
        if (initRef.current) return;

        await onRenderTMBCheck();
        // Set both flags to prevent future calls
        initRef.current = true;
        setIsSessionActive(true);
    }, [onRenderTMBCheck]);

    useEffect(() => {
        initSession();
    }, [initSession]);

    if (!isSessionActive) {
        return (
            <div className='flex h-full w-full items-center justify-center'>
                <Loader isFullScreen />
            </div>
        );
    }

    return (
        <AppDataProvider accountType='CR' currency={currency}>
            <App />
        </AppDataProvider>
    );
});

CustomAppDataProvider.displayName = 'CustomAppDataProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={new QueryClient()}>
            {isTMBEnabled && <CustomAppDataProvider />}
            {!isTMBEnabled && (
                <AppDataProvider accountType='CR' currency={currency}>
                    <App />
                </AppDataProvider>
            )}
        </QueryClientProvider>
    </React.StrictMode>
);
