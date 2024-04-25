import { useMemo } from 'react';
import { useP2pAdvertiserList } from '@deriv-com/api-hooks';

type THookPayload = Parameters<typeof useP2pAdvertiserList>[number];

//TODO: fix the types when updated from api-hooks
type ExtendedPayload = THookPayload & {
    is_blocked?: boolean;
    advertiser_name?: string;
};
/**
 * This custom hook returns the available advertisers who have had or currently have trades with the current advertiser.
 */
const useAdvertiserList = (payload?: ExtendedPayload) => {
    if (!payload?.is_blocked) {
        delete payload?.is_blocked;
    }
    if (!payload?.advertiser_name) {
        delete payload?.advertiser_name;
    }
    const { data, ...rest } = useP2pAdvertiserList({ ...payload, refetchOnWindowFocus: false });

    // Add additional information to the 'p2p_advertiser_list' data
    const modified_data = useMemo(() => {
        if (!data?.length) return undefined;

        return data.map(advertiser => ({
            ...advertiser,
            /** Indicating whether the advertiser's identity has been verified. */
            is_basic_verified: Boolean(advertiser?.basic_verification),
            /** Indicating whether the advertiser's address has been verified. */
            is_fully_verified: Boolean(advertiser?.full_verification),
            /** The approval status of the advertiser. */
            is_approved: Boolean(advertiser?.is_approved),
            /** Indicates that the advertiser is blocked. */
            is_blocked: Boolean(advertiser?.is_blocked),
            /** Indicates that the advertiser is a favourite. */
            is_favourite: Boolean(advertiser?.is_favourite),
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
        data: modified_data,
        ...rest,
    };
};

export default useAdvertiserList;
