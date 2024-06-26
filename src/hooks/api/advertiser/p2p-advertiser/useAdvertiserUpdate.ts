import { useCallback, useMemo } from 'react';
import { useP2pAdvertiserUpdate } from '@deriv-com/api-hooks';
import useInvalidateQuery from '../../useInvalidateQuery';

type TPayload = Parameters<ReturnType<typeof useP2pAdvertiserUpdate>['mutate']>[number];

/** A custom hook that updates the information of the P2P advertiser for the current account. Can only be used by an approved P2P advertiser
 *
 * To update an advertiser, specify the payload arguments that should be updated, for instance:
 * @example
 *  mutate({
        "is_listed": 0 // optional
        "upgrade_limits": 1  // optional
    });
 *
*/
const useAdvertiserUpdate = () => {
    const invalidate = useInvalidateQuery();
    const {
        data,
        mutate: _mutate,
        ...rest
    } = useP2pAdvertiserUpdate({
        onSuccess: () => {
            invalidate('p2p_advertiser_info');
        },
    });

    const mutate = useCallback((payload: TPayload) => _mutate(payload), [_mutate]);

    const modifiedData = useMemo(() => {
        const p2pAdvertiserUpdate = data;
        if (!p2pAdvertiserUpdate) return undefined;

        const { basic_verification, full_verification, is_approved, is_listed, is_online, show_name } =
            p2pAdvertiserUpdate;

        return {
            ...p2pAdvertiserUpdate,
            /** The approval status of the advertiser. */
            is_approved: Boolean(is_approved),
            /** Indicating whether the advertiser's identity has been verified. */
            is_basic_verified: Boolean(basic_verification),
            /** Indicating whether the advertiser's address has been verified. */
            is_fully_verified: Boolean(full_verification),
            /** Indicates if the advertiser's active adverts are listed. When false, adverts won't be listed regardless if they are active or not. */
            is_listed: Boolean(is_listed),
            /** Indicates if the advertiser is currently online. */
            is_online: Boolean(is_online),
            /** When true, the advertiser's real name will be displayed on to other users on adverts and orders. */
            should_show_name: Boolean(show_name),
        };
    }, [data]);

    return {
        /** Returns latest information of the advertiser from p2p_advertiser endpoint */
        data: modifiedData,
        /** Sends a request to update the information of the P2P advertiser for the current account. Can only be used by an approved P2P advertiser. */
        mutate,
        ...rest,
    };
};

export default useAdvertiserUpdate;
