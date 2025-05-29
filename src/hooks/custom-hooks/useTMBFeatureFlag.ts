/** A custom hook that returns the value for the tmb feature flag. */
const useTMBFeatureFlag = async () => {
    const TMB_REMOTE_CONFIG_URL = process.env.VITE_TMB_REMOTE_CONFIG_URL || '';
    const isTMBEnabled = JSON.parse(localStorage.getItem('is_tmb_enabled') as string);

    if (TMB_REMOTE_CONFIG_URL) {
        if (isTMBEnabled !== null && isTMBEnabled !== undefined) return { data: isTMBEnabled };

        const getRemoteConfig = async () => {
            try {
                const response = await fetch(TMB_REMOTE_CONFIG_URL);
                const data = await response.json();

                return data.p2p;
            } catch (error) {
                return true;
            }
        };

        const isP2PEnabled = await getRemoteConfig();

        return {
            data: isP2PEnabled,
        };
    }

    return {
        data: isTMBEnabled,
    };
};

export default useTMBFeatureFlag;
