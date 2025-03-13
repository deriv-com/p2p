import { useAuthData } from '@deriv-com/api-hooks';
import { URLConstants } from '@deriv-com/utils';
import useGrowthbookGetFeatureValue from './useGrowthbookGetFeatureValue';

type TUseShouldRedirectToLowCodeHub = (goToCFDs?: boolean) => string;

const useShouldRedirectToLowCodeHub: TUseShouldRedirectToLowCodeHub = (goToCFDs = false) => {
    const isProduction = process.env.NODE_ENV === 'production';
    const isStaging = process.env.NODE_ENV === 'staging';
    const { data } = useAuthData();
    const [hubEnabledCountryListP2P] = useGrowthbookGetFeatureValue({
        featureFlag: 'hub_enabled_country_list_p2p',
    });

    const hasWalletAccount = data?.authorize?.linked_to?.some(item => item.platform === 'dwallet');
    const isUserCountryInHubEnabledCountryList = Array.isArray(hubEnabledCountryListP2P)
        ? hubEnabledCountryListP2P.includes(data?.authorize?.country ?? '')
        : false;

    const shouldRedirectToLowCode = hasWalletAccount && isUserCountryInHubEnabledCountryList;

    if (shouldRedirectToLowCode) {
        if (goToCFDs) {
            if (isProduction) return 'http://hub.deriv.com/tradershub/options';
            if (isStaging) return 'http://staging-hub.deriv.com/tradershub/options';
        } else {
            if (isProduction) return 'http://hub.deriv.com/tradershub/cfds';
            if (isStaging) return 'http://staging-hub.deriv.com/tradershub/cfds';
        }
    }

    return URLConstants.derivAppProduction;
};

export default useShouldRedirectToLowCodeHub;
