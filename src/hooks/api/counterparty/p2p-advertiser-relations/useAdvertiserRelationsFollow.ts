import { useCallback } from 'react';
import useAdvertiserRelations from './useAdvertiserRelations';

/** This hook follows advertisers of the current user by passing the advertiser id. */
const useAdvertiserRelationsFollow = () => {
    const { data, mutate, ...rest } = useAdvertiserRelations();

    const followUser = useCallback((id: number[]) => mutate({ add_favourites: id }), [mutate]);

    return {
        data,
        /** Sends a request to follow an advertiser of the current user by passing the advertiser id. */
        mutate: followUser,
        ...rest,
    };
};

export default useAdvertiserRelationsFollow;
