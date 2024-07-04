import { FC, Suspense } from 'react';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';
import { TCurrency } from 'types';
import { Page404 } from '@/components';
import { BUY_SELL_URL } from '@/constants';
import { Loader } from '@deriv-com/ui';
import { routes } from './routes-config';

type TState = { [key: string]: string[] | TCurrency | string; from: string };

declare module 'react-router-dom' {
    export function useHistory(): {
        goBack: () => void;
        push: (path: string, state?: TState) => void;
        replace(arg0: { pathname: string; search: string }): void;
    };

    export function useRouteMatch(path: string): boolean;
}

type TRoutesWithSubRoutes = {
    component: FC<RouteComponentProps>;
    path: string;
    routes?: TRoutesWithSubRoutes[];
};

const RouteWithSubRoutes = (route: TRoutesWithSubRoutes) => {
    return (
        <Switch>
            {/* Render subroutes recursively with any number of nested routes */}
            {route.routes?.map(subRoute => <RouteWithSubRoutes key={subRoute.path} {...subRoute} />)}
            <Route component={route.component} exact path={route.path} />
            <Route component={Page404} />
        </Switch>
    );
};

const Router: FC = () => {
    return (
        <Suspense fallback={<Loader isFullScreen />}>
            <Switch>
                {routes.map(route => (
                    <RouteWithSubRoutes key={route.path} {...route} />
                ))}
                <Redirect exact from='/' to={BUY_SELL_URL} />
                <Route component={Page404} />
            </Switch>
        </Suspense>
    );
};

export default Router;
