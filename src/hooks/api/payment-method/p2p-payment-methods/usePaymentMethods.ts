import { useMemo } from 'react';
import { useP2pPaymentMethods } from '@deriv-com/api-hooks';

/** A custom hook that returns a list of P2P available payment methods **/
const usePaymentMethods = (enabled = true) => {
    const { data, ...rest } = useP2pPaymentMethods({
        enabled,
        refetchOnWindowFocus: false,
    });

    // Modify the data to add additional information.
    const modified_data = useMemo(() => {
        const p2p_payment_methods = data;

        if (!p2p_payment_methods) return undefined;

        return Object.keys(p2p_payment_methods).map((key: string) => {
            const payment_method = p2p_payment_methods[key];
            return {
                ...payment_method,
                /** Payment method id */
                id: key,
            };
        });
    }, [data]);

    return {
        data: modified_data,
        ...rest,
    };
};

export default usePaymentMethods;
