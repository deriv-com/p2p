/** A custom hook that returns the remote configuration to get the tmb feature flag. */
const useTMBFeatureFlag = () => {
    const TMB_REMOTE_CONFIG_URL = process.env.VITE_TMB_REMOTE_CONFIG_URL || '';

    if (TMB_REMOTE_CONFIG_URL) {
        const getRemoteConfig = async () => {
            const response = await fetch(TMB_REMOTE_CONFIG_URL)
                .then(res => res.json())
                .catch(() => {
                    return false;
                });

            return {
                data: response.p2p ?? false,
            };
        };

        getRemoteConfig();
    }

    return {
        data: false,
    };
};

export default useTMBFeatureFlag;
