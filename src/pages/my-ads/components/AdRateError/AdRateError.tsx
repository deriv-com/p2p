import { RATE_TYPE } from '@/constants';
import { api } from '@/hooks';
import { useFloatingRate } from '@/hooks/custom-hooks';

const AdRateError = () => {
    const { data } = api.settings.useSettings();
    const localCurrency = data?.localCurrency || 'USD';
    const { fixedRateAdvertsEndDate, rateType, reachedTargetDate } = useFloatingRate();

    if (rateType === RATE_TYPE.FLOAT) {
        return reachedTargetDate || !fixedRateAdvertsEndDate
            ? //TODO: handle translation
              'Your ads with fixed rates have been deactivated. Set floating rates to reactivate them.'
            : `Floating rates are enabled for ${localCurrency}. Ads with fixed rates will be deactivated. Switch to floating rates by ${fixedRateAdvertsEndDate}.`;
    }

    return 'Your ads with floating rates have been deactivated. Set fixed rates to reactivate them.';
};

export default AdRateError;
