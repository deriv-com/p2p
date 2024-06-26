import { useEffect } from 'react';
import { DeepPartial } from 'react-hook-form';
import { useLocalStorage } from 'usehooks-ts';
import { useP2PSettings, useSubscribe } from '@deriv-com/api-hooks';

type TP2PSettings =
    | (ReturnType<typeof useP2PSettings>['data'] & {
          currencyList: {
              display_name: string;
              has_adverts: 0 | 1;
              is_default?: 1;
              text: string;
              value: string;
          }[];
          float_rate_offset_limit_string: string;
          is_cross_border_ads_enabled: boolean;
          is_disabled: boolean;
          is_payment_methods_enabled: boolean;
          localCurrency?: string;
          rate_type: 'fixed' | 'float';
          reached_target_date: boolean;
      })
    | undefined;

type TCurrencyListItem = {
    display_name: string;
    has_adverts: 0 | 1;
    is_default?: 1;
    text: string;
    value: string;
};

const useSettings = () => {
    const { data, ...rest } = useSubscribe('p2p_settings');
    const [p2pSettings, setP2PSettings] = useLocalStorage<DeepPartial<TP2PSettings>>('p2p_settings', {});

    useEffect(() => {
        if (data) {
            const p2pSettingsData = data.p2p_settings;

            if (!p2pSettingsData) return undefined;

            const reached_target_date = () => {
                if (!p2pSettingsData?.fixed_rate_adverts_end_date) return false;

                const currentDate = new Date(new Date().getTime()).setUTCHours(23, 59, 59, 999);
                const cutoffDate = new Date(
                    new Date(p2pSettingsData?.fixed_rate_adverts_end_date).getTime()
                ).setUTCHours(23, 59, 59, 999);

                return currentDate > cutoffDate;
            };

            let localCurrency;

            const currencyList = p2pSettingsData.local_currencies.reduce((acc: TCurrencyListItem[], currency) => {
                const { display_name, has_adverts, is_default, symbol } = currency;

                if (is_default) localCurrency = symbol;

                if (has_adverts) {
                    acc.push({
                        display_name,
                        has_adverts,
                        is_default,
                        text: symbol,
                        value: symbol,
                    });
                }

                return acc;
            }, []);

            setP2PSettings({
                ...p2pSettingsData,
                /** Modified list of local_currencies */
                currencyList,
                /** Indicates the maximum rate offset for floating rate adverts. */
                float_rate_offset_limit_string:
                    p2pSettingsData?.float_rate_offset_limit?.toString().split('.')?.[1]?.length > 2
                        ? (p2pSettingsData.float_rate_offset_limit - 0.005).toFixed(2)
                        : p2pSettingsData.float_rate_offset_limit.toFixed(2),
                /** Indicates if the cross border ads feature is enabled. */
                is_cross_border_ads_enabled: Boolean(p2pSettingsData?.cross_border_ads_enabled),
                /** Indicates if the P2P service is unavailable. */
                is_disabled: Boolean(p2pSettingsData?.disabled),
                /** Indicates if the payment methods feature is enabled. */
                is_payment_methods_enabled: Boolean(p2pSettingsData?.payment_methods_enabled),
                /** Indicates the default local currency */
                localCurrency,
                /** Indicates if the current rate type is floating or fixed rates */
                rate_type: (p2pSettingsData?.float_rate_adverts === 'enabled' ? 'float' : 'fixed') as 'fixed' | 'float',
                /** Indicates if the fixed rate adverts end date has been reached. */
                reached_target_date: reached_target_date(),
            });
        }
    }, [data, setP2PSettings]);

    return {
        ...rest,
        data: p2pSettings,
    };
};

export default useSettings;
