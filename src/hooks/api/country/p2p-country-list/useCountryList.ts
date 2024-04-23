/**
 * A custom hook that returns an object containing the list of countries available for P2P trading.
 *
 * For returning details of a specific country, the country code can be passed in the payload.
 * @example: useCountryList({ country: 'id' })
 *
 */

import { useP2PCountryList } from '@deriv-com/api-hooks';

const useCountryList = () => {
    const { data, ...rest } = useP2PCountryList({
        options: { refetchOnWindowFocus: false },
    });

    return {
        data: data?.p2p_country_list,
        ...rest,
    };
};

export default useCountryList;
