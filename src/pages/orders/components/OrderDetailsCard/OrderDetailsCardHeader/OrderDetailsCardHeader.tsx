import { api } from '@/hooks';
import { useOrderDetails } from '@/providers/OrderDetailsProvider';
import { getDistanceToServerTime } from '@/utils';
import { Localize } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';
import { OrderTimer } from '../../OrderTimer';

const OrderDetailsCardHeader = () => {
    const { orderDetails } = useOrderDetails();

    const {
        displayPaymentAmount,
        hasTimerExpired,
        isBuyerConfirmedOrder,
        isPendingOrder,
        orderExpiryMilliseconds,
        p2p_order_info: p2pOrderInfo,
        shouldHighlightAlert,
        shouldHighlightDanger,
        shouldHighlightSuccess,
        shouldShowOrderTimer,
        statusString,
    } = orderDetails;

    const { isMobile } = useDevice();
    const textSize = isMobile ? 'sm' : 'xs';
    const { data: serverTime } = api.account.useServerTime();
    const distance = getDistanceToServerTime(orderExpiryMilliseconds, serverTime?.server_time_moment);
    const getStatusColor = () => {
        if (shouldHighlightAlert) return 'warning';
        else if (shouldHighlightDanger) return 'error';
        else if (shouldHighlightSuccess) return 'success';
        return 'less-prominent';
    };

    return (
        <div className='flex justify-between p-[1.6rem]'>
            <div className='flex flex-col gap-1'>
                <Text color={getStatusColor()} size={isMobile ? 'lg' : 'md'} weight='bold'>
                    {statusString}
                </Text>
                {!hasTimerExpired && (isPendingOrder || isBuyerConfirmedOrder) && (
                    <Text size={isMobile ? '2xl' : 'xl'}>
                        {displayPaymentAmount} {p2pOrderInfo?.local_currency}
                    </Text>
                )}
                <Text color='less-prominent' size={textSize}>
                    <Localize i18n_default_text='Order ID {{id}}' values={{ id: p2pOrderInfo?.id }} />
                </Text>
            </div>
            {shouldShowOrderTimer && (
                <div className='flex flex-col justify-center gap-1'>
                    <Text align='center' size={textSize}>
                        <Localize i18n_default_text='Time left' />
                    </Text>
                    <OrderTimer distance={distance} />
                </div>
            )}
        </div>
    );
};

export default OrderDetailsCardHeader;
