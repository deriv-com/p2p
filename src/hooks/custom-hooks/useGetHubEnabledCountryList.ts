import { useCallback, useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { HUB_ENABLED_COUNTRY_LIST } from '@/constants';
import { useHubEnabledCountryListStore } from '@/stores';

/** A custom hook that returns the remote configuration to get hub_enabled_country_list. */
const useGetHubEnabledCountryList = () => {
    const HUB_REMOTE_CONFIG_URL = process.env.VITE_HUB_REMOTE_CONFIG_URL || '';
    const { hubEnabledCountryList, setHubEnabledCountryList } = useHubEnabledCountryListStore(
        useShallow(state => ({
            hubEnabledCountryList: state.hubEnabledCountryList,
            setHubEnabledCountryList: state.setHubEnabledCountryList,
        }))
    );

    const getRemoteConfig = useCallback(async () => {
        try {
            const response = await fetch(HUB_REMOTE_CONFIG_URL);
            const data = await response.json();
            setHubEnabledCountryList(data);
        } catch (error) {
            setHubEnabledCountryList(HUB_ENABLED_COUNTRY_LIST);
        }
    }, [hubEnabledCountryList]);

    useEffect(() => {
        if (HUB_REMOTE_CONFIG_URL && hubEnabledCountryList.length === 0) getRemoteConfig();
    }, []);

    return {
        data: hubEnabledCountryList,
    };
};

export default useGetHubEnabledCountryList;
