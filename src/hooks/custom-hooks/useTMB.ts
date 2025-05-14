import { useCallback, useMemo } from 'react';
import Cookies from 'js-cookie';
import { getOauthUrl } from '@/constants';
import { getCurrentRoute, removeCookies } from '@/utils';
import { requestSessionActive } from '@deriv-com/auth-client';

type UseTMBReturn = {
    handleLogout: VoidFunction;
    onRenderTMBCheck: VoidFunction;
};

/**
 * useTMB - hooks to help with TMB function such getting the active sessions and tokens
 * @returns {UseOAuthReturn}
 */
const useTMB = (options: { showErrorModal?: VoidFunction } = {}): UseTMBReturn => {
    const { showErrorModal } = options;

    const isEndpointPage = getCurrentRoute() === 'endpoint';
    const isRedirectPage = getCurrentRoute() === 'redirect';
    const oauthUrl = getOauthUrl();
    const domains = useMemo(
        () => ['deriv.com', 'deriv.dev', 'binary.sx', 'pages.dev', 'localhost', 'deriv.be', 'deriv.me'],
        []
    );
    const currentDomain = window.location.hostname.split('.').slice(-2).join('.');

    const RedirectToOAuth = useCallback(async () => {
        removeCookies('affiliate_token', 'affiliate_tracking', 'utm_data', 'onfido_token', 'gclid');
        if (domains.includes(currentDomain)) {
            Cookies.set('logged_state', 'false', {
                domain: currentDomain,
                expires: 30,
                path: '/',
                secure: true,
            });
        }
        window.open(oauthUrl, '_self');
    }, [currentDomain, domains, oauthUrl]);

    const getActiveSessions = useCallback(async () => {
        try {
            const data = await requestSessionActive();

            return data;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Failed to get active sessions', error);
            showErrorModal?.();
        }
    }, [showErrorModal]);

    const onRenderTMBCheck = useCallback(async () => {
        const activeSessions = await getActiveSessions();

        if (!activeSessions?.active && !isEndpointPage) {
            return RedirectToOAuth();
        }

        if (activeSessions?.active) {
            localStorage.setItem('clientAccounts', JSON.stringify(activeSessions?.tokens));

            // Set find and set token to USD options account
            // only need CR options account
            let selectedAuthToken = activeSessions?.tokens
                ?.filter(acc => !acc.loginid.includes('VR') || !acc.loginid.includes('W'))
                .find(
                    item => item.cur.toLocaleUpperCase() === 'USD' && item.loginid.toLocaleUpperCase().includes('CR')
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

            // TODO:
            // For backward compatibility, we need to set logged_state cookie to tell other apps about authentication state
            // Can be removed when all the apps are using TMB
            if (domains.includes(currentDomain)) {
                Cookies.set('logged_state', 'true', {
                    domain: currentDomain,
                    expires: 30,
                    path: '/',
                    secure: true,
                });
            }
        }

        if (isRedirectPage) {
            const params = new URLSearchParams(location.search);
            const from = params.get('from');
            const authTokenCookie = Cookies.get('authtoken');

            if (from === 'tradershub' && authTokenCookie) {
                const cleanedAuthToken = decodeURIComponent(authTokenCookie).replace(/^"|"$/g, '');
                localStorage.setItem('authToken', cleanedAuthToken);
                Cookies.remove('authtoken');
                window.location.href = window.location.origin;
            }
        }
    }, [getActiveSessions, isEndpointPage, RedirectToOAuth, domains, currentDomain, isRedirectPage]);

    return { handleLogout: RedirectToOAuth, onRenderTMBCheck };
};

export default useTMB;
