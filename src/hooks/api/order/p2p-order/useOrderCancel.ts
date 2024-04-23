import { useCallback } from 'react';
import { useP2pOrderCancel } from '@deriv-com/api-hooks';
import useInvalidateQuery from '../../useInvalidateQuery';

type TOrderCancelPayload = NonNullable<Parameters<ReturnType<typeof useP2pOrderCancel>['mutate']>>[0]['payload'];

/** A custom hook that cancels a P2P order.
 *
 * To cancel an order, specify the following payload arguments in the `mutate` call:
 * @example
 *  mutate({
 *      id: "1234",
    });
 *
*/
const useOrderCancel = () => {
    const invalidate = useInvalidateQuery();
    const {
        data,
        mutate: _mutate,
        ...rest
    } = useP2pOrderCancel({
        onSuccess: () => {
            invalidate('p2p_order_info');
        },
    });

    const mutate = useCallback((payload: TOrderCancelPayload) => _mutate({ payload }), [_mutate]);

    return {
        /** An object that contains the id and status of the order */
        data,
        /** A function that cancels a specific order */
        mutate,
        ...rest,
    };
};

export default useOrderCancel;
