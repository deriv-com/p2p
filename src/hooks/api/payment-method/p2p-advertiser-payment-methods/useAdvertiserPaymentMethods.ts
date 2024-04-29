import { useMemo } from 'react';
import { useP2PAdvertiserPaymentMethods } from '@deriv-com/api-hooks';

/** A custom hook that returns the list of P2P Advertiser Payment Methods */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useAdvertiserPaymentMethods = (_is_enabled = true) => {
    const { data, ...rest } = useP2PAdvertiserPaymentMethods({
        //TODO: Add the enabled parameter to the API after api-hooks is updated
        // enabled: is_enabled,
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
