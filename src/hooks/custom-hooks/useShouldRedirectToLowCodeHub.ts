import { URLConstants } from '@deriv-com/utils';
import { api } from '..';
import useGrowthbookGetFeatureValue from './useGrowthbookGetFeatureValue';

type TUseShouldRedirectToLowCodeHub = (goToCFDs?: boolean) => string;

const useShouldRedirectToLowCodeHub: TUseShouldRedirectToLowCodeHub = (goToCFDs = false) => {
    const isProduction = process.env.NODE_ENV === 'production';
    const isStaging = process.env.NODE_ENV === 'staging';
    const { data: activeAccount } = api.account.useActiveAccount();
    const [hubEnabledCountryListP2P] = useGrowthbookGetFeatureValue({
        featureFlag: 'hub_enabled_country_list_p2p',
    });

    const hasWalletAccount = activeAccount?.isWalletAccount;
    // @ts-expect-error hub_enabled_country_list is not typed
    const countryList = (hubEnabledCountryListP2P.hub_enabled_country_list as string[]) || [];
    const isUserCountryInHubEnabledCountryList = countryList.includes(activeAccount?.country ?? '');

    // eslint-disable-next-line no-console
    console.log(countryList, hubEnabledCountryListP2P, isUserCountryInHubEnabledCountryList, hasWalletAccount);

    const shouldRedirectToLowCode = hasWalletAccount && isUserCountryInHubEnabledCountryList;

    if (shouldRedirectToLowCode) {
        if (goToCFDs) {
            if (isProduction) return 'http://hub.deriv.com/tradershub/cfds';
            if (isStaging) return 'http://staging-hub.deriv.com/tradershub/cfds';
            return 'http://staging-hub.deriv.com/tradershub/cfds';
        }
        if (isProduction) return 'http://hub.deriv.com/tradershub';
        if (isStaging) return 'http://staging-hub.deriv.com/tradershub';
        return 'http://staging-hub.deriv.com/tradershub';
    }

    return URLConstants.derivAppProduction;
};

export default useShouldRedirectToLowCodeHub;
