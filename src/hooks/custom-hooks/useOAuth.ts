import { useCallback } from 'react';
import Cookies from 'js-cookie';
import { getOauthUrl } from '@/constants';
import { getCurrentRoute, removeCookies } from '@/utils';
import { useAuthData } from '@deriv-com/api-hooks';
import { TOAuth2EnabledAppList, useOAuth2 } from '@deriv-com/auth-client';
import useGrowthbookGetFeatureValue from './useGrowthbookGetFeatureValue';

type UseOAuthReturn = {
    oAuthLogout: () => void;
    onRenderAuthCheck: () => void;
};

/**
 * useOAuth - hooks to help with OAuth function such as logout and check auth state during render
 * @returns {UseOAuthReturn}
 */
const useOAuth = (): UseOAuthReturn => {
    const [OAuth2EnabledApps, OAuth2EnabledAppsInitialised] = useGrowthbookGetFeatureValue<string>({
        featureFlag: 'hydra_be',
    }) as unknown as [TOAuth2EnabledAppList, boolean];

    const oAuthGrowthbookConfig = {
        OAuth2EnabledApps,
        OAuth2EnabledAppsInitialised,
    };

    const { logout } = useAuthData();
    const { error, isAuthorized, isAuthorizing } = useAuthData();
    const isEndpointPage = getCurrentRoute() === 'endpoint';
    const isRedirectPage = getCurrentRoute() === 'redirect';
    const oauthUrl = getOauthUrl();
    const authTokenLocalStorage = localStorage.getItem('authToken');

    const WSLogoutAndRedirect = async () => {
        await logout();
        removeCookies('affiliate_token', 'affiliate_tracking', 'utm_data', 'onfido_token', 'gclid');
        window.open(oauthUrl, '_self');
    };
    const { OAuth2Logout: oAuthLogout } = useOAuth2(oAuthGrowthbookConfig, WSLogoutAndRedirect);

    const onRenderAuthCheck = useCallback(() => {
        if (!isEndpointPage) {
            if (error?.code === 'InvalidToken') {
                oAuthLogout();
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
                window.open(oauthUrl, '_self');
            }
        }
    }, [
        isEndpointPage,
        error?.code,
        isRedirectPage,
        isAuthorized,
        isAuthorizing,
        authTokenLocalStorage,
        oAuthLogout,
        oauthUrl,
    ]);

    return { oAuthLogout, onRenderAuthCheck };
};

export default useOAuth;
