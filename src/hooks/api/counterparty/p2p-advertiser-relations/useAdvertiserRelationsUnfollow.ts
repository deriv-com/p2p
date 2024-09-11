import { useCallback } from 'react';
import useAdvertiserRelations from './useAdvertiserRelations';

/** This hook unfollows advertisers of the current user by passing the advertiser id. */
const useAdvertiserRelationsUnfollow = () => {
    const { data, mutate, ...rest } = useAdvertiserRelations();

    const followUser = useCallback((id: number[]) => mutate({ remove_favourites: id }), [mutate]);

    return {
        data,
        /** Sends a request to unfollow an advertiser of the current user by passing the advertiser id. */
        mutate: followUser,
        ...rest,
    };
};

export default useAdvertiserRelationsUnfollow;
