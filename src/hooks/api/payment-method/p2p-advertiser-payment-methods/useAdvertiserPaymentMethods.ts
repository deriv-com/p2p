import { useMemo } from 'react';
import { useP2pAdvertiserPaymentMethods } from '@deriv-com/api-hooks';

/** A custom hook that returns the list of P2P Advertiser Payment Methods */
const useAdvertiserPaymentMethods = (is_enabled = true) => {
    const { data, ...rest } = useP2pAdvertiserPaymentMethods({
        options: { enabled: is_enabled },
    });

    // Modify the response to add additional information
    const modified_data = useMemo(() => {
        const payment_methods = data;

        if (!payment_methods) return undefined;

        return Object.keys(payment_methods).map(key => {
            const payment_method = payment_methods[key];

            return {
                ...payment_method,
                /** The id of payment method */
                id: key,
            };
        });
    }, [data]);

    return {
        /** The list of P2P Advertiser Payment Methods */
        data: modified_data,
        ...rest,
    };
};

export default useAdvertiserPaymentMethods;
