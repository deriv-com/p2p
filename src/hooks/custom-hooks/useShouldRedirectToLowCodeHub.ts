import { URLConstants } from '@deriv-com/utils';
import { api } from '..';
import useGrowthbookGetFeatureValue from './useGrowthbookGetFeatureValue';

type TUseShouldRedirectToLowCodeHub = (accountsSection?: string, goToCFDs?: boolean) => string;

const useShouldRedirectToLowCodeHub: TUseShouldRedirectToLowCodeHub = (accountsSection = '', goToCFDs = false) => {
    const origin = window.location.origin;
    const isProduction = process.env.VITE_NODE_ENV === 'production' || origin === URLConstants.derivP2pProduction;
    const hubOSProduction = 'http://hub.deriv.com';
    const hubOSStaging = 'http://staging-hub.deriv.com';
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
        if (accountsSection) {
            if (isProduction)
                return `${hubOSProduction}/accounts/redirect?platform=p2p-v2&action=redirect_to&redirect_to=${accountsSection}&account=${activeAccount?.currency || 'USD'}`;
            return `${hubOSStaging}/accounts/redirect?platform=p2p-v2&action=redirect_to&redirect_to=${accountsSection}&account=${activeAccount?.currency || 'USD'}`;
        }
        if (goToCFDs) {
            if (isProduction)
                return `${hubOSProduction}/tradershub/redirect?action=redirect_to&redirect_to=cfds&account=${activeAccount?.currency || 'USD'}`;
            return `${hubOSStaging}/tradershub/redirect?action=redirect_to&redirect_to=cfds&account=${activeAccount?.currency || 'USD'}`;
        }
        if (isProduction)
            return `${hubOSProduction}/tradershub/redirect?action=redirect_to&redirect_to=home&account=${activeAccount?.currency || 'USD'}`;
        return `${hubOSStaging}/tradershub/redirect?action=redirect_to&redirect_to=home&account=${activeAccount?.currency || 'USD'}`;
    }

    if (accountsSection) return `${URLConstants.derivAppProduction}/account/${accountsSection}?platform=p2p-v2`;

    return URLConstants.derivAppProduction;
};

export default useShouldRedirectToLowCodeHub;
