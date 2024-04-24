import { useP2pOrderCancel } from '@deriv-com/api-hooks';
import useInvalidateQuery from '../../useInvalidateQuery';

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
    const { data, ...rest } = useP2pOrderCancel({
        onSuccess: () => {
            invalidate('p2p_order_info');
        },
    });

    return {
        /** An object that contains the id and status of the order */
        data,
        ...rest,
    };
};

export default useOrderCancel;
