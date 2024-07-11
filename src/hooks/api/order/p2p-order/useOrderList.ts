import { useMemo } from 'react';
import { useInfiniteQuery, useP2POrderList } from '@deriv-com/api-hooks';

/** This custom hook returns a list of orders under the current client. */
const useOrderList = (
    payload?: NonNullable<Parameters<typeof useInfiniteQuery<'p2p_order_list'>>[0]>['payload'],
    isEnabled = true
) => {
    // Fetch the order list data which handles pagination
    const { data, ...rest } = useP2POrderList({
        enabled: isEnabled,
        payload: { ...payload, limit: payload?.limit, offset: payload?.offset },
        queryKey: ['p2p_order_list', payload],
    });

    // Additional p2p_order_list data
    const modifiedData = useMemo(() => {
        if (!data) return undefined;

        return data.map(advert => ({
            ...advert,
            /** Details of the advert for this order. */
            advert_details: {
                ...advert?.advert_details,
                /** Indicates if this is block trade advert or not. */
                is_block_trade: Boolean(advert?.advert_details?.block_trade),
            },
            /** Details of the advertiser for this order. */
            advertiser_details: {
                ...advert?.advertiser_details,
                /** Indicates that the advertiser has not been recommended yet. */
                has_not_been_recommended: advert?.advertiser_details?.is_recommended === null,
                /** Indicates if the advertiser is currently online. */
                is_online: Boolean(advert?.advertiser_details?.is_online),
                /** Indicates that the advertiser was recommended in the most recent review by the current user. */
                is_recommended: Boolean(advert?.advertiser_details?.is_recommended),
            },
            /** Details of the client who created the order. */
            client_details: {
                ...advert?.client_details,
                /** Indicates that the advertiser has not been recommended yet. */
                has_not_been_recommended: advert?.client_details?.is_recommended === null,
                /** Indicates if the advertiser is currently online. */
                is_online: Boolean(advert?.client_details?.is_online),
                /** Indicates that the advertiser was recommended in the most recent review by the current user. */
                is_recommended: Boolean(advert?.client_details?.is_recommended),
            },
            is_incoming: Boolean(advert?.is_incoming),
            /** Indicates if a review can be given. */
            is_reviewable: Boolean(advert?.is_reviewable),
            /** Indicates if the latest order changes have been seen by the current client. */
            is_seen: Boolean(advert?.is_seen),
            /** Indicates that the seller in the process of confirming the order. */
            is_verification_pending: Boolean(advert?.verification_pending),
            /** Details of the review you gave for this order, if any. */
            review_details: {
                ...advert?.review_details,
                /** Indicates that the advertiser has not been recommended yet. */
                has_not_been_recommended: advert?.review_details?.recommended === null,
                /** Indicates if the advertiser is recommended. */
                is_recommended: Boolean(advert?.review_details?.recommended),
            },
        }));
    }, [data]);

    return {
        /** The 'p2p_order_list' response. */
        data: modifiedData,
        ...rest,
    };
};

export default useOrderList;
