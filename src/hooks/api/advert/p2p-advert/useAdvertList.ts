import { useMemo } from 'react';
import { useP2PAdvertList } from '@deriv-com/api-hooks';

type TPayload = NonNullable<Parameters<typeof useP2PAdvertList>[0]>['payload'];
/**
 * This custom hook returns available adverts for use with 'p2p_order_create' by calling 'p2p_advert_list' endpoint
 */
const useAdvertList = (payload?: TPayload) => {
    const { data, loadMoreAdverts, ...rest } = useP2PAdvertList({
        payload: { ...payload, limit: payload?.limit, offset: payload?.offset },
        queryKey: ['p2p_advert_list', payload],
    });

    // Add additional information to the 'p2p_advert_list' data
    const modified_data = useMemo(() => {
        if (!data?.length) return undefined;

        return data.map(advert => ({
            ...advert,
            advertiser_details: {
                ...advert?.advertiser_details,
                /** Indicates that the advertiser has not been recommended yet. */
                has_not_been_recommended: advert?.advertiser_details.is_recommended === null,
                /** Indicates that the advertiser is blocked by the current user. */
                is_blocked: Boolean(advert?.advertiser_details.is_blocked),
                /** Indicates that the advertiser is a favourite. */
                is_favourite: Boolean(advert?.advertiser_details.is_favourite),
                /** Indicates if the advertiser is currently online. */
                is_online: Boolean(advert?.advertiser_details?.is_online),
                /** Indicates that the advertiser was recommended in the most recent review by the current user. */
                is_recommended: Boolean(advert?.advertiser_details?.is_recommended),
            },
            /** The activation status of the advert. */
            is_active: Boolean(advert?.is_active),
            /** Determine if the rate is floating or fixed */
            is_floating: advert?.rate_type === 'float',
            /** Indicates that this advert will appear on the main advert list. */
            is_visible: Boolean(advert?.is_visible),
        }));
    }, [data]);

    return {
        /** The 'p2p_advert_list' response. */
        data: modified_data,
        loadMoreAdverts,
        ...rest,
    };
};

export default useAdvertList;
