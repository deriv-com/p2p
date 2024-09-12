import { useCallback } from 'react';
import { getOauthUrl } from '@/constants';
import { getCurrentRoute } from '@/utils';
import { useAuthData } from '@deriv-com/api-hooks';
import { useOAuth2 } from '@deriv-com/auth-client';
import useOAuth2Enabled from './useOAuth2Enabled';

type UseOAuthReturn = {
    logoutWs: () => Promise<void>;
    oAuthLogout: () => void;
    onRenderAuthCheck: () => void;
};

/**
 * useOAuth - hooks to help with OAuth function such as logout and check auth state during render
 *
 * @returns {UseOAuthReturn}
 */
const useOAuth = (): UseOAuthReturn => {
    const [isOAuth2Enabled] = useOAuth2Enabled();
    const { logout } = useAuthData();
    const { OAuth2Logout } = useOAuth2();
    const { error, isAuthorized, isAuthorizing } = useAuthData();
    const isEndpointPage = getCurrentRoute() === 'endpoint';
    const oauthUrl = getOauthUrl();

    const logoutWs = useCallback(async () => {
        await logout();
    }, [logout]);

    const WSLogoutAndRedirect = useCallback(async () => {
        await logout();
        window.open(oauthUrl, '_self');
    }, [logout, oauthUrl]);

    const oAuthLogout = useCallback(async () => {
        if (isOAuth2Enabled) {
            OAuth2Logout();
        } else {
            WSLogoutAndRedirect();
        }
    }, [OAuth2Logout, WSLogoutAndRedirect, isOAuth2Enabled]);

    const onRenderAuthCheck = useCallback(() => {
        if (
            (!isEndpointPage && !isAuthorized && !isAuthorizing) ||
            (!isEndpointPage && error?.code === 'InvalidToken')
        ) {
            oAuthLogout();
        }
    }, [isEndpointPage, isAuthorized, isAuthorizing, error, oAuthLogout]);

    return { logoutWs, oAuthLogout, onRenderAuthCheck };
};

export default useOAuth;
