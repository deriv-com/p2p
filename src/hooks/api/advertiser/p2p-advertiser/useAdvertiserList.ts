import { useMemo } from 'react';
import { useP2pAdvertiserList } from '@deriv-com/api-hooks';

type THookPayload = NonNullable<Parameters<typeof useP2pAdvertiserList>[number]>['payload'];

/**
 * This custom hook returns
 *  the available advertisers who have had or currently have trades with the current advertiser.
 */
const useAdvertiserList = (payload?: THookPayload) => {
    if (!payload?.is_blocked) {
        delete payload?.is_blocked;
    }
    if (!payload?.advertiser_name) {
        delete payload?.advertiser_name;
    }
    const { data, ...rest } = useP2pAdvertiserList({
        payload,
        queryKey: ['p2p_advertiser_list', payload],
        refetchOnWindowFocus: false,
    });

    // Add additional information to the 'p2p_advertiser_list' data
    const modifiedData = useMemo(() => {
        if (!data?.length) return undefined;

        return data.map(advertiser => ({
            ...advertiser,
            /** The approval status of the advertiser. */
            is_approved: Boolean(advertiser?.is_approved),
            /** Indicating whether the advertiser's identity has been verified. */
            is_basic_verified: Boolean(advertiser?.basic_verification),
            /** Indicates that the advertiser is blocked. */
            is_blocked: Boolean(advertiser?.is_blocked),
            /** Indicates that the advertiser is a favourite. */
            is_favourite: Boolean(advertiser?.is_favourite),
            /** Indicating whether the advertiser's address has been verified. */
            is_fully_verified: Boolean(advertiser?.full_verification),
            /** Indicates if the advertiser's active adverts are listed. When false, adverts won't be listed regardless if they are active or not. */
            is_listed: Boolean(advertiser?.is_listed),
            /** Indicates if the advertiser is currently online. */
            is_online: Boolean(advertiser?.is_online),
            /** Indicates that the advertiser was recommended in the most recent review by the current user. */
            is_recommended: Boolean(advertiser?.is_recommended),
        }));
    }, [data]);

    return {
        /** P2P advertiser list */
        data: modifiedData,
        ...rest,
    };
};

export default useAdvertiserList;
