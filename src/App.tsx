import { BrowserRouter } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter5Adapter } from 'use-query-params/adapters/react-router-5';
import { AppFooter, AppHeader } from '@/components';
import { initializeI18n, TranslationProvider } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
import AppContent from './routes/AppContent';

const i18nInstance = initializeI18n({
    cdnUrl: `https://pub-5ce11fcb15f34c0a9ce8ba7086d16e6a.r2.dev/${import.meta.env.VITE_PROJECT_NAME}/${import.meta.env.VITE_CROWDIN_BRANCH_NAME}`,
});

const App = () => {
    const { isDesktop } = useDevice();

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
