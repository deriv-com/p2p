import { useEffect, useState } from 'react';
/** A custom hook that returns the value for the tmb feature flag. */
const useTMBFeatureFlag = () => {
    const TMB_REMOTE_CONFIG_URL = process.env.VITE_TMB_REMOTE_CONFIG_URL || '';
    const isTMBEnabled = JSON.parse(localStorage.getItem('is_tmb_enabled') as string);
    const [isTMBEnabledValue, setIsTMBEnabledValue] = useState<boolean>(isTMBEnabled);

    useEffect(() => {
        if (TMB_REMOTE_CONFIG_URL) {
            if (isTMBEnabled !== null && isTMBEnabled !== undefined) return;

            const getRemoteConfig = async () => {
                try {
                    const response = await fetch(TMB_REMOTE_CONFIG_URL);
                    const data = await response.json();
                    setIsTMBEnabledValue(data.p2p);
                } catch (error) {
                    setIsTMBEnabledValue(true);
                }
            };

            getRemoteConfig();
        }
    }, []);

    return {
        data: isTMBEnabledValue,
    };
};

export default useTMBFeatureFlag;
