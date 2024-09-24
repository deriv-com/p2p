import { AppIDConstants, LocalStorageConstants, LocalStorageUtils, URLConstants, URLUtils } from '@deriv-com/utils';

export const BUY_SELL_URL = '/buy-sell';
export const ORDERS_URL = '/orders';
export const MY_ADS_URL = '/my-ads';
export const MY_PROFILE_URL = '/my-profile';
export const ADVERTISER_URL = '/advertiser';
export const ENDPOINT = '/endpoint';
export const GUIDE_URL = '/guide';

// TODO move these to deriv-utils library
export const ACCOUNT_LIMITS = `${URLConstants.derivAppProduction}/account/account-limits`;
export const DERIV_COM = URLConstants.derivComProduction;
export const HELP_CENTRE = `${URLConstants.derivComProduction}/help-centre/`;
export const RESPONSIBLE = `${URLConstants.derivComProduction}/responsible/`;

export const INTRODUCING_DERIV_P2P_URL =
    'https://player.vimeo.com/video/715973569?color&autopause=0&loop=0&muted=0&title=0&portrait=0&autoplay=1&byline=0#t=';

export const HOW_TO_USE_DERIV_P2P_URL =
    'https://player.vimeo.com/video/715982928?color&autopause=0&loop=0&muted=0&title=0&portrait=0&autoplay=1&byline=0#t=';

export const HOW_TO_PROTECT_YOURSELF_URL = 'https://blog.deriv.com/posts/how-to-protect-yourself-on-p2p-platforms/';

export const DEFAULT_OAUTH_LOGOUT_URL = 'https://oauth.deriv.com/oauth2/sessions/logout';

export const DEFAULT_OAUTH_ORIGIN_URL = 'https://oauth.deriv.com';

const SocketURL = {
    [URLConstants.derivP2pProduction]: 'green.derivws.com',
    [URLConstants.derivP2pStaging]: 'red.derivws.com',
};

export const getServerInfo = () => {
    const origin = window.location.origin;
    const hostname = window.location.hostname;

    const existingAppId = LocalStorageUtils.getValue<string>(LocalStorageConstants.configAppId);
    const existingServerUrl = LocalStorageUtils.getValue<string>(LocalStorageConstants.configServerURL);
    // we will use the red server with app_id=62019 for the staging-p2p.deriv.com for now
    // for p2p.deriv.com, we will use the green server with app_id=661859
    if (
        (origin === URLConstants.derivP2pStaging || origin === URLConstants.derivP2pProduction) &&
        (!existingAppId || !existingServerUrl)
    ) {
        LocalStorageUtils.setValue<string>(
            LocalStorageConstants.configServerURL,
            SocketURL[origin as keyof typeof SocketURL]
        );
        LocalStorageUtils.setValue<string>(
            LocalStorageConstants.configAppId,
            `${AppIDConstants.domainAppId[hostname as keyof typeof AppIDConstants.domainAppId]}`
        );
    }

    const storedServerUrl = LocalStorageUtils.getValue<string>(LocalStorageConstants.configServerURL);
    const serverUrl = /qa/.test(String(storedServerUrl)) ? storedServerUrl : 'oauth.deriv.com';

    const appId = LocalStorageUtils.getValue<string>(LocalStorageConstants.configAppId);
    const lang = LocalStorageUtils.getValue<string>(LocalStorageConstants.i18nLanguage);

    return {
        appId,
        lang,
        serverUrl,
    };
};

export const getOauthUrl = () => {
    const { appId, lang, serverUrl } = getServerInfo();

    const oauthUrl =
        appId && serverUrl
            ? `https://${serverUrl}/oauth2/authorize?app_id=${appId}&l=${lang ?? 'EN'}&&brand=deriv`
            : URLUtils.getOauthURL();

    return oauthUrl;
};

export const getOAuthLogoutUrl = () => {
    const { appId, serverUrl } = getServerInfo();

    const oauthUrl = appId && serverUrl ? `https://${serverUrl}/oauth2/sessions/logout` : DEFAULT_OAUTH_LOGOUT_URL;

    return oauthUrl;
};

export const getOAuthOrigin = () => {
    const { appId, serverUrl } = getServerInfo();

    const oauthUrl = appId && serverUrl ? `https://${serverUrl}` : DEFAULT_OAUTH_ORIGIN_URL;

    return oauthUrl;
};
