import { useEffect, useState } from 'react';
import { api } from '..';

/**
 * Custom hook to check if the current user is temporarily barred from using P2P.
 * @returns {boolean} isAdvertiserBarred - True if the current user is temporarily barred from using P2P, false otherwise.
 */
const useIsAdvertiserBarred = (): boolean => {
    const { data } = api.advertiser.useGetInfo();
    const [isAdvertiserBarred, setIsAdvertiserBarred] = useState(false);

    useEffect(() => {
        if (data.blocked_until) {
            setIsAdvertiserBarred(true);
        }
    }, [data]);

    return isAdvertiserBarred;
};

export default useIsAdvertiserBarred;
