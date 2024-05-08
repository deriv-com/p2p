import { BrowserRouter } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter5Adapter } from 'use-query-params/adapters/react-router-5';
import { AppFooter, AppHeader } from '@/components';
import AppContent from './routes/AppContent';

const App = () => {
    return (
        <BrowserRouter>
            <QueryParamProvider adapter={ReactRouter5Adapter}>
                <AppHeader />
                <AppContent />
                <AppFooter />
            </QueryParamProvider>
        </BrowserRouter>
    );
};
export default App;
