import Cookies from 'js-cookie';
import { FIREBASE_INIT_DATA } from '@/constants';
import { Analytics } from '@deriv-com/analytics';
import { useWebsiteStatus } from '@deriv-com/api-hooks';
import { useDevice } from '@deriv-com/ui';
import { LocalStorageConstants, LocalStorageUtils, WebSocketUtils } from '@deriv-com/utils';
import { useActiveAccount } from '../api/account';

/**
 * Custom hook to initialize Deriv Analytics which is including GrowthBook and Rudderstack.
 * @returns {Object} An object containing the `initialise` function which initialize growthbook and rudderstack.
 */
const useDerivAnalytics = () => {
    const { data: activeAccount } = useActiveAccount();
    const { data: websiteStatus } = useWebsiteStatus();
    const { isMobile } = useDevice();
    const currentLang = LocalStorageUtils.getValue<string>(LocalStorageConstants.i18nLanguage) ?? 'EN';

    const initialise = async () => {
        try {
            const isDerivAnalyticsInitialized = Analytics?.getInstances()?.tracking?.has_initialized;
            const isProduction = process.env.NODE_ENV === 'production';

            if (!isDerivAnalyticsInitialized && websiteStatus) {
            if (!isDerivAnalyticsInitialized) {
                const remoteConfigURL = process.env.VITE_REMOTE_CONFIG_URL;
                let services = FIREBASE_INIT_DATA;
                if (remoteConfigURL) {
                    services = await fetch(remoteConfigURL).then(res => res.json().catch(() => FIREBASE_INIT_DATA));
                }

                const utmDataFromCookie = Cookies.get('utm_data');
                const ppcCampaignCookies = utmDataFromCookie
                    ? JSON.parse(utmDataFromCookie)
                    : {
                          utm_campaign: 'no campaign',
                          utm_content: 'no content',
                          utm_medium: 'no medium',
                          utm_source: 'no source',
                      };

                Analytics.initialise({
                    growthbookDecryptionKey: services?.marketing_growthbook
                        ? process.env.VITE_GROWTHBOOK_DECRYPTION_KEY
                        : undefined,
                    growthbookKey: services?.marketing_growthbook ? process.env.VITE_GROWTHBOOK_CLIENT_KEY : undefined,
                    growthbookOptions: {
                        disableCache: !isProduction,
                    },
                    rudderstackKey: services?.tracking_rudderstack ? process.env.VITE_RUDDERSTACK_KEY || '' : '',
                });

                await Analytics?.getInstances()?.ab?.GrowthBook?.init();
                Analytics.setAttributes({
                    account_type: activeAccount?.account_type || 'unlogged',
                    app_id: String(WebSocketUtils.getAppId()),
                    country:
                        JSON.parse(Cookies.get('website_status') || '{}')?.clients_country ||
                        websiteStatus?.clients_country,
                    device_language: navigator?.language || 'en-EN',
                    device_type: isMobile ? 'mobile' : 'desktop',
                    domain: window.location.hostname,
                    user_language: currentLang.toLowerCase(),
                    utm_campaign: ppcCampaignCookies?.utm_campaign,
                    utm_content: ppcCampaignCookies?.utm_content,
                    utm_medium: ppcCampaignCookies?.utm_medium,
                    utm_source: ppcCampaignCookies?.utm_source,
                });
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Failed to initialize Deriv-analytics', error);
        }
    };

    return {
        initialise,
    };
};

export default useDerivAnalytics;
