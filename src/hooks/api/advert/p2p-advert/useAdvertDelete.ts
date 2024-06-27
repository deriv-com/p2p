import { useCallback, useMemo } from 'react';
import { useP2pAdvertUpdate } from '@deriv-com/api-hooks';
import useInvalidateQuery from '../../useInvalidateQuery';

type TPayload = Parameters<ReturnType<typeof useP2pAdvertUpdate>['mutate']>[number];

/** A custom hook that deletes a P2P advert. This can only be used by an approved P2P advertiser.
 * 
 * To delete an advert, specify the advert ID to delete, for instance:
 * @example
 *  mutate({
        "id": 1234
    });
 *
 * Once this is mutated, the advert with ID of 1234 will be deleted.
*/
const useAdvertDelete = () => {
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

    const mutate = useCallback(
        (payload: TPayload) =>
            _mutate({
                ...payload,
                delete: 1,
            }),
        [_mutate]
    );

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

export default useAdvertDelete;
