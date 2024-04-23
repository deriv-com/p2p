//TODO: remove once implemented in api-hooks
import { useCallback, useRef, useState } from 'react';
import { useSubscribe } from '@deriv-com/api-hooks';

type TCurrencyExchangeSubscribeFunction<T> = { base_currency: T; target_currencies: T[] };

/**
 * `useExchangeRateSubscription` is a custom hook that provides functionalities for subscribing to exchange rates,
 *  unsubscribing from them, and getting the exchange rate between two currencies.
 *
 * @returns {Object} An object containing the following properties:
 * - `data`: The data received from the subscription.
 * - `exchangeRates`: The current exchange rates.
 * - `getExchangeRate`: A function to get the exchange rate between two currencies.
 * - `subscribeRates`: A function to subscribe to exchange rates for a base currency and a list of target currencies.
 * - `unsubscribeRates`: A function to unsubscribe from exchange rates for a base currency and a list of target currencies.
 */
const useExchangeRateSubscription = () => {
    const { data, subscribe, unsubscribe } = useSubscribe('exchange_rates');
    const [exchangeRates, setExchangeRates] = useState<Record<string, Record<string, number>>>({});
    const exchangeRatesSubscriptions = useRef<{ base_currency: string; target_currency: string }[]>([]);

    /**
     * `subscribeRates` is a function that subscribes to exchange rates for a base currency and a list of target currencies.
     * It updates the `exchangeRates` state with the initial exchange rates for the new subscriptions.
     *
     * @param {Object} params - The parameters for the subscription.
     * @param {string} params.base_currency - The base currency.
     * @param {string[]} params.target_currencies - The target currencies.
     * @returns {Promise<Object>} A promise that resolves to the new exchange rates.
     */
    const subscribeRates = useCallback(
        async ({ base_currency, target_currencies }: TCurrencyExchangeSubscribeFunction<string>) => {
            await Promise.all(
                target_currencies.map(async target_currency => {
                    exchangeRatesSubscriptions.current.push({ base_currency, target_currency });
                    await subscribe({ base_currency, target_currency });
                })
            );

            const newExchangeRates = { ...exchangeRates };

            if (!newExchangeRates[base_currency]) newExchangeRates[base_currency] = {};

            target_currencies.forEach(c => {
                newExchangeRates[base_currency][c] = 1;
            });

            setExchangeRates(newExchangeRates);

            return newExchangeRates;
        },
        [exchangeRates, subscribe]
    );

    /**
     * `unsubscribeRates` is a function that unsubscribes from exchange rates for a base currency and a list of target currencies.
     * It updates the `exchangeRates` state to remove the exchange rates for the unsubscribed currencies.
     *
     * @param {Object} params - The parameters for the unsubscription.
     * @param {string} params.base_currency - The base currency.
     * @param {string[]} params.target_currencies - The target currencies.
     */
    const unsubscribeRates = useCallback(
        async ({ base_currency, target_currencies }: TCurrencyExchangeSubscribeFunction<string>) => {
            exchangeRatesSubscriptions.current = exchangeRatesSubscriptions.current.filter(s => {
                if (s.base_currency === base_currency && target_currencies.includes(s.target_currency)) {
                    unsubscribe();
                    return false;
                }
                return true;
            });

            setExchangeRates(prev => {
                const currentData = { ...(prev ?? {}) };
                if (currentData[base_currency]) {
                    target_currencies.forEach(c => {
                        delete currentData[base_currency][c];
                    });
                }
                return currentData;
            });
        },
        [unsubscribe]
    );

    const getExchangeRate = (base: string, target: string) => {
        return exchangeRates?.[base]?.[target] ?? 1;
    };

    return { data, exchangeRates, getExchangeRate, subscribeRates, unsubscribeRates };
};

export default useExchangeRateSubscription;
