import { useMemo } from 'react';
import { useP2PAdvertInfo } from '@deriv-com/api-hooks';
/**
 * This custom hook returns the advert information about the given advert ID.
 */
const useAdvertInfo = (
    payload: NonNullable<Parameters<typeof useP2PAdvertInfo>[0]>['payload'],
    isEnabled = true,
    refetchOnWindowFocus = true
) => {
    const { data, ...rest } = useP2PAdvertInfo({
        enabled: isEnabled,
        payload,
        refetchOnWindowFocus,
        retry: 2,
    });

    const modified_data = useMemo(() => {
        const p2p_advert_info = data;

        if (!p2p_advert_info) return undefined;

        return {
            ...p2p_advert_info,
            is_active: Boolean(p2p_advert_info.is_active),
            is_block_trade: Boolean(p2p_advert_info.block_trade),
            /** Determines whether the advert is a buy advert or not. */
            is_buy: p2p_advert_info.type === 'buy',
            is_deleted: Boolean(p2p_advert_info.deleted),
            /** Determines whether the advert is a sell advert or not. */
            is_sell: p2p_advert_info.type === 'sell',
            is_visible: Boolean(p2p_advert_info.is_visible),
            /**
             * @deprecated This property was deprecated on back-end
             * @see https://api.deriv.com/api-explorer#p2p_advert_info
             * **/
            payment_method: p2p_advert_info.payment_method,
        };
    }, [data]);

    return {
        data: modified_data,
        ...rest,
    };
};

export default useAdvertInfo;
