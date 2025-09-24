import { useShallow } from 'zustand/react/shallow';
import { DERIV_APP } from '@/constants';
import { useHubEnabledCountryListStore } from '@/stores';
import { URLConstants } from '@deriv-com/utils';
import { api } from '..';

type TUseShouldRedirectToLowCodeHub = (accountsSection?: string, goToCFDs?: boolean) => string;

const useShouldRedirectToLowCodeHub: TUseShouldRedirectToLowCodeHub = (accountsSection = '', goToCFDs = false) => {
    const origin = window.location.origin;
    const isProduction = process.env.VITE_NODE_ENV === 'production' || origin === URLConstants.derivP2pProduction;
    const hubOSProduction = origin.includes('deriv.me')
        ? 'http://hub.deriv.me'
        : origin.includes('deriv.be')
          ? 'http://hub.deriv.be'
          : 'http://hub.deriv.com';
    const hubOSStaging = origin.includes('deriv.me')
        ? 'http://staging-hub.deriv.me'
        : origin.includes('deriv.be')
          ? 'http://staging-hub.deriv.be'
          : 'http://staging-hub.deriv.com';
    const { data: activeAccount } = api.account.useActiveAccount();
    const { hubEnabledCountryList } = useHubEnabledCountryListStore(
        useShallow(state => ({
            hubEnabledCountryList: state.hubEnabledCountryList,
        }))
    );

    const hasWalletAccount = activeAccount?.isWalletAccount;
    const isUserCountryInHubEnabledCountryList = hubEnabledCountryList.includes(activeAccount?.country ?? '');

    const shouldRedirectToLowCode = hasWalletAccount && isUserCountryInHubEnabledCountryList;

    if (shouldRedirectToLowCode) {
        if (accountsSection) {
            if (isProduction)
                return `${hubOSProduction}/accounts/redirect?action=redirect_to&redirect_to=${accountsSection}&account=${activeAccount?.currency || 'USD'}`;
            return `${hubOSStaging}/accounts/redirect?action=redirect_to&redirect_to=${accountsSection}&account=${activeAccount?.currency || 'USD'}`;
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

    if (accountsSection) {
        let section = accountsSection;

        if (section === 'phone-number-verification') {
            section = 'personal-details';
        }

        if (isProduction) return `${DERIV_APP}/account/${section}?platform=p2p-v2`;
        return `${URLConstants.derivAppStaging}/account/${section}?platform=p2p-v2`;
    }

    if (isProduction) return DERIV_APP;
    return URLConstants.derivAppStaging;
};

export default useShouldRedirectToLowCodeHub;
