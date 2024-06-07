/* eslint-disable no-console */
import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter5Adapter } from 'use-query-params/adapters/react-router-5';
import { AppFooter, AppHeader, DerivIframe } from '@/components';
import { useAccountList, useAuthData } from '@deriv-com/api-hooks';
import { initializeI18n, TranslationProvider } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
import AppContent from './routes/AppContent';
import { getOauthUrl } from './constants';

const { VITE_CROWDIN_BRANCH_NAME, VITE_PROJECT_NAME, VITE_TRANSLATIONS_CDN_URL } = import.meta.env;
const i18nInstance = initializeI18n({
    cdnUrl: `${VITE_TRANSLATIONS_CDN_URL}/${VITE_PROJECT_NAME}/${VITE_CROWDIN_BRANCH_NAME}`,
});

const App = () => {
    const { isDesktop } = useDevice();
    const { data: accountList } = useAccountList();
    const { activeLoginid, isAuthorized } = useAuthData();

    const oauthUrl = getOauthUrl();
    useEffect(() => {
        const hasActiveLoginid = !!activeLoginid;
        const hasAccounts = !!accountList?.length;
        const shouldRedirectToLogin = !isAuthorized && !hasActiveLoginid && !hasAccounts;
        console.log('isAuthorized', isAuthorized);
        console.log('hasActiveLoginid', hasActiveLoginid);
        console.log('hasAccounts', hasAccounts);
        console.log('shouldRedirectToLogin', shouldRedirectToLogin);
        console.log('====');
        // if (shouldRedirectToLogin) {
        //     window.open(oauthUrl, '_self');
        // }
    }, [accountList, activeLoginid, isAuthorized, oauthUrl]);

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
