import { useOrderDetails } from '@/providers/OrderDetailsProvider';
import { formatDataTestId } from '@/utils';
import { useTranslations } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';
import { ActiveOrderInfo } from './ActiveOrderInfo';

const OrderDetailsCardInfo = () => {
    const { orderDetails } = useOrderDetails();
    const {
        account_currency: accountCurrency,
        amount_display: amountDisplay,
        displayPaymentAmount,
        labels,
        local_currency: localCurrency,
        otherUserDetails,
        purchaseTime,
        rateAmount,
    } = orderDetails;
    const { isDesktop } = useDevice();
    const { localize } = useTranslations();

    const clientDetails = [
        { text: labels.counterpartyNicknameLabel, value: otherUserDetails.name },
        {
            text: labels.counterpartyRealNameLabel,
            value: `${otherUserDetails.first_name} ${otherUserDetails.last_name}`,
        },
        { text: labels.leftSendOrReceive, value: `${displayPaymentAmount} ${localCurrency}` },
        {
            text: labels.rightSendOrReceive,
            value: `${amountDisplay} ${accountCurrency}`,
        },
        {
            text: localize(`Rate (1 ${accountCurrency})`),
            value: `${rateAmount} ${localCurrency}`,
        },
        { text: localize('Time'), value: purchaseTime },
    ];

    return (
        <div className='flex flex-col'>
            <div className='grid grid-cols-2 grid-rows-3 gap-y-6 p-[1.6rem]'>
                {clientDetails.map(detail => (
                    <div className='flex flex-col' key={detail.text}>
                        <Text color='less-prominent' size={isDesktop ? 'xs' : 'sm'} weight='500'>
                            {detail.text}
                        </Text>
                        <Text data-testid={`dt_${formatDataTestId(detail.text)}`} size={isDesktop ? 'sm' : 'md'}>
                            {detail.value}
                        </Text>
                    </div>
                ))}
            </div>
            <ActiveOrderInfo />
        </div>
    );
};

export default OrderDetailsCardInfo;
