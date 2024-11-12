import { useEffect, useState } from 'react';
import { getServerInfo } from '@/constants';
import useGrowthbookGetFeatureValue from './useGrowthbookGetFeatureValue';

type hydraBEValue = {
    // list of app ids having oauth2 enabled
    disabled_for: string[];
    enabled_for: number[]; // list of blocked app ids
    official_apps_enabled: boolean;
};

type hydraBEApps = [
    null, // this value is used by BE
    hydraBEValue,
];

/**
 * useOAuth2Enabled - hooks to indicate if oauth 2 is enable for the app
 *
 * @returns [boolean]
 */
const useOAuth2Enabled = () => {
    const [OAuth2EnabledApps, OAuth2EnabledAppsInitialised] = useGrowthbookGetFeatureValue<string>({
        featureFlag: 'hydra_be',
    }) as unknown as [hydraBEApps, boolean];
    const [isOauth2Enabled, setIsOauth2Enabled] = useState<boolean>(false);
    const { appId } = getServerInfo();

    useEffect(() => {
        if (OAuth2EnabledAppsInitialised) {
            const FEHydraAppIds = OAuth2EnabledApps.length
                ? OAuth2EnabledApps[OAuth2EnabledApps.length - 1]?.enabled_for ?? []
                : [];
            setIsOauth2Enabled(FEHydraAppIds.includes(+(appId as string)));
        }
    }, [OAuth2EnabledAppsInitialised, OAuth2EnabledApps]);

    return [isOauth2Enabled];
};

export default useOAuth2Enabled;
