import { QueryParamProvider } from 'use-query-params';
import { ReactRouter5Adapter } from 'use-query-params/adapters/react-router-5';
import AppContent from './routes/AppContent';

const App = () => {
    return (
        <QueryParamProvider adapter={ReactRouter5Adapter}>
            <AppContent />
        </QueryParamProvider>
    );
};
export default App;
