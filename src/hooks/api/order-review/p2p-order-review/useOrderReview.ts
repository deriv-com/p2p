import { useCallback } from 'react';
import { useP2POrderReview } from '@deriv-com/api-hooks';
import useInvalidateQuery from '../../useInvalidateQuery';

type TOrderReviewPayload = NonNullable<Parameters<ReturnType<typeof useP2POrderReview>['mutate']>>[0];

/** A custom hook that creates a review for a specified order
 *
 * To create a review for an order, specify the required fields order_id and rating to the mutation payload:
 * @example
 *  mutate({
        order_id: '1234',
        rating: 4,
        recommended: 1 // optional
    });
 *
*/
const useOrderReview = () => {
    const invalidate = useInvalidateQuery();
    const {
        data,
        mutate: _mutate,
        ...rest
    } = useP2POrderReview({
        onSuccess: () => {
            invalidate('p2p_order_list');
        },
    });

    const mutate = useCallback(
        (payload: TOrderReviewPayload) => {
            _mutate(payload);
        },
        [_mutate]
    );

    return {
        /** Data returned after a review was created for the order */
        data,
        /** mutate function to create a review for a specified order */
        mutate,
        ...rest,
    };
};
export default useOrderReview;
