import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { ACCOUNT_TYPES, CURRENCIES } from '@/constants';
import { AppDataProvider } from '@deriv-com/api-hooks';
import { Loader } from '@deriv-com/ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { useTMB, useTMBFeatureFlag } from './hooks';
import './main.scss';

const CustomAppDataProvider = memo(() => {
    const { data: isTMBEnabled, isInitialized } = useTMBFeatureFlag();
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
        if (isInitialized && isTMBEnabled) {
            initSession();
        }
    }, [isInitialized, initSession]);

    if (!isInitialized || (isTMBEnabled && !isSessionActive)) {
        return (
            <div className='flex h-full w-full items-center justify-center'>
                <Loader isFullScreen />
            </div>
        );
    }

    return (
        <AppDataProvider accountTypes={ACCOUNT_TYPES} currencies={CURRENCIES}>
            <App isTMBEnabled={isTMBEnabled} isTMBInitialized={isInitialized} />
        </AppDataProvider>
    );
});

CustomAppDataProvider.displayName = 'CustomAppDataProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={new QueryClient()}>
            <CustomAppDataProvider />
        </QueryClientProvider>
    </React.StrictMode>
);
