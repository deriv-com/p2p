import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import { DeepPartial, THooks } from 'types';
import { ORDERS_STATUS, ORDERS_URL } from '@/constants';
import { api } from '@/hooks';
import { useExtendedOrderDetails, useQueryString } from '@/hooks/custom-hooks';
import { ExtendedOrderDetails } from '@/hooks/custom-hooks/useExtendedOrderDetails';
import { OrderRatingButton, OrderStatusTag, OrderTimer } from '@/pages/orders/components';
import { getDistanceToServerTime } from '@/utils';
import { Button, Text, useDevice } from '@deriv-com/ui';
import ChatIcon from '../../../../../public/ic-chat.svg?react';
import './OrdersTableRow.scss';

const OrdersTableRow = ({ ...props }: DeepPartial<THooks.Order.GetList[number]>) => {
    const { isMobile } = useDevice();
    const { queryString } = useQueryString();
    const history = useHistory();
    const isPast = queryString.tab === ORDERS_STATUS.PAST_ORDERS;
    const { data: activeAccount } = api.account.useActiveAccount();
    const { data: serverTime } = api.account.useServerTime();
    const { data: orderDetails } = useExtendedOrderDetails({
        loginId: activeAccount?.loginid,
        orderDetails: props as ExtendedOrderDetails,
        serverTime,
    });

    const distance = getDistanceToServerTime(orderDetails.orderExpiryMilliseconds, serverTime?.server_time_moment);

    const {
        account_currency: accountCurrency,
        amount_display: amountDisplay,
        id,
        isCompletedOrder,
        local_currency: localCurrency,
        price_display: priceDisplay,
        purchaseTime,
        shouldHighlightAlert,
        shouldHighlightDanger,
        shouldHighlightDisabled,
        shouldHighlightSuccess,
        statusString,
    } = orderDetails;
    const isBuyOrderForUser = orderDetails.isBuyOrderForUser;
    const transactionAmount = `${Number(priceDisplay).toFixed(2)} ${localCurrency}`;
    const offerAmount = `${amountDisplay} ${accountCurrency}`;
    const showOrderDetails = () => history.push(`${ORDERS_URL}/${id}`);

    if (isMobile) {
        return (
            <div className='flex flex-col' onClick={showOrderDetails}>
                <div className='flex justify-between'>
                    <Text size='sm' weight='bold'>
                        <OrderStatusTag
                            shouldHighlightAlert={shouldHighlightAlert}
                            shouldHighlightDanger={shouldHighlightDanger}
                            shouldHighlightDisabled={shouldHighlightDisabled}
                            shouldHighlightSuccess={shouldHighlightSuccess}
                            status={statusString}
                        />
                    </Text>
                    {!isPast && (
                        <div className='flex items-center gap-5'>
                            <OrderTimer distance={distance} />
                            <Button
                                className='h-full p-0'
                                color='white'
                                data-testid='dt_orders_table_row_chat_button'
                                onClick={event => {
                                    event.stopPropagation();
                                    history.push(`${ORDERS_URL}/${id}?showChat=true`);
                                }}
                                variant='contained'
                            >
                                <ChatIcon />
                            </Button>
                        </div>
                    )}
                    {isCompletedOrder && <OrderRatingButton />}
                </div>
                <div className='flex gap-1'>
                    <Text size='2xl' weight='bold'>
                        {`${isBuyOrderForUser ? 'Buy' : 'Sell'} ${offerAmount}`}
                    </Text>
                </div>
                <Text color='less-prominent' size='sm'>
                    {purchaseTime}
                </Text>
            </div>
        );
    }

    return (
        <div className={clsx('orders-table-row', { 'orders-table-row--inactive': isPast })} onClick={showOrderDetails}>
            {isPast && <Text size='sm'>{purchaseTime}</Text>}
            <Text size='sm'>{isBuyOrderForUser ? 'Buy' : 'Sell'}</Text>
            <Text size='sm'>{id}</Text>
            <Text size='sm'>{orderDetails.otherUserDetails.name}</Text>
            <Text size='sm' weight='bold'>
                <OrderStatusTag
                    shouldHighlightAlert={shouldHighlightAlert}
                    shouldHighlightDanger={shouldHighlightDanger}
                    shouldHighlightDisabled={shouldHighlightDisabled}
                    shouldHighlightSuccess={shouldHighlightSuccess}
                    status={statusString}
                />
            </Text>
            <Text size='sm'>{isBuyOrderForUser ? transactionAmount : offerAmount}</Text>
            <Text size='sm'>{isBuyOrderForUser ? offerAmount : transactionAmount}</Text>
            {!isPast && <OrderTimer distance={distance} />}
            {isCompletedOrder && <OrderRatingButton />}
        </div>
    );
};

export default OrdersTableRow;
