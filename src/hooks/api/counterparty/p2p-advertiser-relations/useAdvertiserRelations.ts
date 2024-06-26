import { useP2PAdvertiserRelations } from '@deriv-com/api-hooks';
import useInvalidateQuery from '../../useInvalidateQuery';

/** This hook returns favourite and blocked advertisers and the mutation function to update the block list of the current user. */
const useAdvertiserRelations = () => {
    const invalidate = useInvalidateQuery();
    const { data, mutate, ...mutateRest } = useP2PAdvertiserRelations({
        onSuccess: () => {
            invalidate('p2p_advertiser_relations');
            invalidate('p2p_advertiser_list');
        },
    });

    const advertiserRelations = data;

    return {
        /** Blocked advertisers by the current user. */
        blockedAdvertisers: advertiserRelations?.blocked_advertisers,
        /** P2P advertiser relations information. */
        data: advertiserRelations,
        /** Favourite advertisers of the current user. */
        favouriteAdvertisers: advertiserRelations?.favourite_advertisers,

        /** The mutation function to update (add/remove) the currrent user's block list.  */
        mutate,
        /** The mutation related information. */
        mutation: mutateRest,
    };
};

export default useAdvertiserRelations;
