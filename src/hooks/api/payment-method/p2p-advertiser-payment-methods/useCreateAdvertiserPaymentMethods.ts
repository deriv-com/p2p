import { useCallback } from 'react';
import { NonUndefined } from 'react-hook-form';
import { useP2PAdvertiserPaymentMethods } from '@deriv-com/api-hooks';
import useInvalidateQuery from '../../useInvalidateQuery';

type TPayloads = Parameters<ReturnType<typeof useP2PAdvertiserPaymentMethods>['mutate']>;
type TCreatePayload = NonUndefined<TPayloads[number]['create']>[number];

/** A custom hook that sends a request to create a new p2p advertiser payment method. */
const useCreateAdvertiserPaymentMethods = () => {
    const invalidate = useInvalidateQuery();
    const { data, mutate, ...rest } = useP2PAdvertiserPaymentMethods({
        onSuccess: () => invalidate('p2p_advertiser_payment_methods'),
    });

    const create = useCallback((values: TCreatePayload) => mutate({ create: [{ ...values }] }), [mutate]);

    return {
        /** Sends a request to create a new p2p advertiser payment method */
        create,
        data,
        ...rest,
    };
};

export default useCreateAdvertiserPaymentMethods;
