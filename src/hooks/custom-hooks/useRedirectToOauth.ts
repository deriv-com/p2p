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
        shouldRedirect && window.open(oauthUrl, '_self');
    }, [oauthUrl, shouldRedirect]);

    useEffect(() => {
        if (
            (!isEndpointPage && !isAuthorized && !isAuthorizing) ||
            (!isEndpointPage && error?.code === 'InvalidToken')
        ) {
            setShouldRedirect(true);
        }
    }, [error, isAuthorized, isAuthorizing, isEndpointPage, oauthUrl]);

    return {
        redirectToOauth,
    };
};

export default useRedirectToOauth;
