import { useCallback } from 'react';
import { useP2PAdvertiserPaymentMethods } from '@deriv-com/api-hooks';
import useInvalidateQuery from '../../useInvalidateQuery';

type TPayloads = Parameters<ReturnType<typeof useP2PAdvertiserPaymentMethods>['mutate']>;
type TUpdatePayload = NonNullable<TPayloads[number]['update']>[number];

/** A custom hook that sends a request to update an existing p2p advertiser payment method. */
const useUpdateAdvertiserPaymentMethods = () => {
    const invalidate = useInvalidateQuery();
    const { data, mutate, ...rest } = useP2PAdvertiserPaymentMethods({
        onSuccess: () => invalidate('p2p_advertiser_payment_methods'),
    });

    const update = useCallback(
        (id: string, values: TUpdatePayload) => mutate({ update: { [id]: { ...values } } }),
        [mutate]
    );

    return {
        data,
        /** Sends a request to update an existing p2p advertiser payment method */
        update,
        ...rest,
    };
};

export default useUpdateAdvertiserPaymentMethods;
