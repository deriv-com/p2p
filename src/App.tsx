/* eslint-disable no-console */
import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter5Adapter } from 'use-query-params/adapters/react-router-5';
import { AppFooter, AppHeader, DerivIframe } from '@/components';
import { getOauthUrl } from '@/constants';
import AppContent from '@/routes/AppContent';
import { getCurrentRoute } from '@/utils';
import { useAuthData } from '@deriv-com/api-hooks';
import { initializeI18n, TranslationProvider } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';

const { VITE_CROWDIN_BRANCH_NAME, VITE_PROJECT_NAME, VITE_TRANSLATIONS_CDN_URL } = import.meta.env;
const i18nInstance = initializeI18n({
    cdnUrl: `${VITE_TRANSLATIONS_CDN_URL}/${VITE_PROJECT_NAME}/${VITE_CROWDIN_BRANCH_NAME}`,
});

const App = () => {
    const { isDesktop } = useDevice();
    const { isAuthorized, isAuthorizing } = useAuthData();
    const isEndpointPage = getCurrentRoute() === 'endpoint';

    const oauthUrl = getOauthUrl();
    useEffect(() => {
        if (!isEndpointPage && !isAuthorized && !isAuthorizing) {
            window.open(oauthUrl, '_self');
        }
    }, [isAuthorized, isAuthorizing, isEndpointPage, oauthUrl]);

    return (
        <BrowserRouter>
            <QueryParamProvider adapter={ReactRouter5Adapter}>
                <TranslationProvider defaultLang='EN' i18nInstance={i18nInstance}>
                    <DerivIframe />
                    <AppHeader />
                    <AppContent />
                    {isDesktop && <AppFooter />}
                </TranslationProvider>
            </QueryParamProvider>
        </BrowserRouter>
    );
};
export default App;
