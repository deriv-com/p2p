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

    const modified_data = useMemo(() => {
        if (!data) return undefined;

        return {
            ...data,
            /** Indicates if this is block trade advert or not. */
            block_trade: Boolean(data?.block_trade),
            /** The advert creation time in epoch. */
            created_time: data?.created_time ? new Date(data?.created_time) : undefined,
            /** The activation status of the advert. */
            is_active: Boolean(data?.is_active),
            /** Indicates that this advert will appear on the main advert list. */
            is_visible: Boolean(data?.is_visible),
        };
    }, [data]);

    return {
        data: modified_data,
        mutate,
        ...rest,
    };
};

export default useAdvertCreate;
