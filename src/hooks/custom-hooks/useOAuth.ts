import { useCallback } from 'react';
import Cookies from 'js-cookie';
import { getOauthUrl } from '@/constants';
import { getCurrentRoute, removeCookies } from '@/utils';
import { useAuthData } from '@deriv-com/api-hooks';
import {
    OAuth2Logout,
    requestOidcAuthentication,
    TOAuth2EnabledAppList,
    useIsOAuth2Enabled,
} from '@deriv-com/auth-client';
import useGrowthbookGetFeatureValue from './useGrowthbookGetFeatureValue';

type UseOAuthReturn = {
    isOAuth2Enabled: boolean;
    oAuthLogout: () => void;
    onRenderAuthCheck: () => void;
};

/**
 * useOAuth - hooks to help with OAuth function such as logout and check auth state during render
 * @returns {UseOAuthReturn}
 */
const useOAuth = (options: { showErrorModal?: () => void } = {}): UseOAuthReturn => {
    const { showErrorModal } = options;
    const [OAuth2EnabledApps, OAuth2EnabledAppsInitialised] = useGrowthbookGetFeatureValue<string>({
        featureFlag: 'hydra_be',
    }) as unknown as [TOAuth2EnabledAppList, boolean];

    const isOAuth2Enabled = useIsOAuth2Enabled(OAuth2EnabledApps, OAuth2EnabledAppsInitialised);

    const { logout } = useAuthData();
    const { error, isAuthorized, isAuthorizing } = useAuthData();
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

    const handleLogout = async () => {
        try {
            await OAuth2Logout({
                postLogoutRedirectUri: window.location.origin,
                redirectCallbackUri: `${window.location.origin}/callback`,
                WSLogoutAndRedirect,
            });
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Failed to handle logout', error);
            showErrorModal?.();
        }
    };

    const redirectToAuth = async () => {
        if (isOAuth2Enabled) {
            await requestOidcAuthentication({
                redirectCallbackUri: `${window.location.origin}/callback`,
            });
        } else {
            window.open(oauthUrl, '_self');
        }
    };

    const hasAuthToken = localStorage.getItem('authToken');
    const loggedState = Cookies.get('logged_state');

    const onRenderAuthCheck = useCallback(async () => {
        if (!isEndpointPage && !isCallbackPage) {
            // NOTE: we only do single logout using logged_state cookie checks only in Safari
            // because front channels do not work in Safari, front channels (front-channel.html) would already help us automatically log out
            const shouldSingleLogoutWithLoggedState = hasAuthToken && loggedState === 'false';
            if ((shouldSingleLogoutWithLoggedState && isOAuth2Enabled) || error?.code === 'InvalidToken') {
                await handleLogout();
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
        isEndpointPage,
        isCallbackPage,
        hasAuthToken,
        loggedState,
        isOAuth2Enabled,
        error?.code,
        isRedirectPage,
        isAuthorized,
        isAuthorizing,
        authTokenLocalStorage,
    ]);

    return { isOAuth2Enabled, oAuthLogout: handleLogout, onRenderAuthCheck };
};

export default useOAuth;
