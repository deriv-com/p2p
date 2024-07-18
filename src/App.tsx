import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter5Adapter } from 'use-query-params/adapters/react-router-5';
import { AppFooter, AppHeader, DerivIframe, ErrorBoundary } from '@/components';
import { useRedirectToOauth, useTrackjs } from '@/hooks';
import AppContent from '@/routes/AppContent';
import { initializeI18n, TranslationProvider } from '@deriv-com/translations';
import { Loader, useDevice } from '@deriv-com/ui';

const { VITE_CROWDIN_BRANCH_NAME, VITE_PROJECT_NAME, VITE_TRANSLATIONS_CDN_URL } = process.env;
const i18nInstance = initializeI18n({
    cdnUrl: `${VITE_TRANSLATIONS_CDN_URL}/${VITE_PROJECT_NAME}/${VITE_CROWDIN_BRANCH_NAME}`,
});

const App = () => {
    const { init: initTrackJS } = useTrackjs();
    const { isDesktop } = useDevice();
    const { redirectToOauth } = useRedirectToOauth();

    redirectToOauth();
    initTrackJS();

    return (
        <BrowserRouter>
            {/* TODO: Replace the fallback element with the ErrorComponent */}
            <ErrorBoundary fallback={<div>fallback component</div>}>
                <QueryParamProvider adapter={ReactRouter5Adapter}>
                    <TranslationProvider defaultLang='EN' i18nInstance={i18nInstance}>
                        <Suspense fallback={<Loader isFullScreen />}>
                            <DerivIframe />
                            <AppHeader />
                            <AppContent />
                            {isDesktop && <AppFooter />}
                        </Suspense>
                    </TranslationProvider>
                </QueryParamProvider>
            </ErrorBoundary>
        </BrowserRouter>
    );
};
export default App;
