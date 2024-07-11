import { useMemo } from 'react';
import { useSubscribe } from '@deriv-com/api-hooks';

// TODO: Convert this to use useSubscribe as it is a subscribable endpoint
/** This custom hook that returns information about the given order ID */
const useOrderInfo = () => {
    const { data, ...rest } = useSubscribe('p2p_order_info');

    // modify the data to add additional information
    const modified_data = useMemo(() => {
        if (!data?.p2p_order_info) return undefined;

        const {
            advert_details,
            advertiser_details,
            client_details,
            is_incoming,
            is_reviewable,
            is_seen,
            review_details,
            verification_pending,
        } = data.p2p_order_info;

        return {
            ...data.p2p_order_info,
            advert_details: {
                ...advert_details,
                /** Indicates if this is block trade advert or not. */
                is_block_trade: Boolean(advert_details.block_trade),
            },
            advertiser_details: {
                ...advertiser_details,
                /** Indicates that the advertiser has not been recommended yet. */
                has_not_been_recommended: advertiser_details.is_recommended === null,
                /** Indicates if the advertiser is currently online. */
                is_online: Boolean(advertiser_details.is_online),
                /** Indicates that the advertiser was recommended in the most recent review by the current user. */
                is_recommended: Boolean(client_details.is_recommended),
            },
            client_details: {
                ...client_details,
                /** Indicates that the client has not been recommended yet. */
                has_not_been_recommended: client_details.is_recommended === null,
                /** Indicates if the advertiser is currently online. */
                is_online: Boolean(client_details.is_online),
                /** Indicates that the client was recommended in the most recent review by the current user. */
                is_recommended: Boolean(client_details.is_recommended),
            },
            /** Indicates if the order is created for the advert of the client. */
            is_incoming: Boolean(is_incoming),
            /** Indicates if a review can be given. */
            is_reviewable: Boolean(is_reviewable),
            /** Indicates if the latest order changes have been seen by the current client. */
            is_seen: Boolean(is_seen),
            /** Indicates that the seller in the process of confirming the order. */
            is_verification_pending: Boolean(verification_pending),
            review_details: review_details
                ? {
                      ...review_details,
                      /** Indicates that the advertiser has not been recommended yet. */
                      has_not_been_recommended: review_details?.recommended === null,
                      /** Indicates if the advertiser is recommended or not. */
                      is_recommended: Boolean(review_details?.recommended),
                  }
                : undefined,
        };
    }, [data]);

    return {
        /** The 'p2p_order_info' response. */
        data: modified_data,
        ...rest,
    };
};

export default useOrderInfo;
