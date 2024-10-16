import { useMemo } from 'react';
import { useP2pPaymentMethods } from '@deriv-com/api-hooks';
import { useTranslations } from '@deriv-com/translations';

/** A custom hook that returns a list of P2P available payment methods **/
const usePaymentMethods = (enabled = true) => {
    const { currentLang } = useTranslations();
    const { data, ...rest } = useP2pPaymentMethods({
        enabled,
        queryKey: ['p2p_payment_methods', currentLang],
        refetchOnWindowFocus: false,
    });

    // Modify the data to add additional information.
    const modifiedData = useMemo(() => {
        const p2pPaymentMethods = data;

        if (!p2pPaymentMethods) return undefined;

        return Object.keys(p2pPaymentMethods).map((key: string) => {
            const paymentMethod = p2pPaymentMethods[key];
            return {
                ...paymentMethod,
                /** Payment method id */
                id: key,
            };
        });
    }, [data]);

    return {
        data: modifiedData,
        ...rest,
    };
};

export default usePaymentMethods;
