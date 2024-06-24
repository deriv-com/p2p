import { useCallback } from 'react';
import { useP2pOrderDispute } from '@deriv-com/api-hooks';
import useInvalidateQuery from '../../useInvalidateQuery';

type TOrderDisputePayload = Parameters<ReturnType<typeof useP2pOrderDispute>['mutate']>[number];

/** A custom hook that disputes a P2P order.
 *
 * To dispute an order, specify the following payload arguments in the `mutate` call:
 * @example
 *  mutate({
 *      id: "1234",
        dispute_reason: "seller_not_released",
    });
 *
*/
const useOrderDispute = () => {
    const invalidate = useInvalidateQuery();
    const {
        data,
        mutate: _mutate,
        ...rest
    } = useP2pOrderDispute({
        onSuccess: () => {
            invalidate('p2p_order_info');
        },
    });

    const mutate = useCallback(
        (payload: TOrderDisputePayload) => {
            _mutate(payload);
        },
        [_mutate]
    );

    return {
        /** Data returned after disputing an order */
        data,
        /** mutate function to dispute an order */
        mutate,
        ...rest,
    };
};

export default useOrderDispute;
