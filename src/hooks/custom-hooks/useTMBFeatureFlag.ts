/** A custom hook that returns the value for the tmb feature flag. */
const useTMBFeatureFlag = () => {
    const TMB_REMOTE_CONFIG_URL = process.env.VITE_TMB_REMOTE_CONFIG_URL || '';
    const isTMBEnabled = JSON.parse(localStorage.getItem('is_tmb_enabled') ?? '');

    if (TMB_REMOTE_CONFIG_URL) {
        const getRemoteConfig = async () => {
            const response = await fetch(TMB_REMOTE_CONFIG_URL)
                .then(res => res.json())
                .catch(() => {
                    return false;
                });

            return {
                data: response.p2p ?? isTMBEnabled,
            };
        };

        getRemoteConfig();
    }

    return {
        data: isTMBEnabled,
    };
};

export default useTMBFeatureFlag;
