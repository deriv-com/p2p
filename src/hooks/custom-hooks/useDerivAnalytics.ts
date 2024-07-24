/* eslint-disable @typescript-eslint/ban-ts-comment */
import Cookies from 'js-cookie';
import { FIREBASE_INIT_DATA } from '@/constants';
import { Analytics } from '@deriv-com/analytics';
import { useWebsiteStatus } from '@deriv-com/api-hooks';
import { useDevice } from '@deriv-com/ui';
import { LocalStorageConstants, WebSocketUtils } from '@deriv-com/utils';
import { useActiveAccount } from '../api/account';

/**
 * Custom hook to initialize Deriv Analytics which is including GrowthBook and Rudderstack.
 * @returns {Object} An object containing the `initialise` function which initialize growthbook and rudderstack.
 */
const useDerivAnalytics = () => {
    const { data: activeAccount } = useActiveAccount();
    const { data: websiteStatus } = useWebsiteStatus();
    const { isMobile } = useDevice();
    const currentLang = localStorage.getItem(LocalStorageConstants.i18nLanguage) || 'EN';

    const initialise = async () => {
        try {
            const isDerivAnalyticsInitialized = Analytics?.getInstances()?.tracking?.has_initialized;

            if (!isDerivAnalyticsInitialized) {
                const remoteConfigURL = process.env.VITE_REMOTE_CONFIG_URL;
                if (remoteConfigURL) {
                    const services = await fetch(remoteConfigURL)
                        .then(res => res.json())
                        .catch(() => FIREBASE_INIT_DATA);

                    const ppcCampaignCookies =
                        // @ts-expect-error
                        Cookies.getJSON('utm_data') === 'null'
                            ? {
                                  utm_campaign: 'no campaign',
                                  utm_content: 'no content',
                                  utm_medium: 'no medium',
                                  utm_source: 'no source',
                              }
                            : // @ts-expect-error
                              Cookies.getJSON('utm_data');

                    Analytics.initialise({
                        growthbookDecryptionKey: services?.marketing_growthbook
                            ? process.env.VITE_GROWTHBOOK_DECRYPTION_KEY
                            : undefined,
                        growthbookKey: services?.marketing_growthbook
                            ? process.env.VITE_GROWTHBOOK_CLIENT_KEY
                            : undefined,
                        rudderstackKey: services?.tracking_rudderstack ? process.env.VITE_RUDDERSTACK_KEY || '' : '',
                    });

                    await Analytics?.getInstances()?.ab?.GrowthBook?.init();

                    Analytics.setAttributes({
                        account_type: activeAccount?.account_type || 'unlogged',
                        app_id: String(WebSocketUtils.getAppId()),
                        country: websiteStatus?.clients_country,
                        device_language: navigator?.language || 'en-EN',
                        device_type: isMobile ? 'mobile' : 'desktop',
                        domain: window.location.hostname,
                        user_language: currentLang,
                        utm_campaign: ppcCampaignCookies?.utm_campaign,
                        utm_content: ppcCampaignCookies?.utm_content,
                        utm_medium: ppcCampaignCookies?.utm_medium,
                        utm_source: ppcCampaignCookies?.utm_source,
                    });
                }
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
