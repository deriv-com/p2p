import { RATE_TYPE } from '@/constants';
import { api } from '..';

type TReturnType = {
    fixedRateAdvertsEndDate: string;
    floatRateOffsetLimitString: string;
    rateType: (typeof RATE_TYPE)[keyof typeof RATE_TYPE];
    reachedTargetDate: boolean;
};

const useFloatingRate = (): TReturnType => {
    const { data } = api.settings.useSettings();
    const fixedRateAdvertsEndDate = data?.fixed_rate_adverts_end_date ?? '';
    const reachedTargetDate = data?.reachedTargetDate ?? false;
    const floatRateOffsetLimitString = data?.floatRateOffsetLimitString ?? '';

    return {
        fixedRateAdvertsEndDate,
        floatRateOffsetLimitString,
        rateType: data?.rateType ?? RATE_TYPE.FIXED,
        reachedTargetDate,
    };
};

export default useFloatingRate;
