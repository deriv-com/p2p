import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { BUY_SELL_URL } from '@/constants';
import { api } from '@/hooks';
import { useUserInfoStore } from '@/store';
import { getCurrentRoute } from '@/utils';
import { Loader, Tab, Tabs, Text, useDevice } from '@deriv-com/ui';
import Router from '../Router';
import { routes } from '../routes-config';
import './index.scss';

const tabRoutesConfiguration = routes.filter(
    route => route.name !== 'Advertiser' && route.name !== 'Endpoint' && route.name !== 'P2PRedirectHandler'
);

const AppContent = () => {
    const history = useHistory();
    const location = useLocation();
    const { isDesktop } = useDevice();
    const { data: activeAccountData, isLoading: isLoadingActiveAccount } = api.account.useActiveAccount();
    const { hasCreatedAdvertiser, setHasCreatedAdvertiser, setUserInfoState } = useUserInfoStore(
        useShallow(state => ({
            hasCreatedAdvertiser: state.hasCreatedAdvertiser,
            setHasCreatedAdvertiser: state.setHasCreatedAdvertiser,
            setUserInfoState: state.setUserInfoState,
        }))
    );

    const getActiveTab = (pathname: string) => {
        const match = routes.find(route => pathname.startsWith(route.path));
        return match ? match.name : BUY_SELL_URL;
    };

    const [activeTab, setActiveTab] = useState(() => getActiveTab(location.pathname));
    const { isActive, subscribe: subscribeP2PSettings } = api.settings.useSettings();
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeAccountData]);

    useEffect(() => {
        if (isActive) subscribeAdvertiserInfo({});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isActive]);

    // Need this to subscribe to advertiser info after user has created an advertiser.
    // setHasCreatedAdvertiser is triggered inside of NicknameModal.
    useEffect(() => {
        if (hasCreatedAdvertiser) {
            // @ts-expect-error passthrough value is not defined in the type
            subscribeAdvertiserInfo({ passthrough: { id: 'nickname' } });
            setHasCreatedAdvertiser(false);
        }
    }, [hasCreatedAdvertiser, setHasCreatedAdvertiser, subscribeAdvertiserInfo]);

    useEffect(() => {
        setActiveTab(getActiveTab(location.pathname));
    }, [location]);

    useEffect(() => {
        if (isSubscribed)
            setUserInfoState({
                error,
                isActive: isSubscribed,
                isIdle,
                isLoading,
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSubscribed]);

    return (
        <div className='app-content'>
            <Text
                align='center'
                as='div'
                className='app-content__title p-2'
                size={isDesktop ? 'xl' : 'lg'}
                weight='bold'
            >
                Deriv P2P
            </Text>
            {isLoadingActiveAccount && !isEndpointRoute ? (
                <Loader />
            ) : (
                <>
                    <div className='app-content__body'>
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
                                <Tab key={route.name} title={route.name!} />
                            ))}
                        </Tabs>
                        <Router />
                    </div>
                </>
            )}
        </div>
    );
};

export default AppContent;
