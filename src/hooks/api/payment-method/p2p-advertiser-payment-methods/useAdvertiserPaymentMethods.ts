import { useMemo } from 'react';
import { useP2PAdvertiserPaymentMethods } from '@deriv-com/api-hooks';

/** A custom hook that returns the list of P2P Advertiser Payment Methods */
const useAdvertiserPaymentMethods = () => {
    const { data, ...rest } = useP2PAdvertiserPaymentMethods();

    // Modify the response to add additional information
    const modifiedData = useMemo(() => {
        const paymentMethods = data;

        if (!paymentMethods) return undefined;

        return Object.keys(paymentMethods).map(key => {
            const paymentMethod = paymentMethods[key];

            return {
                ...paymentMethod,
                /** The id of payment method */
                id: key,
            };
        });
    }, [data]);

    return {
        /** The list of P2P Advertiser Payment Methods */
        data: modifiedData,
        ...rest,
    };
};

export default useAdvertiserPaymentMethods;
