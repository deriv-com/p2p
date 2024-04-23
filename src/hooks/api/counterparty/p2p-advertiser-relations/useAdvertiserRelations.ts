import { useP2pAdvertiserRelations } from '@deriv-com/api-hooks';
import useInvalidateQuery from '../../useInvalidateQuery';

/** This hook returns favourite and blocked advertisers and the mutation function to update the block list of the current user. */
const useAdvertiserRelations = () => {
    const invalidate = useInvalidateQuery();
    const { data, mutate, ...mutate_rest } = useP2pAdvertiserRelations({
        onSuccess: () => {
            invalidate('p2p_advertiser_relations');
            invalidate('p2p_advertiser_list');
        },
    });

    const advertiser_relations = data;

    return {
        /** P2P advertiser relations information. */
        data: advertiser_relations,
        /** Blocked advertisers by the current user. */
        blocked_advertisers: advertiser_relations?.blocked_advertisers,
        /** Favourite advertisers of the current user. */
        favourite_advertisers: advertiser_relations?.favourite_advertisers,

        /** The mutation function to update (add/remove) the currrent user's block list.  */
        mutate,
        /** The mutation related information. */
        mutation: mutate_rest,
    };
};

export default useAdvertiserRelations;
