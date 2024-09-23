import { useCallback } from 'react';
import useAdvertiserRelations from './useAdvertiserRelations';

/** This hook blocks advertisers of the current user by passing the advertiser id. */
const useAdvertiserRelationsAddBlocked = () => {
    const { data, mutate, ...rest } = useAdvertiserRelations();

    const addBlockedAdvertiser = useCallback(
        (id: number[], shouldUnfollow = false) => {
            if (shouldUnfollow) mutate({ add_blocked: id, remove_favourites: id });
            else mutate({ add_blocked: id });
        },
        [mutate]
    );

    return {
        data,
        /** Sends a request to block advertiser of the current user by passing the advertiser id. */
        mutate: addBlockedAdvertiser,
        ...rest,
    };
};

export default useAdvertiserRelationsAddBlocked;
