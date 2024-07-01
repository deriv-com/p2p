import { useCallback, useMemo } from 'react';
import { useP2PAdvertiserCreate } from '@deriv-com/api-hooks';
import useInvalidateQuery from '../../useInvalidateQuery';

type TCreateAdvertiserPayload = Parameters<ReturnType<typeof useP2PAdvertiserCreate>['mutate']>[0];

/** A custom hook that creates a P2P advertiser. This can only be used when the user is authorized.
 *
 * To create an advertiser, specify the following payload arguments in the `mutate` call:
 * @example
 *  mutate({
        name: 'John Doe',
    });
 *
*/
const useAdvertiserCreate = () => {
    const invalidate = useInvalidateQuery();
    const {
        data,
        mutate: _mutate,
        ...rest
    } = useP2PAdvertiserCreate({
        onSuccess: () => {
            invalidate('p2p_advertiser_info');
        },
    });

    const mutate = useCallback(
        (payload: TCreateAdvertiserPayload) => {
            _mutate(payload);
        },
        [_mutate]
    );

    const modifiedData = useMemo(() => {
        const advertiser = data;

        if (!advertiser) return undefined;

        const { basic_verification, full_verification, is_approved, is_listed, is_online, show_name } = advertiser;

        return {
            ...data,
            /** Indicating whether the advertiser's identify has been verified. */
            has_basic_verification: Boolean(basic_verification),
            /** Indicating whether the advertiser's address has been verified. */
            has_full_verification: Boolean(full_verification),
            /** The approval status of the advertiser. */
            is_approved: Boolean(is_approved),
            /** Indicates if the advertiser's active adverts are listed. When false, adverts won't be listed regardless if they are active or not. */
            is_listed: Boolean(is_listed),
            /** Indicates if the advertiser is currently online. */
            is_online: Boolean(is_online),
            /** When true, the advertiser's real name will be displayed on to other users on adverts and orders. */
            should_show_name: Boolean(show_name),
        };
    }, [data]);

    return {
        data: modifiedData,
        mutate,
        ...rest,
    };
};

export default useAdvertiserCreate;
