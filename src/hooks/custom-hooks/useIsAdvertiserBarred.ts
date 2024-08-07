import { useEffect, useState } from 'react';
import useInvalidateQuery from '../api/useInvalidateQuery';
import { api } from '..';

/**
 * Custom hook to check if the current user is temporarily barred from using P2P.
 * @returns {boolean} isAdvertiserBarred - True if the current user is temporarily barred from using P2P, false otherwise.
 */
const useIsAdvertiserBarred = (): boolean => {
    const { data = {} } = api.advertiser.useGetInfo();
    const [isAdvertiserBarred, setIsAdvertiserBarred] = useState(false);
    const invalidate = useInvalidateQuery();

    useEffect(() => {
        if (isAdvertiserBarred !== !!data.blocked_until) {
            invalidate('p2p_advertiser_adverts');
            setIsAdvertiserBarred(!!data.blocked_until);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAdvertiserBarred, data.blocked_until]);

    return isAdvertiserBarred;
};

export default useIsAdvertiserBarred;
