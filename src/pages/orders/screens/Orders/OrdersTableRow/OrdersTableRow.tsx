import { MouseEvent } from 'react';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import { DeepPartial, THooks } from 'types';
import { StarRating } from '@/components';
import { RatingModal } from '@/components/Modals';
import { ORDERS_STATUS, ORDERS_URL } from '@/constants';
import { api } from '@/hooks';
import { useExtendedOrderDetails, useModalManager, useQueryString } from '@/hooks/custom-hooks';
import { ExtendedOrderDetails } from '@/hooks/custom-hooks/useExtendedOrderDetails';
import { OrderRatingButton, OrderStatusTag, OrderTimer } from '@/pages/orders/components';
import { getDistanceToServerTime, isOrderSeen } from '@/utils';
import { LegacyLiveChatOutlineIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { Button, Text, useDevice } from '@deriv-com/ui';
import './OrdersTableRow.scss';

const OrdersTableRow = ({ ...props }: DeepPartial<THooks.Order.GetList[number]>) => {
    const { localize } = useTranslations();
    const { isDesktop } = useDevice();
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
    const { hideModal, isModalOpenFor, showModal } = useModalManager({ shouldReinitializeModals: false });

    const distance = getDistanceToServerTime(orderDetails.orderExpiryMilliseconds, serverTime?.server_time_moment);

    const {
        account_currency: accountCurrency,
        amount_display: amountDisplay,
        client_details: clientDetails,
        id,
        isCompletedOrder,
        isOrderReviewable,
        local_currency: localCurrency,
        price_display: priceDisplay,
        purchaseTime,
        review_details: reviewDetails,
        shouldHighlightAlert,
        shouldHighlightDanger,
        shouldHighlightDisabled,
        shouldHighlightSuccess,
        statusString,
    } = orderDetails;
    const isBuyOrderForUser = orderDetails.isBuyOrderForUser;
    const transactionAmount = `${Number(priceDisplay).toFixed(2)} ${localCurrency}`;
    const offerAmount = `${amountDisplay} ${accountCurrency}`;
    const showOrderDetails = () => {
        if (!isModalOpenFor('RatingModal'))
            history.push(`${ORDERS_URL}/${id}`, { from: isPast ? 'PastOrders' : 'Orders' });
    };

    const onClickRatingButton = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        showModal('RatingModal');
    };

    if (!isDesktop) {
        return (
            <div
                className={clsx('orders-table-row', {
                    'orders-table-row--unseen': !!activeAccount?.loginid && !isOrderSeen(id, activeAccount.loginid),
                })}
                onClick={showOrderDetails}
            >
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
                        <div className='orders-table-row__timer-wrapper'>
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
                                <LegacyLiveChatOutlineIcon iconSize='xs' />
                            </Button>
                        </div>
                    )}
                    {isCompletedOrder && !reviewDetails?.rating && (
                        <OrderRatingButton isDisabled={!isOrderReviewable} onClick={onClickRatingButton} />
                    )}
                    {reviewDetails?.rating && <StarRating isReadonly ratingValue={reviewDetails?.rating} />}
                </div>
                <div className='flex gap-1'>
                    <Text size='xl' weight='bold'>
                        {`${isBuyOrderForUser ? localize('Buy') : localize('Sell')} ${offerAmount}`}
                    </Text>
                </div>
                <Text color='less-prominent' size='sm'>
                    {purchaseTime}
                </Text>
                {!!isModalOpenFor('RatingModal') && (
                    <RatingModal
                        isBuyOrder={isBuyOrderForUser}
                        isModalOpen
                        isRecommended={clientDetails.is_recommended}
                        isRecommendedPreviously={!clientDetails.has_not_been_recommended}
                        onRequestClose={hideModal}
                        orderId={id}
                    />
                )}
            </div>
        );
    }

    return (
        <div
            className={clsx('orders-table-row', {
                'orders-table-row--inactive': isPast,
                'orders-table-row--unseen': !!activeAccount?.loginid && !isOrderSeen(id, activeAccount.loginid),
            })}
            onClick={showOrderDetails}
        >
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
            {isCompletedOrder && !reviewDetails?.rating && (
                <OrderRatingButton isDisabled={!isOrderReviewable} onClick={onClickRatingButton} />
            )}
            {reviewDetails?.rating && (
                <StarRating className='ml-8' isReadonly ratingValue={reviewDetails?.rating} starsScale={0.8} />
            )}
            {!!isModalOpenFor('RatingModal') && (
                <RatingModal
                    isBuyOrder={isBuyOrderForUser}
                    isModalOpen
                    isRecommended={clientDetails.is_recommended}
                    isRecommendedPreviously={!clientDetails.has_not_been_recommended}
                    onRequestClose={hideModal}
                    orderId={id}
                />
            )}
        </div>
    );
};

export default OrdersTableRow;
