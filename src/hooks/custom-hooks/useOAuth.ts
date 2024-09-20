import { useCallback } from 'react';
import { getOauthUrl } from '@/constants';
import { getCurrentRoute } from '@/utils';
import { useAuthData } from '@deriv-com/api-hooks';
import { useOAuth2 } from '@deriv-com/auth-client';
import useGrowthbookGetFeatureValue from './useGrowthbookGetFeatureValue';

type UseOAuthReturn = {
    oAuthLogout: () => void;
    onRenderAuthCheck: () => void;
};

type hydraBEApps = {
    enabled_for: number[];
}[];

/**
 * useOAuth - hooks to help with OAuth function such as logout and check auth state during render
 *
 * @returns {UseOAuthReturn}
 */
const useOAuth = (): UseOAuthReturn => {
    const [OAuth2EnabledApps, OAuth2EnabledAppsInitialised] = useGrowthbookGetFeatureValue<hydraBEApps>({
        featureFlag: 'hydra_be',
    });

    const config = {
        OAuth2EnabledApps,
        OAuth2EnabledAppsInitialised,
    };

    const { logout } = useAuthData();

    const WSLogoutAndRedirect = async () => {
        await logout();
        window.open(oauthUrl, '_self');
    };
    const { OAuth2Logout: oAuthLogout } = useOAuth2(config, WSLogoutAndRedirect);
    const { error, isAuthorized, isAuthorizing } = useAuthData();
    const isEndpointPage = getCurrentRoute() === 'endpoint';
    const oauthUrl = getOauthUrl();

    const onRenderAuthCheck = useCallback(() => {
        if (
            (!isEndpointPage && !isAuthorized && !isAuthorizing) ||
            (!isEndpointPage && error?.code === 'InvalidToken')
        ) {
            oAuthLogout();
        }
    }, [isEndpointPage, isAuthorized, isAuthorizing, error, oAuthLogout]);

    return { oAuthLogout, onRenderAuthCheck };
};

export default useOAuth;
