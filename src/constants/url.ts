import { LocalStorageConstants, LocalStorageUtils, URLConstants, URLUtils } from '@deriv-com/utils';

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

export const getOauthUrl = () => {
    const appId = LocalStorageUtils.getValue(LocalStorageConstants.configAppId);
    const serverUrl = localStorage.getItem(LocalStorageConstants.configServerURL.toString());
    const oauthUrl =
        appId && serverUrl
            ? `https://${serverUrl}/oauth2/authorize?app_id=${appId}&l=EN&&brand=deriv`
            : URLUtils.getOauthURL();

    return oauthUrl;
};
