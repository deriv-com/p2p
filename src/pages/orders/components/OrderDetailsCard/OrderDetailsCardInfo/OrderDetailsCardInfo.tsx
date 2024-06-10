import { useOrderDetails } from '@/providers/OrderDetailsProvider';
import { Text, useDevice } from '@deriv-com/ui';
import { ActiveOrderInfo } from './ActiveOrderInfo';

const OrderDetailsCardInfo = () => {
    const { orderDetails } = useOrderDetails();
    const {
        displayPaymentAmount,
        labels,
        otherUserDetails,
        p2p_order_info: p2pOrderInfo,
        purchaseTime,
        rateAmount,
    } = orderDetails;
    const { isMobile } = useDevice();

    const clientDetails = [
        { text: labels.counterpartyNicknameLabel, value: otherUserDetails.name },
        {
            text: labels.counterpartyRealNameLabel,
            value: `${otherUserDetails.first_name} ${otherUserDetails.last_name}`,
        },
        { text: labels.leftSendOrReceive, value: `${displayPaymentAmount} ${p2pOrderInfo?.local_currency}` },
        {
            text: labels.rightSendOrReceive,
            value: `${p2pOrderInfo?.amount_display} ${p2pOrderInfo?.account_currency}`,
        },
        {
            text: `Rate (1 ${p2pOrderInfo?.account_currency})`,
            value: `${rateAmount} ${p2pOrderInfo?.local_currency}`,
        },
        { text: 'Time', value: purchaseTime },
    ];

    return (
        <div className='flex flex-col'>
            <div className='grid grid-cols-2 grid-rows-3 gap-y-6 p-[1.6rem]'>
                {clientDetails.map(detail => (
                    <div className='flex flex-col' key={detail.text}>
                        <Text color='less-prominent' size={isMobile ? 'sm' : 'xs'} weight='500'>
                            {detail.text}
                        </Text>
                        <Text size={isMobile ? 'md' : 'sm'}>{detail.value}</Text>
                    </div>
                ))}
            </div>
            <ActiveOrderInfo />
        </div>
    );
};

export default OrderDetailsCardInfo;
