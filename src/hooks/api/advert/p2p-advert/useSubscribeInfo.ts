import { useMemo } from 'react';
import { useSubscribe } from '@deriv-com/api-hooks';

const useSubscribeInfo = () => {
    const { data, ...rest } = useSubscribe('p2p_advert_info');

    // useEffect(() => {
    //     if (advertId) subscribe({ id: advertId });
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [advertId]);

    const modifiedData = useMemo(() => {
        const p2pAdvertInfo = data?.p2p_advert_info;

        if (!p2pAdvertInfo) return undefined;

        return {
            ...p2pAdvertInfo,
            is_active: Boolean(p2pAdvertInfo.is_active),
            is_block_trade: Boolean(p2pAdvertInfo.block_trade),
            /** Determines whether the advert is a buy advert or not. */
            is_buy: p2pAdvertInfo.type === 'buy',
            is_deleted: Boolean(p2pAdvertInfo.deleted),
            /** Determines whether the advert is a sell advert or not. */
            is_sell: p2pAdvertInfo.type === 'sell',
            is_visible: Boolean(p2pAdvertInfo.is_visible),
            /**
             * @deprecated This property was deprecated on back-end
             * @see https://api.deriv.com/api-explorer#p2p_advert_info
             * **/
            payment_method: p2pAdvertInfo.payment_method,
        };
    }, [data]);

    return {
        data: modifiedData,
        ...rest,
    };
};

export default useSubscribeInfo;
