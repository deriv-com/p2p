import { useCallback } from 'react';
import { useP2pAdvertiserPaymentMethods } from '@deriv-com/api-hooks';
import useInvalidateQuery from '../../useInvalidateQuery';
/** A custom hook that sends a request to delete an existing p2p advertiser payment method. */
const useDeleteAdvertiserPaymentMethods = () => {
    const invalidate = useInvalidateQuery();
    const { data, mutate, ...rest } = useP2pAdvertiserPaymentMethods({
        onSuccess: () => invalidate('p2p_advertiser_payment_methods'),
    });

    const deletePaymentMethod = useCallback((id: number) => mutate({ payload: { delete: [id] } }), [mutate]);

    return {
        data,
        /** Sends a request to delete an existing p2p advertiser payment method */
        delete: deletePaymentMethod,
        ...rest,
    };
};

export default useDeleteAdvertiserPaymentMethods;
