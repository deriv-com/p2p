import { useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { BlockedScenarios } from '@/components/BlockedScenarios';
import { ErrorModal, SafetyAlertModal } from '@/components/Modals';
import { BUY_SELL_URL, ERROR_CODES } from '@/constants';
import { api, useIsP2PBlocked, useLiveChat, useModalManager, useOAuth } from '@/hooks';
import { GuideTooltip } from '@/pages/guide/components';
import { AdvertiserInfoStateProvider } from '@/providers/AdvertiserInfoStateProvider';
import { useIsLoadingOidcStore } from '@/stores';
import { getCurrentRoute } from '@/utils';
import { useAccountList } from '@deriv-com/api-hooks';
import { requestOidcAuthentication } from '@deriv-com/auth-client';
import { useTranslations } from '@deriv-com/translations';
import { Loader, Tab, Tabs, Text, useDevice } from '@deriv-com/ui';
import { URLConstants } from '@deriv-com/utils';
import CallbackPage from '../CallbackPage';
import Router from '../Router';
import { getRoutes } from '../routes-config';
import './index.scss';

const AppContent = () => {
    const isGtmTracking = useRef(false);
    const history = useHistory();
    const location = useLocation();
    const { isDesktop } = useDevice();
    const {
        accountListError,
        authError,
        data: activeAccountData,
        isFetched,
        isLoading: isLoadingActiveAccount,
    } = api.account.useActiveAccount();
    const { data: accountList = [] } = useAccountList();
    const { init: initLiveChat } = useLiveChat();
    const { localize } = useTranslations();
    const { hideModal, isModalOpenFor, showModal } = useModalManager();
    const { oAuthLogout } = useOAuth({ showErrorModal: () => showModal('ErrorModal') });
    const routes = getRoutes(localize);
    const origin = window.location.origin;
    const isProduction = process.env.VITE_NODE_ENV === 'production' || origin === URLConstants.derivP2pProduction;
    const isStaging = process.env.VITE_NODE_ENV === 'staging' || origin === URLConstants.derivP2pStaging;
    const isOAuth2Enabled = isProduction || isStaging;

    const tabRoutesConfiguration = routes.filter(
        route =>
            route.name !== 'Advertiser' &&
            route.name !== 'Endpoint' &&
            route.name !== 'Guide' &&
            route.name !== 'P2PRedirectHandler' &&
            route.name !== 'CallbackPage'
    );

    const getActiveTab = (pathname: string) => {
        const match = routes.find(route => pathname.startsWith(route.path));
        return match ? match.name : BUY_SELL_URL;
    };

    const [activeTab, setActiveTab] = useState(() => getActiveTab(location.pathname));
    const [hasCreatedAdvertiser, setHasCreatedAdvertiser] = useState(false);
    const { isCheckingOidcTokens, setIsCheckingOidcTokens } = useIsLoadingOidcStore(
        useShallow(state => ({
            isCheckingOidcTokens: state.isCheckingOidcTokens,
            setIsCheckingOidcTokens: state.setIsCheckingOidcTokens,
        }))
    );
    const {
        error: p2pSettingsError,
        isActive,
        isLoading: isP2PSettingsLoading,
        subscribe: subscribeP2PSettings,
    } = api.settings.useSettings();
    const { isP2PBlocked, status } = useIsP2PBlocked();
    const {
        error,
        isActive: isSubscribed,
        isIdle,
        isLoading,
        subscribe: subscribeAdvertiserInfo,
    } = api.advertiser.useGetInfo();
    const isPermissionDenied = error?.code === ERROR_CODES.PERMISSION_DENIED;
    const isEndpointRoute = getCurrentRoute() === 'endpoint';
    const isCallbackPage = getCurrentRoute() === 'callback';
    const [hasMissingCurrencies, setHasMissingCurrencies] = useState(true);

    useEffect(() => {
        initLiveChat();
        window.addEventListener('unhandledrejection', () => {
            showModal('ErrorModal');
        });
    }, []);

    useEffect(() => {
        if (activeAccountData) {
            subscribeP2PSettings({});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeAccountData]);

    // Check if the account list currencies are in the client accounts currencies which is taken from OIDC tokens
    // If not, request OIDC authentication
    useEffect(() => {
        if (!isOAuth2Enabled) {
            setIsCheckingOidcTokens(false);
            setHasMissingCurrencies(false);
        }

        if (accountList?.length > 0 && isOAuth2Enabled) {
            // Filter out disabled accounts to not trigger OIDC authentication
            const filteredAccountList = accountList.filter(account => account.is_disabled === 0);

            const clientAccounts = JSON.parse(localStorage.getItem('clientAccounts') || '[]');

            // All client accounts from OIDC tokens
            const clientAccountsCurrencies = Object.keys(clientAccounts).map(account => clientAccounts[account].cur);

            // All accounts from authorize response
            const accountsListCurrencies = filteredAccountList.map(account => account.currency);

            const hasMissingCurrencies = accountsListCurrencies.some(
                currency => !clientAccountsCurrencies.includes(currency)
            );

            if (hasMissingCurrencies || clientAccountsCurrencies.length !== accountsListCurrencies.length) {
                try {
                    requestOidcAuthentication({
                        redirectCallbackUri: `${window.location.origin}/callback`,
                    });
                } catch (error) {
                    // eslint-disable-next-line no-console
                    console.error('Failed to refetch OIDC tokens', error);
                    showModal('ErrorModal');
                }

                setIsCheckingOidcTokens(false);
                setHasMissingCurrencies(false);
            } else {
                setHasMissingCurrencies(false);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accountList, isOAuth2Enabled]);

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
        if (authError?.code === ERROR_CODES.ACCOUNT_DISABLED || accountListError?.code === 'InvalidToken')
            oAuthLogout();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authError, accountListError, oAuthLogout]);

    useEffect(() => {
        if (!isGtmTracking.current) {
            window.dataLayer.push({ event: 'allow_tracking' });
            isGtmTracking.current = true;
        }
    }, []);

    const getComponent = () => {
        if (
            (isP2PSettingsLoading ||
                isLoadingActiveAccount ||
                !isFetched ||
                !activeAccountData ||
                isLoading ||
                isCheckingOidcTokens ||
                hasMissingCurrencies) &&
            !isEndpointRoute &&
            !isCallbackPage
        ) {
            return <Loader />;
        } else if ((isP2PBlocked && !isEndpointRoute) || isPermissionDenied || p2pSettingsError?.code) {
            return (
                <BlockedScenarios
                    type={p2pSettingsError?.code === 'RestrictedCountry' ? p2pSettingsError?.code : status}
                />
            );
        } else if (((isFetched && activeAccountData) || isEndpointRoute) && !isCallbackPage) {
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
                    {!isEndpointRoute && <SafetyAlertModal />}
                    <Router />
                </div>
            );
        } else if (isCallbackPage) {
            return <CallbackPage />;
        }

        return null;
    };

    return (
        <AdvertiserInfoStateProvider
            value={{
                error,
                hasCreatedAdvertiser,
                isIdle,
                isLoading,
                isSubscribed,
                setHasCreatedAdvertiser,
            }}
        >
            <div className='app-content'>
                {!isCallbackPage && (
                    <Text
                        align='center'
                        as='div'
                        className='app-content__title p-2'
                        size={isDesktop ? 'xl' : 'lg'}
                        weight='bold'
                    >
                        Deriv P2P
                    </Text>
                )}
                {getComponent()}
                {isModalOpenFor('ErrorModal') && (
                    <ErrorModal
                        buttonText='Refresh'
                        isModalOpen
                        message={localize('Something went wrong while logging out. Please refresh and try again.')}
                        onRequestClose={() => {
                            hideModal();
                            window.location.reload();
                        }}
                        showTitle={false}
                    />
                )}
            </div>
        </AdvertiserInfoStateProvider>
    );
};

export default AppContent;
