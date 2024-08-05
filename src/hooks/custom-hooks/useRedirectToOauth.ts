import { useCallback, useEffect, useState } from 'react';
import { getOauthUrl } from '@/constants';
import { getCurrentRoute } from '@/utils';
import { useAuthData } from '@deriv-com/api-hooks';
import useGrowthbookGetFeatureValue from './useGrowthbookGetFeatureValue';

const useRedirectToOauth = () => {
    const [shouldRedirect, setShouldRedirect] = useState(false);
    const { error, isAuthorized, isAuthorizing } = useAuthData();
    const isEndpointPage = getCurrentRoute() === 'endpoint';
    const oauthUrl = getOauthUrl();

    const [isOauth2Enabled, isGBLoaded] = useGrowthbookGetFeatureValue<boolean>({
        defaultValue: false,
        featureFlag: 'oauth2_service_enabled',
    });

    const redirectToOauth = useCallback(() => {
        // Testing the use of the iframe element
        if (shouldRedirect) {
            if (isOauth2Enabled && isGBLoaded) {
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
            } else {
                window.open(oauthUrl, '_self');
            }
        }
    }, [isGBLoaded, isOauth2Enabled, oauthUrl, shouldRedirect]);

    useEffect(() => {
        if (
            (!isEndpointPage && !isAuthorized && !isAuthorizing) ||
            (!isEndpointPage && error?.code === 'InvalidToken')
        ) {
            setShouldRedirect(true);
        }
    }, [error, isAuthorized, isAuthorizing, isEndpointPage, oauthUrl]);

    useEffect(() => {
        if (isGBLoaded) redirectToOauth();
    }, [isGBLoaded, redirectToOauth]);

    return {
        redirectToOauth,
    };
};

export default useRedirectToOauth;
