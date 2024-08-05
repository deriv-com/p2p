import { Suspense, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter5Adapter } from 'use-query-params/adapters/react-router-5';
import { AppFooter, AppHeader, DerivIframe, ErrorBoundary } from '@/components';
import { useDerivAnalytics, useRedirectToOauth, useTrackjs } from '@/hooks';
import AppContent from '@/routes/AppContent';
import { initializeI18n, TranslationProvider } from '@deriv-com/translations';
import { Loader, useDevice } from '@deriv-com/ui';
import { URLConstants } from '@deriv-com/utils';
import useGrowthbookGetFeatureValue from './hooks/custom-hooks/useGrowthbookGetFeatureValue';

const { VITE_CROWDIN_BRANCH_NAME, VITE_PROJECT_NAME, VITE_TRANSLATIONS_CDN_URL } = process.env;
const i18nInstance = initializeI18n({
    cdnUrl: `${VITE_TRANSLATIONS_CDN_URL}/${VITE_PROJECT_NAME}/${VITE_CROWDIN_BRANCH_NAME}`,
});

const App = () => {
    const [ShouldRedirectToDerivApp, isGBLoaded] = useGrowthbookGetFeatureValue({
        featureFlag: 'redirect_to_deriv_app_p2p',
    });
    const { init: initTrackJS } = useTrackjs();
    const { isDesktop } = useDevice();
    const { redirectToOauth } = useRedirectToOauth();
    const { initialise: initDerivAnalytics } = useDerivAnalytics();

    initTrackJS();
    initDerivAnalytics();
    redirectToOauth();

    useEffect(() => {
        if (isGBLoaded && ShouldRedirectToDerivApp) {
            const NODE_ENV = process.env.VITE_NODE_ENV;
            const APP_URL = NODE_ENV === 'production' ? URLConstants.derivAppProduction : URLConstants.derivAppStaging;
            window.location.href = `${APP_URL}/cashier/p2p`;
        }
    }, [isGBLoaded, ShouldRedirectToDerivApp]);
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
