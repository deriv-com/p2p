import { useEffect, useState } from 'react';
import { useExchangeRates } from '@deriv-com/api-hooks';

const BASE_CURRENCY = 'USD';

/**
 * A custom hook that returns the exchange rate for the given target currency.
 *
 * @param {string} targetCurrency - The target currency to get the exchange rate for.
 *
 * @example const { exchangeRate } = useP2PExchangeRates('IDR');
 */
const useP2PExchangeRates = (targetCurrency: string) => {
    const { data, subscribeRates, ...rest } = useExchangeRates();
    const [exchangeRate, setExchangeRate] = useState<number | undefined>(undefined);

    useEffect(() => {
        if (targetCurrency)
            subscribeRates({
                base_currency: BASE_CURRENCY,
                target_currencies: [targetCurrency],
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [targetCurrency]);

    useEffect(() => {
        const rate = data?.exchange_rates?.rates?.[targetCurrency];
        if (typeof rate === 'number') {
            setExchangeRate(rate);
        }
    }, [data, targetCurrency]);

    return { exchangeRate, ...rest };
};

export default useP2PExchangeRates;
