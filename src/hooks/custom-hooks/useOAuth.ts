import { useCallback } from 'react';
import Cookies from 'js-cookie';
// import { BUY_SELL_URL, getOauthUrl } from '@/constants';
import { getCurrentRoute, removeCookies } from '@/utils';
import { useAuthData } from '@deriv-com/api-hooks';
import { TOAuth2EnabledAppList, useOAuth2 } from '@deriv-com/auth-client';
import useGrowthbookGetFeatureValue from './useGrowthbookGetFeatureValue';
import useOAuth2Enabled from './useOAuth2Enabled';

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

    const [isOAuth2Enabled] = useOAuth2Enabled();

    const { logout } = useAuthData();
    const { error, isAuthorized, isAuthorizing } = useAuthData();
    const isEndpointPage = getCurrentRoute() === 'endpoint';
    const isRedirectPage = getCurrentRoute() === 'redirect';
    // const oauthUrl = getOauthUrl();

    const WSLogoutAndRedirect = async () => {
        await logout();
        removeCookies('affiliate_token', 'affiliate_tracking', 'utm_data', 'onfido_token', 'gclid');
        // window.open(oauthUrl, '_self');
    };
    const { OAuth2Logout: oAuthLogout } = useOAuth2(oAuthGrowthbookConfig, WSLogoutAndRedirect);

    // console.log('isOAuth2Enabled', isOAuth2Enabled);

    const onRenderAuthCheck = useCallback(() => {
        if (!isEndpointPage) {
            if (error?.code === 'InvalidToken') {
                oAuthLogout();
            } else if (!isAuthorized && !isAuthorizing) {
                if (isRedirectPage && !isOAuth2Enabled) {
                    const params = new URLSearchParams(location.search);
                    const from = params.get('from');
                    if (from === 'tradershub') {
                        const authTokenCookie = Cookies.get('authtoken');

                        if (authTokenCookie) {
                            localStorage.setItem('authToken', authTokenCookie);
                            localStorage.setItem('authTokentest', authTokenCookie);
                            params.delete('from');
                            window.location.href = window.location.origin;
                        } else {
                            // console.log('auth token cookie not found');
                        }
                    }
                } else {
                    // window.open(oauthUrl, '_self');
                }
            }
        }
    }, [isEndpointPage, error?.code, isAuthorized, isAuthorizing, oAuthLogout, isRedirectPage, isOAuth2Enabled]);

    return { oAuthLogout, onRenderAuthCheck };
};

export default useOAuth;
