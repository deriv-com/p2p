import { HUB_ENABLED_COUNTRY_LIST } from '@/constants';

/** A custom hook that returns the remote configuration to get hub_enabled_country_list. */
const useGetHubEnabledCountryList = () => {
    const HUB_REMOTE_CONFIG_URL = process.env.HUB_REMOTE_CONFIG_URL || '';

    if (HUB_REMOTE_CONFIG_URL) {
        const getRemoteConfig = async () => {
            const response = await fetch(HUB_REMOTE_CONFIG_URL)
                .then(res => res.json())
                .catch(() => {
                    return HUB_ENABLED_COUNTRY_LIST;
                });

            return {
                data: response,
            };
        };

        getRemoteConfig();
    }

    return {
        data: HUB_ENABLED_COUNTRY_LIST,
    };
};

export default useGetHubEnabledCountryList;
