import { useCallback } from 'react';
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
const useOAuth = (): UseOAuthReturn => {
    const [OAuth2EnabledApps, OAuth2EnabledAppsInitialised] = useGrowthbookGetFeatureValue<string>({
        featureFlag: 'hydra_be',
    }) as unknown as [TOAuth2EnabledAppList, boolean];

    const isOAuth2Enabled = useIsOAuth2Enabled(OAuth2EnabledApps, OAuth2EnabledAppsInitialised);

    const { logout } = useAuthData();
    const { error, isAuthorized, isAuthorizing } = useAuthData();
    const isEndpointPage = getCurrentRoute() === 'endpoint';
    const isCallbackPage = getCurrentRoute() === 'callback';
    const oauthUrl = getOauthUrl();

    const WSLogoutAndRedirect = async () => {
        await logout();
        removeCookies('affiliate_token', 'affiliate_tracking', 'utm_data', 'onfido_token', 'gclid');
        if (isOAuth2Enabled) {
            await requestOidcAuthentication({
                redirectCallbackUri: `${window.location.origin}/callback`,
            });
        } else {
            window.open(oauthUrl, '_self');
        }
    };
    // const { OAuth2Logout: oAuthLogout } = useOAuth2(oAuthGrowthbookConfig, WSLogoutAndRedirect);
    const handleLogout = async () => {
        await OAuth2Logout(WSLogoutAndRedirect);
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

    // console.log(isOAuth2Enabled)

    const onRenderAuthCheck = useCallback(async () => {
        if (!isEndpointPage && !isCallbackPage) {
            if (error?.code === 'InvalidToken') {
                // oAuthLogout();
                handleLogout();
            } else if (!isAuthorized && !isAuthorizing) {
                await redirectToAuth();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEndpointPage, isCallbackPage, error?.code, isAuthorized, isAuthorizing, isOAuth2Enabled]);

    return { isOAuth2Enabled, oAuthLogout: handleLogout, onRenderAuthCheck };
};

export default useOAuth;
