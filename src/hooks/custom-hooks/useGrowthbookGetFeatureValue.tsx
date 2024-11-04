import { useEffect, useState } from 'react';
import getFeatureFlag from '@/utils/get-featureflag';
import { Analytics } from '@deriv-com/analytics';

interface UseGrowthbookGetFeatureValueArgs<T> {
    defaultValue?: T;
    featureFlag: string;
}

const useGrowthbookGetFeatureValue = <T extends boolean | string>({
    defaultValue,
    featureFlag,
}: UseGrowthbookGetFeatureValueArgs<T>) => {
    const resolvedDefaultValue: T = defaultValue !== undefined ? defaultValue : (false as T);
    const [featureFlagValue, setFeatureFlagValue] = useState<boolean>(false);
    const [isGBLoaded, setIsGBLoaded] = useState(false);

    // Required for debugging Growthbook, this will be removed after this is added in the Analytics directly.
    if (typeof window !== 'undefined') {
        window.Analytics = Analytics;
    }

    useEffect(() => {
        const fetchFeatureFlag = async () => {
            const isEnabled = await getFeatureFlag(featureFlag, resolvedDefaultValue);
            setFeatureFlagValue(isEnabled);
            setIsGBLoaded(true);
        };

        fetchFeatureFlag();
    }, []);

    return [featureFlagValue, isGBLoaded];
};

export default useGrowthbookGetFeatureValue;
