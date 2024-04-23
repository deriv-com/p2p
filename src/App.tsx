import { BrowserRouter } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter5Adapter } from 'use-query-params/adapters/react-router-5';

import { Header } from '@/components';

import AppContent from './routes/AppContent';

const App = () => {
    return (
        <BrowserRouter>
            <QueryParamProvider adapter={ReactRouter5Adapter}>
                <Header />
                <AppContent />
            </QueryParamProvider>
        </BrowserRouter>
    );
};
export default App;
