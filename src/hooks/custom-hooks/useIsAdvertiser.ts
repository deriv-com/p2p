import { useMemo } from 'react';
import { ERROR_CODES } from '@/constants';
import { isEmptyObject } from '@/utils';
import { api } from '..';

/**
 * Custom hook to check if the current user is an advertiser.
 * @returns {boolean} isAdvertiser - True if the current user is an advertiser, false otherwise.
 */
const useIsAdvertiser = (): boolean => {
    const { data, error } = api.advertiser.useGetInfo();

    const isAdvertiser = useMemo(() => {
        if (error && error?.code === ERROR_CODES.ADVERTISER_NOT_FOUND) {
            return false;
        } else if (!error && !isEmptyObject(data)) {
            return true;
        }

        return false;
    }, [data, error]);

    return isAdvertiser;
};

export default useIsAdvertiser;
