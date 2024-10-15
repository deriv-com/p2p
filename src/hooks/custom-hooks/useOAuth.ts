import { useCallback } from 'react';
import { getOauthUrl } from '@/constants';
import { getCurrentRoute } from '@/utils';
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
    const [OAuth2EnabledApps, OAuth2EnabledAppsInitialised] = useGrowthbookGetFeatureValue<TOAuth2EnabledAppList>({
        featureFlag: 'hydra_be',
    });

    const oAuthGrowthbookConfig = {
        OAuth2EnabledApps,
        OAuth2EnabledAppsInitialised,
    };

    const { logout } = useAuthData();
    const { error, isAuthorized, isAuthorizing } = useAuthData();
    const isEndpointPage = getCurrentRoute() === 'endpoint';
    const oauthUrl = getOauthUrl();

    const WSLogoutAndRedirect = async () => {
        await logout();
        window.open(oauthUrl, '_self');
    };
    const { OAuth2Logout: oAuthLogout } = useOAuth2(oAuthGrowthbookConfig, WSLogoutAndRedirect);

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
