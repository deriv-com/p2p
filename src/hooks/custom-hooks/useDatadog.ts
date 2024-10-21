import { datadogRum } from '@datadog/browser-rum';

/**
 * Custom hook to initialize Datadog.
 * @returns {Object} An object containing the `initialise` function.
 */

const useDatadog = () => {
    const getConfigValues = (environment: string) => {
        if (environment === 'production') {
            return {
                dataDogEnv: 'production',
                dataDogSessionReplaySampleRate: Number(process.env.VITE_DATADOG_SESSION_REPLAY_SAMPLE_RATE ?? 1),
                dataDogSessionSampleRate: Number(process.env.VITE_DATADOG_SESSION_SAMPLE_RATE ?? 10),
                dataDogVersion: `deriv-p2p-${process.env.REF_NAME}`,
                serviceName: 'p2p.deriv.com',
            };
        } else if (environment === 'staging') {
            return {
                dataDogEnv: 'staging',
                dataDogSessionReplaySampleRate: 0,
                dataDogSessionSampleRate: 100,
                dataDogVersion: `deriv-p2p-staging-v${process.env.REF_NAME}`,
                serviceName: 'staging-p2p.deriv.com',
            };
        }
    };

    const initialise = () => {
        const DATADOG_APP_ID = process.env.VITE_DATADOG_APPLICATION_ID ?? '';
        const DATADOG_CLIENT_TOKEN = process.env.VITE_DATADOG_CLIENT_TOKEN ?? '';
        const isProduction = process.env.NODE_ENV === 'production';
        const isStaging = process.env.NODE_ENV === 'staging';

        const {
            dataDogEnv = '',
            dataDogSessionReplaySampleRate = 0,
            dataDogSessionSampleRate = 0,
            dataDogVersion = '',
            serviceName = '',
        } = getConfigValues(process.env.NODE_ENV ?? '') ?? {};

        if (isProduction || isStaging) {
            datadogRum.init({
                applicationId: isStaging || isProduction ? DATADOG_APP_ID : '',
                clientToken: isStaging || isProduction ? DATADOG_CLIENT_TOKEN : '',
                defaultPrivacyLevel: 'mask-user-input',
                enableExperimentalFeatures: ['clickmap'],
                env: dataDogEnv,
                service: serviceName,
                sessionReplaySampleRate: dataDogSessionReplaySampleRate,
                sessionSampleRate: dataDogSessionSampleRate,
                site: 'datadoghq.com',
                trackLongTasks: true,
                trackResources: true,
                trackUserInteractions: true,
                version: dataDogVersion,
            });
        }
    };

    return {
        initialise,
    };
};

export default useDatadog;
