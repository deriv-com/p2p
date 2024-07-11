import { useMemo } from 'react';
import { useP2POrderCreate } from '@deriv-com/api-hooks';
import useInvalidateQuery from '../../useInvalidateQuery';

/** A custom hook that creates a P2P order. 
 * 
 * To create an order, specify the following payload arguments in the `mutate` call (some arguments are optional):
 * @example
 *  mutate({
        advert_id: '12345',
        amount: '100',
        contact_info: '012345678',
        payment_info: 'Some payment info',
    });
 * 
*/
const useOrderCreate = () => {
    const invalidate = useInvalidateQuery();
    const { data, ...rest } = useP2POrderCreate({
        onSuccess: () => {
            invalidate('p2p_order_list');
        },
    });

    const modifiedData = useMemo(() => {
        if (!data) return undefined;

        const { advert_details, advertiser_details, client_details, is_incoming, is_reviewable, is_seen } = data;

        return {
            ...data,
            advert_details: {
                ...advert_details,
                /** Indicates if this is block trade advert or not. */
                is_block_trade: Boolean(advert_details.block_trade),
            },
            advertiser_details: {
                ...advertiser_details,
                /** Indicates if the advertiser is currently online. */
                is_online: Boolean(advertiser_details.is_online),
            },
            client_details: {
                ...client_details,
                /** Indicates if the advertiser is currently online. */
                is_online: Boolean(client_details.is_online),
            },
            /** Indicates if the order is created for the advert of the current client. */
            is_incoming: Boolean(is_incoming),
            /** Indicates if a review can be given. */
            is_reviewable: Boolean(is_reviewable),
            /** Indicates if the latest order changes have been seen by the current client. */
            is_seen: Boolean(is_seen),
        };
    }, [data]);

    return {
        /** The 'p2p_order_create' response. */
        data: modifiedData,
        ...rest,
    };
};

export default useOrderCreate;
