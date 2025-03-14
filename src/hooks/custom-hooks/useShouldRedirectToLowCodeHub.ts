import { URLConstants } from '@deriv-com/utils';
import { api } from '..';
import useGrowthbookGetFeatureValue from './useGrowthbookGetFeatureValue';

type TUseShouldRedirectToLowCodeHub = (goToCFDs?: boolean) => string;

const useShouldRedirectToLowCodeHub: TUseShouldRedirectToLowCodeHub = (goToCFDs = false) => {
    const origin = window.location.origin;
    const isProduction = process.env.VITE_NODE_ENV === 'production' || origin === URLConstants.derivP2pProduction;
    const isStaging = process.env.VITE_NODE_ENV === 'staging' || origin === URLConstants.derivP2pStaging;
    const { data: activeAccount } = api.account.useActiveAccount();
    const [hubEnabledCountryListP2P] = useGrowthbookGetFeatureValue({
        featureFlag: 'hub_enabled_country_list_p2p',
    });

    const hasWalletAccount = activeAccount?.isWalletAccount;
    // @ts-expect-error hub_enabled_country_list is not typed
    const countryList = (hubEnabledCountryListP2P.hub_enabled_country_list as string[]) || [];
    const isUserCountryInHubEnabledCountryList = countryList.includes(activeAccount?.country ?? '');

    const shouldRedirectToLowCode = hasWalletAccount && isUserCountryInHubEnabledCountryList;

    if (shouldRedirectToLowCode) {
        if (goToCFDs) {
            if (isProduction) return 'http://hub.deriv.com/tradershub/cfds';
            if (isStaging) return 'http://staging-hub.deriv.com/tradershub/cfds';
            return 'http://staging-hub.deriv.com/tradershub/cfds';
        }
        if (isProduction)
            return `http://hub.deriv.com/tradershub/redirect?action=redirect_to&redirect_to=home&account=${activeAccount?.currency || 'USD'}`;
        if (isStaging)
            return `http://staging-hub.deriv.com/tradershub/redirect?action=redirect_to&redirect_to=home&account=${activeAccount?.currency || 'USD'}`;
        return `http://staging-hub.deriv.com/tradershub/redirect?action=redirect_to&redirect_to=home&account=${activeAccount?.currency || 'USD'}`;
    }

    return URLConstants.derivAppProduction;
};

export default useShouldRedirectToLowCodeHub;
