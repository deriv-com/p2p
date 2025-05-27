/** A custom hook that returns the value for the tmb feature flag. */
const useTMBFeatureFlag = () => {
    const TMB_REMOTE_CONFIG_URL = process.env.VITE_TMB_REMOTE_CONFIG_URL || '';
    const isTMBEnabled = JSON.parse(localStorage.getItem('is_tmb_enabled') as string);

    if (TMB_REMOTE_CONFIG_URL) {
        const getRemoteConfig = async () => {
            const response = await fetch(TMB_REMOTE_CONFIG_URL)
                .then(res => res.json())
                .catch(() => {
                    return true;
                });

            return {
                data: isTMBEnabled ?? response.p2p,
            };
        };

        getRemoteConfig();
    }

    return {
        data: isTMBEnabled,
    };
};

export default useTMBFeatureFlag;
