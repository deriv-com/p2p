import { useCallback, useMemo } from 'react';
import { useP2pAdvertCreate } from '@deriv-com/api-hooks';
import useInvalidateQuery from '../../useInvalidateQuery';

type TPayload = Parameters<ReturnType<typeof useP2pAdvertCreate>['mutate']>[number];

/** A custom hook that creates a P2P advert. This can only be used by an approved P2P advertiser.
 * 
 * To create an advert, specify the following payload arguments in the `mutate` call (some arguments are optional):
 * @example
 *  mutate({
        description: 'Please transfer to account number 1234',
        type: 'buy',
        amount: 100,
        max_order_amount: 50,
        min_order_amount: 20,
        payment_method: 'bank_transfer',
        rate: 4.25,
    });
 * 
*/
const useAdvertCreate = () => {
    const invalidate = useInvalidateQuery();
    const {
        data,
        mutate: _mutate,
        ...rest
    } = useP2pAdvertCreate({
        onSuccess: () => {
            invalidate('p2p_advert_list');
        },
    });

    const mutate = useCallback((payload: TPayload) => _mutate(payload), [_mutate]);

    const memoizedData = useMemo(() => {
        if (!data) return undefined;

        return {
            ...data,
        };
    }, [data]);

    return {
        data: memoizedData,
        mutate,
        ...rest,
    };
};

export default useAdvertCreate;
