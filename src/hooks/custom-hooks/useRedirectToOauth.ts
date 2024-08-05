import { useCallback, useEffect, useState } from 'react';
import { getOauthUrl } from '@/constants';
import { getCurrentRoute } from '@/utils';
import { useAuthData } from '@deriv-com/api-hooks';

const useRedirectToOauth = () => {
    const [shouldRedirect, setShouldRedirect] = useState(false);
    const { error, isAuthorized, isAuthorizing } = useAuthData();
    const isEndpointPage = getCurrentRoute() === 'endpoint';
    const oauthUrl = getOauthUrl();

    const redirectToOauth = useCallback(() => {
        if (shouldRedirect) {
            let iframe = document.getElementById('logout-iframe') as HTMLIFrameElement;

            if (!iframe) {
                iframe = document.createElement('iframe');
                iframe.id = 'logout-iframe';
                iframe.style.display = 'none';
                document.body.appendChild(iframe);
            }

            iframe.src = 'https://qa101.deriv.dev/oauth2/sessions/logout';

            iframe.onload = () => {
                window.location.href = oauthUrl;
            };
        }
    }, [oauthUrl, shouldRedirect]);

    useEffect(() => {
        if (
            (!isEndpointPage && !isAuthorized && !isAuthorizing) ||
            (!isEndpointPage && error?.code === 'InvalidToken')
        ) {
            setShouldRedirect(true);
        }
    }, [error, isAuthorized, isAuthorizing, isEndpointPage, oauthUrl]);

    useEffect(() => {
        redirectToOauth();
    }, [redirectToOauth]);

    return {
        redirectToOauth,
    };
};

export default useRedirectToOauth;
