import { Suspense, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter5Adapter } from 'use-query-params/adapters/react-router-5';
import { AppFooter, AppHeader, DerivIframe, ErrorBoundary } from '@/components';
import { useDatadog, useDerivAnalytics, useOAuth, useTrackjs } from '@/hooks';
import AppContent from '@/routes/AppContent';
import { initializeI18n, TranslationProvider } from '@deriv-com/translations';
import { Loader, useDevice } from '@deriv-com/ui';
import { URLConstants } from '@deriv-com/utils';
import { getCurrentRoute } from './utils';

const { VITE_CROWDIN_BRANCH_NAME, VITE_PROJECT_NAME, VITE_TRANSLATIONS_CDN_URL } = process.env;
const i18nInstance = initializeI18n({
    cdnUrl: `${VITE_TRANSLATIONS_CDN_URL}/${VITE_PROJECT_NAME}/${VITE_CROWDIN_BRANCH_NAME}`,
});

const App = () => {
    const { onRenderAuthCheck } = useOAuth();
    const { init: initTrackJS } = useTrackjs();
    const { initialise: initDatadog } = useDatadog();
    const { isDesktop } = useDevice();
    const { initialise: initDerivAnalytics } = useDerivAnalytics();
    const isCallbackPage = getCurrentRoute() === 'callback';
    const isProduction = process.env.VITE_NODE_ENV === 'production' || origin === URLConstants.derivP2pProduction;
    const isStaging = process.env.VITE_NODE_ENV === 'staging' || origin === URLConstants.derivP2pStaging;
    const isOAuth2Enabled = isProduction || isStaging;

    initTrackJS();
    initDerivAnalytics();
    initDatadog();

    useEffect(() => {
        onRenderAuthCheck();
    }, [onRenderAuthCheck]);

    return (
        <BrowserRouter>
            <ErrorBoundary>
                <QueryParamProvider adapter={ReactRouter5Adapter}>
                    <TranslationProvider defaultLang='EN' i18nInstance={i18nInstance}>
                        <Suspense
                            fallback={
                                <div className='flex h-full w-full items-center justify-center'>
                                    <Loader isFullScreen />
                                </div>
                            }
                        >
                            {!isOAuth2Enabled && <DerivIframe />}
                            {!isCallbackPage && <AppHeader />}
                            <AppContent />
                            {isDesktop && !isCallbackPage && <AppFooter />}
                        </Suspense>
                    </TranslationProvider>
                </QueryParamProvider>
            </ErrorBoundary>
        </BrowserRouter>
    );
};
export default App;
