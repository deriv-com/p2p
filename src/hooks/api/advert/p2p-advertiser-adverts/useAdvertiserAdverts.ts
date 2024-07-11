import { useMemo } from 'react';
import { useP2PAdvertiserAdverts } from '@deriv-com/api-hooks';

/** This custom hook returns a list of adverts under the current active client. */
const useAdvertiserAdverts = (
    payload?: NonNullable<Parameters<typeof useP2PAdvertiserAdverts>[0]>['payload'],
    isEnabled = true
) => {
    const { data, loadMoreAdverts, ...rest } = useP2PAdvertiserAdverts({
        enabled: isEnabled,
        payload: { ...payload, limit: payload?.limit, offset: payload?.offset },
    });

    const modifiedData = useMemo(() => {
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
            /** Indicates if this is block trade advert or not. */
            block_trade: Boolean(advert?.block_trade),
            /** The advert creation time in epoch. */
            created_time: advert?.created_time ? new Date(advert.created_time) : undefined,
            /** Determine if the rate is floating or fixed */
            is_active: Boolean(advert?.is_active),
            /** Indicates that this advert will appear on the main advert list. */
            is_floating: advert?.rate_type === 'float',
            /** The activation status of the advert. */
            is_visible: Boolean(advert?.is_visible),
        }));
    }, [data]);

    return {
        /** The 'p2p_advertiser_adverts' response. */
        data: modifiedData,
        /** Function to fetch the next batch of adverts */
        loadMoreAdverts,
        ...rest,
    };
};

export default useAdvertiserAdverts;
