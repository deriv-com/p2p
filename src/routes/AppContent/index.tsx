import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { BUY_SELL_URL } from '@/constants';
import { api } from '@/hooks';
import { AdvertiserInfoStateProvider } from '@/providers/AdvertiserInfoStateProvider';
import { getCurrentRoute } from '@/utils';
import { Loader, Tab, Tabs } from '@deriv-com/ui';
import Router from '../Router';
import { routes } from '../routes-config';
import './index.scss';

const tabRoutesConfiguration = routes.filter(route => route.name !== 'Advertiser' && route.name !== 'Endpoint');

const AppContent = () => {
    const history = useHistory();
    const location = useLocation();
    const { data: activeAccountData, isLoading: isLoadingActiveAccount } = api.account.useActiveAccount();

    const getActiveTab = (pathname: string) => {
        const match = routes.find(route => pathname.startsWith(route.path));
        return match ? match.name : BUY_SELL_URL;
    };

    const [activeTab, setActiveTab] = useState(() => getActiveTab(location.pathname));
    const [hasCreatedAdvertiser, setHasCreatedAdvertiser] = useState(false);
    const { subscribe: subscribeP2PSettings } = api.settings.useSettings();
    const {
        error,
        isActive: isSubscribed,
        isIdle,
        isLoading,
        subscribe: subscribeAdvertiserInfo,
    } = api.advertiser.useGetInfo();
    const isEndpointRoute = getCurrentRoute() === 'endpoint';

    useEffect(() => {
        if (activeAccountData) {
            subscribeP2PSettings({});
        }
    }, [activeAccountData, subscribeP2PSettings]);

    useEffect(() => {
        subscribeAdvertiserInfo({});
    }, [subscribeAdvertiserInfo]);

    // Need this to subscribe to advertiser info after user has created an advertiser.
    // setHasCreatedAdvertiser is triggered inside of NicknameModal.
    useEffect(() => {
        if (hasCreatedAdvertiser) {
            subscribeAdvertiserInfo({});
        }
    }, [hasCreatedAdvertiser, subscribeAdvertiserInfo]);

    useEffect(() => {
        setActiveTab(getActiveTab(location.pathname));
    }, [location]);

    if ((isLoadingActiveAccount || !activeAccountData) && !isEndpointRoute) {
        return <Loader />;
    }

    // NOTE: Replace this with P2PBlocked component later and a custom hook useIsP2PEnabled, P2P is only available for USD accounts
    if (activeAccountData?.currency !== 'USD' && !isEndpointRoute)
        return <h1>P2P is only available for USD accounts.</h1>;

    return (
        <AdvertiserInfoStateProvider
            value={{
                error,
                isIdle,
                isLoading,
                isSubscribed,
                setHasCreatedAdvertiser,
            }}
        >
            <div className='app-content'>
                <Tabs
                    activeTab={activeTab}
                    className='app-content__tabs'
                    onChange={index => {
                        setActiveTab(tabRoutesConfiguration[index].name);
                        history.push(tabRoutesConfiguration[index].path);
                    }}
                    variant='secondary'
                >
                    {tabRoutesConfiguration.map(route => (
                        <Tab key={route.name} title={route.name} />
                    ))}
                </Tabs>
                <Router />
            </div>
        </AdvertiserInfoStateProvider>
    );
};

export default AppContent;
