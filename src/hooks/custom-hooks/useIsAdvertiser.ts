import { useEffect, useState } from 'react';
import { ERROR_CODES } from '@/constants';
import { isEmptyObject } from '@/utils';
import { api } from '..';

/**
 * Custom hook to check if the current user is an advertiser.
 * @returns {boolean} isAdvertiser - True if the current user is an advertiser, false otherwise.
 */
const useIsAdvertiser = (): boolean => {
    const { data, error } = api.advertiser.useGetInfo();
    const [isAdvertiser, setIsAdvertiser] = useState(!error && !isEmptyObject(data));

    useEffect(() => {
        if (error && error?.code === ERROR_CODES.ADVERTISER_NOT_FOUND) {
            setIsAdvertiser(false);
        } else if (!error && !isEmptyObject(data)) {
            setIsAdvertiser(true);
        }
    }, [data, error]);

    return isAdvertiser;
};

export default useIsAdvertiser;
