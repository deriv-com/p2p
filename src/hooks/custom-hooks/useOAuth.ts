import { useCallback, useEffect } from 'react';
import { getOAuthLogoutUrl, getOAuthOrigin, getOauthUrl } from '@/constants';
import { getCurrentRoute } from '@/utils';
import { useAuthData } from '@deriv-com/api-hooks';
import useOAuth2Enabled from './useOAuth2Enabled';

type MessageEvent = {
    data: 'logout_complete' | 'logout_error';
    origin: string;
};

type UseOAuthReturn = {
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
    const { error, isAuthorized, isAuthorizing } = useAuthData();
    const isEndpointPage = getCurrentRoute() === 'endpoint';
    const oauthUrl = getOauthUrl();

    const WSLogoutAndRedirect = async () => {
        await logout();
        window.open(oauthUrl, '_self');
    };

    useEffect(() => {
        const onMessage = async (event: MessageEvent) => {
            const allowedOrigin = getOAuthOrigin();
            if (allowedOrigin === event.origin) {
                if (event.data === 'logout_complete') {
                    WSLogoutAndRedirect();
                } else {
                    // eslint-disable-next-line no-console
                    console.warn('Unexpected message received: ', event.data);
                }
            } else {
                // eslint-disable-next-line no-console
                console.warn('Unexpected postmessage origin: ', event.origin);
            }
        };

        window.addEventListener('message', onMessage);

        return () => {
            window.removeEventListener('message', onMessage);
        };
    }, []);

    const OAuth2Logout = async () => {
        let iframe: HTMLIFrameElement | null = document.getElementById('logout-iframe') as HTMLIFrameElement;
        if (!iframe) {
            iframe = document.createElement('iframe');
            iframe.id = 'logout-iframe';
            iframe.style.display = 'none';
            document.body.appendChild(iframe);

            // backend response message timeout, setting this as 4 seconds
            setTimeout(() => {
                WSLogoutAndRedirect();
            }, 4000);
        }

        iframe.src = getOAuthLogoutUrl();

        iframe.onerror = error => {
            // eslint-disable-next-line no-console
            console.error('There has been a problem with the logout: ', error);
        };
    };

    const oAuthLogout = useCallback(async () => {
        if (isOAuth2Enabled) {
            OAuth2Logout();
        } else {
            WSLogoutAndRedirect();
        }
    }, [isOAuth2Enabled]);

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
