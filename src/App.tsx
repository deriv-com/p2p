import { BrowserRouter } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter5Adapter } from 'use-query-params/adapters/react-router-5';
import { AppFooter, AppHeader } from '@/components';
import { initializeI18n, TranslationProvider } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
import AppContent from './routes/AppContent';

const { VITE_CROWDIN_BRANCH_NAME, VITE_PROJECT_NAME, VITE_TRANSLATIONS_CDN_URL } = import.meta.env;

const i18nInstance = initializeI18n({
    cdnUrl: `${VITE_TRANSLATIONS_CDN_URL}/${VITE_PROJECT_NAME}/${VITE_CROWDIN_BRANCH_NAME}`,
});

const App = () => {
    const { isDesktop } = useDevice();
    // eslint-disable-next-line no-console
    console.log(
        'VITE_CROWDIN_BRANCH_NAME',
        VITE_CROWDIN_BRANCH_NAME,
        'VITE_PROJECT_NAME',
        VITE_PROJECT_NAME,
        'VITE_TRANSLATIONS_CDN_URL',
        VITE_TRANSLATIONS_CDN_URL
    );
    // eslint-disable-next-line no-console
    console.log(`${VITE_TRANSLATIONS_CDN_URL}/${VITE_PROJECT_NAME}/${VITE_CROWDIN_BRANCH_NAME}`);

    return (
        <BrowserRouter>
            <QueryParamProvider adapter={ReactRouter5Adapter}>
                <TranslationProvider defaultLang='EN' i18nInstance={i18nInstance}>
                    <AppHeader />
                    <AppContent />
                    {isDesktop && <AppFooter />}
                </TranslationProvider>
            </QueryParamProvider>
        </BrowserRouter>
    );
};
export default App;
