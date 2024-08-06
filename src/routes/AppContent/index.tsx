import { useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { BlockedScenarios } from '@/components/BlockedScenarios';
import { BUY_SELL_URL, ERROR_CODES } from '@/constants';
import { api, useIsP2PBlocked, useLiveChat } from '@/hooks';
import { GuideTooltip } from '@/pages/guide/components';
import { AdvertiserInfoStateProvider } from '@/providers/AdvertiserInfoStateProvider';
import { getCurrentRoute } from '@/utils';
import { useTranslations } from '@deriv-com/translations';
import { Loader, Tab, Tabs, Text, useDevice } from '@deriv-com/ui';
import Router from '../Router';
import { getRoutes } from '../routes-config';
import './index.scss';

const AppContent = () => {
    const isGtmTracking = useRef(false);
    const history = useHistory();
    const location = useLocation();
    const { isDesktop } = useDevice();
    const { data: activeAccountData, isFetched, isLoading: isLoadingActiveAccount } = api.account.useActiveAccount();
    const { init: initLiveChat } = useLiveChat();
    const { isP2PBlocked, status } = useIsP2PBlocked();
    const { localize } = useTranslations();
    const routes = getRoutes(localize);

    const tabRoutesConfiguration = routes.filter(
        route =>
            route.name !== 'Advertiser' &&
            route.name !== 'Endpoint' &&
            route.name !== 'Guide' &&
            route.name !== 'P2PRedirectHandler'
    );

    const getActiveTab = (pathname: string) => {
        const match = routes.find(route => pathname.startsWith(route.path));
        return match ? match.name : BUY_SELL_URL;
    };

    const [activeTab, setActiveTab] = useState(() => getActiveTab(location.pathname));
    const [hasCreatedAdvertiser, setHasCreatedAdvertiser] = useState(false);
    const { isActive, subscribe: subscribeP2PSettings } = api.settings.useSettings();
    const {
        error,
        isActive: isSubscribed,
        isIdle,
        isLoading,
        subscribe: subscribeAdvertiserInfo,
    } = api.advertiser.useGetInfo();
    const isPermissionDenied = error?.code === ERROR_CODES.PERMISSION_DENIED;
    const isEndpointRoute = getCurrentRoute() === 'endpoint';

    useEffect(() => {
        initLiveChat();
    }, []);

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
            subscribeAdvertiserInfo({});
            setHasCreatedAdvertiser(false);
        }
    }, [hasCreatedAdvertiser, setHasCreatedAdvertiser, subscribeAdvertiserInfo]);

    useEffect(() => {
        setActiveTab(getActiveTab(location.pathname));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    useEffect(() => {
        if (!isGtmTracking.current) {
            window.dataLayer.push({ event: 'allow_tracking' });
            isGtmTracking.current = true;
        }
    }, []);

    const getComponent = () => {
        if ((isLoadingActiveAccount || !isFetched || !activeAccountData) && !isEndpointRoute) {
            return <Loader />;
        } else if ((isP2PBlocked && !isEndpointRoute) || isPermissionDenied) {
            return <BlockedScenarios type={status} />;
        } else if ((isFetched && activeAccountData) || isEndpointRoute) {
            return (
                <div className='app-content__body'>
                    <Tabs
                        activeTab={localize(activeTab)}
                        className='app-content__tabs'
                        onChange={index => {
                            setActiveTab(tabRoutesConfiguration[index].text || '');
                            history.push(tabRoutesConfiguration[index].path);
                        }}
                        variant='secondary'
                    >
                        {tabRoutesConfiguration.map(route => (
                            <Tab key={localize(route.name)} title={route.text || ''} />
                        ))}
                    </Tabs>
                    {isDesktop && !isEndpointRoute && <GuideTooltip />}
                    <Router />
                </div>
            );
        }

        return null;
    };

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
                <Text
                    align='center'
                    as='div'
                    className='app-content__title p-2'
                    size={isDesktop ? 'xl' : 'lg'}
                    weight='bold'
                >
                    Deriv P2P
                </Text>
                {getComponent()}
            </div>
        </AdvertiserInfoStateProvider>
    );
};

export default AppContent;
