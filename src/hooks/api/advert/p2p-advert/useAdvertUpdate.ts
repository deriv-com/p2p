import { useCallback, useMemo } from 'react';
import { useP2pAdvertUpdate } from '@deriv-com/api-hooks';
import useInvalidateQuery from '../../useInvalidateQuery';

type TPayload = Parameters<ReturnType<typeof useP2pAdvertUpdate>['mutate']>[number];

/** A custom hook that updates a P2P advert. This can only be used by an approved P2P advertiser.
 * 
 * To update an advert, specify the payload arguments that should be updated, for instance:
 * @example
 *  mutate({
        "id": 1234, // required
        "is_active": 0 // optional
    });
 * 
*/
const useAdvertUpdate = () => {
    const invalidate = useInvalidateQuery();
    const {
        data,
        mutate: _mutate,
        ...rest
    } = useP2pAdvertUpdate({
        onSuccess: () => {
            invalidate('p2p_advert_list');
            invalidate('p2p_advertiser_adverts');
        },
    });

    const mutate = useCallback((payload: TPayload) => _mutate(payload), [_mutate]);

    const memoizedData = useMemo(() => {
        if (!data) return undefined;

        return {
            ...data,
        };
    }, [data]);

    return {
        data: memoizedData,
        mutate,
        ...rest,
    };
};

export default useAdvertUpdate;
