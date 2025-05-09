import { useCallback } from 'react';
import Cookies from 'js-cookie';
import { getOauthUrl } from '@/constants';
import { getCurrentRoute, removeCookies } from '@/utils';
import { useAuthData } from '@deriv-com/api-hooks';
import { requestSessionActive } from '@deriv-com/auth-client';
import { URLConstants } from '@deriv-com/utils';

type UseTMBReturn = {
    handleLogout: () => void;
    isOAuth2Enabled: boolean;
    onRenderTMBCheck: () => void;
};

/**
 * useTMB - hooks to help with TMB function such getting the active sessions and tokens
 * @returns {UseOAuthReturn}
 */
const useTMB = (options: { showErrorModal?: () => void } = {}): UseTMBReturn => {
    const { showErrorModal } = options;
    const origin = window.location.origin;
    const isProduction = process.env.VITE_NODE_ENV === 'production' || origin === URLConstants.derivP2pProduction;
    const isStaging = process.env.VITE_NODE_ENV === 'staging' || origin === URLConstants.derivP2pStaging;
    const isOAuth2Enabled = isProduction || isStaging;

    const { error, isAuthorized, isAuthorizing, logout } = useAuthData();
    const isEndpointPage = getCurrentRoute() === 'endpoint';
    const isCallbackPage = getCurrentRoute() === 'callback';
    const isRedirectPage = getCurrentRoute() === 'redirect';
    const oauthUrl = getOauthUrl();
    const authTokenLocalStorage = localStorage.getItem('authToken');

    const WSLogoutAndRedirect = async () => {
        try {
            await logout();
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Failed to logout', error);
        }
        removeCookies('affiliate_token', 'affiliate_tracking', 'utm_data', 'onfido_token', 'gclid');
        redirectToAuth();
    };

    const redirectToAuth = async () => {
        window.open(oauthUrl, '_self');
    };

    const getActiveSessions = async () => {
        try {
            const data = await requestSessionActive();

            return data;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Failed to get active sessions', error);
            showErrorModal?.();
        }
    };

    const onRenderTMBCheck = useCallback(async () => {
        const activeSessions = await getActiveSessions();

        if (activeSessions?.active) {
            localStorage.setItem('clientAccounts', JSON.stringify(activeSessions?.tokens));
            // Set find and set token to USD options account
            let selectedAuthToken = activeSessions?.tokens?.find(
                item => item.cur.toLocaleUpperCase() === 'USD' && !item.loginid.toLocaleUpperCase().includes('W')
            )?.token;

            /**
             *  If there is no USD account,
             *  fallback to the first options account regardless of the order of tokens from the API
             * */
            if (!selectedAuthToken) {
                selectedAuthToken = activeSessions?.tokens?.find(item =>
                    item.loginid.toLocaleUpperCase().includes('CR')
                )?.token;
            }

            /**
             *  If there is no real account available,
             *  fallback to the virtual options account
             * */
            if (!selectedAuthToken) {
                selectedAuthToken = activeSessions?.tokens?.find(item =>
                    item.loginid.toLocaleUpperCase().includes('VRTC')
                )?.token;
            }

            selectedAuthToken && localStorage.setItem('authToken', selectedAuthToken);
            const domains = ['deriv.com', 'deriv.dev', 'binary.sx', 'pages.dev', 'localhost', 'deriv.be', 'deriv.me'];
            const currentDomain = window.location.hostname.split('.').slice(-2).join('.');
            if (domains.includes(currentDomain)) {
                Cookies.set('logged_state', 'true', {
                    domain: currentDomain,
                    expires: 30,
                    path: '/',
                    secure: true,
                });
            }
        }

        if (!isEndpointPage) {
            // NOTE: we only do single logout using logged_state cookie checks only in Safari
            // because front channels do not work in Safari, front channels (front-channel.html) would already help us automatically log out
            const shouldSingleLogoutWithLoggedState = !activeSessions?.active;
            if ((shouldSingleLogoutWithLoggedState && isOAuth2Enabled) || error?.code === 'InvalidToken') {
                try {
                    await WSLogoutAndRedirect();
                } catch (error) {
                    // eslint-disable-next-line no-console
                    console.error('Failed to handle logout', error);
                    showErrorModal?.();
                }
            } else if (isRedirectPage) {
                const params = new URLSearchParams(location.search);
                const from = params.get('from');
                const authTokenCookie = Cookies.get('authtoken');

                if (from === 'tradershub' && authTokenCookie) {
                    const cleanedAuthToken = decodeURIComponent(authTokenCookie).replace(/^"|"$/g, '');
                    localStorage.setItem('authToken', cleanedAuthToken);
                    Cookies.remove('authtoken');
                    window.location.href = window.location.origin;
                }
            } else if (!isAuthorized && !isAuthorizing && !authTokenLocalStorage) {
                await redirectToAuth();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        error?.code,
        isEndpointPage,
        isCallbackPage,
        isOAuth2Enabled,
        isRedirectPage,
        isAuthorized,
        isAuthorizing,
        authTokenLocalStorage,
    ]);

    return { handleLogout: WSLogoutAndRedirect, isOAuth2Enabled, onRenderTMBCheck };
};

export default useTMB;
