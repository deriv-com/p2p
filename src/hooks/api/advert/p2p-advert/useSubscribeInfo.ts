import { useMemo } from 'react';
import { useSubscribe } from '@deriv-com/api-hooks';

/**
 * A custom hook that subscribes to the `p2p_advert_info` endpoint.
 *
 * @example const { data, subscribe } = useSubscribeInfo();
 */
const useSubscribeInfo = () => {
    const { data, ...rest } = useSubscribe('p2p_advert_info');

    const modifiedData = useMemo(() => {
        const p2pAdvertInfo = data?.p2p_advert_info;

        if (!p2pAdvertInfo) return undefined;

        return p2pAdvertInfo;
    }, [data]);

    return {
        data: modifiedData,
        ...rest,
    };
};

export default useSubscribeInfo;
