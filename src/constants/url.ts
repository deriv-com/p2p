import { AppIDConstants, LocalStorageConstants, LocalStorageUtils, URLConstants, URLUtils } from '@deriv-com/utils';

export const BUY_SELL_URL = '/buy-sell';
export const ORDERS_URL = '/orders';
export const MY_ADS_URL = '/my-ads';
export const MY_PROFILE_URL = '/my-profile';
export const ADVERTISER_URL = '/advertiser';
export const ENDPOINT = '/endpoint';

// TODO move these to deriv-utils library
export const ACCOUNT_LIMITS = `${URLConstants.derivAppProduction}/account/account-limits`;
export const DERIV_COM = URLConstants.derivComProduction;
export const HELP_CENTRE = `${URLConstants.derivComProduction}/help-centre/`;
export const RESPONSIBLE = `${URLConstants.derivComProduction}/responsible/`;

const SocketURL = {
    [URLConstants.derivP2pProduction]: 'blue.derivws.com',
    [URLConstants.derivP2pStaging]: 'red.derivws.com',
};

export const getOauthUrl = () => {
    const origin = window.location.origin;
    const hostname = window.location.hostname;

    // since we don't have official app_id for staging,
    // we will use the red server with app_id=62019 for the staging-p2p.deriv.com for now
    // to fix the login issue
    if (origin === URLConstants.derivP2pStaging) {
        localStorage.setItem(
            LocalStorageConstants.configServerURL.toString(),
            SocketURL[origin as keyof typeof SocketURL]
        );
        localStorage.setItem(
            LocalStorageConstants.configAppId,
            `${AppIDConstants.domainAppId[hostname as keyof typeof AppIDConstants.domainAppId]}`
        );
    }

    const storedServerUrl = localStorage.getItem(LocalStorageConstants.configServerURL.toString());
    const serverUrl = /qa/.test(storedServerUrl || '') ? storedServerUrl : 'oauth.deriv.com';

    const appId = LocalStorageUtils.getValue(LocalStorageConstants.configAppId);

    const oauthUrl =
        appId && serverUrl
            ? `https://${serverUrl}/oauth2/authorize?app_id=${appId}&l=EN&&brand=deriv`
            : URLUtils.getOauthURL();

    return oauthUrl;
};
