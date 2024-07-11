import { useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { TOrderIdsMap } from 'types';
import { FullPageMobileWrapper, PageReturn } from '@/components';
import { BUY_SELL_URL, ORDERS_URL } from '@/constants';
import { api } from '@/hooks';
import { useExtendedOrderDetails, useSendbird } from '@/hooks/custom-hooks';
import { ExtendedOrderDetails } from '@/hooks/custom-hooks/useExtendedOrderDetails';
import { OrderDetailsProvider } from '@/providers/OrderDetailsProvider';
import { isOrderSeen } from '@/utils';
import { LegacyLiveChatOutlineIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { Button, InlineMessage, Loader, Text, useDevice } from '@deriv-com/ui';
import { LocalStorageConstants, LocalStorageUtils } from '@deriv-com/utils';
import { OrderDetailsCard } from '../../components/OrderDetailsCard';
import { OrderDetailsCardFooter } from '../../components/OrderDetailsCard/OrderDetailsCardFooter';
import { OrdersChatSection } from '../OrdersChatSection';
import './OrderDetails.scss';

const OrderDetails = () => {
    const history = useHistory();
    const location = useLocation();
    const codeParam = new URLSearchParams(location.search).get('code');
    const orderStatusParam = new URLSearchParams(location.search).get('order_status');
    const showChatParam = new URLSearchParams(location.search).get('showChat');
    const [showChat, setShowChat] = useState(!!showChatParam);

    const { orderId } = useParams<{ orderId: string }>();
    const { data: orderInfo, error, isLoading, subscribe, unsubscribe } = api.order.useGet();
    const { data: activeAccount } = api.account.useActiveAccount();
    const { data: serverTime } = api.account.useServerTime();
    const { data: orderDetails } = useExtendedOrderDetails({
        loginId: activeAccount?.loginid,
        orderDetails: orderInfo as ExtendedOrderDetails,
        serverTime,
    });
    const { isBuyOrderForUser, shouldShowLostFundsBanner } = orderDetails;
    const { isDesktop, isMobile } = useDevice();
    const { sendFile, userId, ...rest } = useSendbird(orderDetails?.id, !!error, orderDetails?.chat_channel_url ?? '');
    const { localize } = useTranslations();
    const { data: activeAccountData } = api.account.useActiveAccount();

    const headerText = isBuyOrderForUser ? localize('Buy USD order') : localize('Sell USD order');
    const warningMessage = localize(
        'Don’t risk your funds with cash transactions. Use bank transfers or e-wallets instead.'
    );

    const onReturn = () => {
        if ((location.state as { from: string })?.from === 'Orders' || codeParam) history.push(ORDERS_URL);
        else if (orderStatusParam === 'completed') history.push(`${ORDERS_URL}?tab=Past+orders`);
        else if ((location.state as { from: string })?.from === 'BuySell') history.push(BUY_SELL_URL);
        else history.goBack();

        unsubscribe();
    };

    const onChatReturn = () => {
        setShowChat(false);
        if (showChatParam) onReturn();
    };

    useEffect(() => {
        if (activeAccountData)
            subscribe({
                id: orderId,
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeAccountData, orderId]);

    useEffect(() => {
        if (orderId && activeAccount?.loginid) {
            const loginId = activeAccount.loginid;
            if (!isOrderSeen(orderId, loginId)) {
                const orderIdsMap = LocalStorageUtils.getValue<TOrderIdsMap>(LocalStorageConstants.p2pOrderIds) || {};
                orderIdsMap[loginId] = [...(orderIdsMap[loginId] || []), orderId];
                LocalStorageUtils.setValue<TOrderIdsMap>(LocalStorageConstants.p2pOrderIds, orderIdsMap);
            }
        }
    }, [orderId, activeAccount?.loginid]);

    if (isLoading || (!orderInfo && !error)) return <Loader isFullScreen />;

    // TODO: replace with proper error screen once design is ready
    if (error) return <Text>{error?.message}</Text>;

    if (!isDesktop) {
        return (
            <OrderDetailsProvider value={{ isErrorOrderInfo: !!error, orderDetails }}>
                {showChat ? (
                    <OrdersChatSection
                        isInactive={!!orderDetails?.isInactiveOrder}
                        onReturn={onChatReturn}
                        otherUserDetails={orderDetails?.otherUserDetails}
                        sendFile={sendFile}
                        userId={userId ?? ''}
                        {...rest}
                    />
                ) : (
                    <FullPageMobileWrapper
                        className='order-details'
                        onBack={onReturn}
                        renderFooter={() => <OrderDetailsCardFooter sendFile={sendFile} />}
                        renderHeader={() => (
                            <Text
                                as='div'
                                className='w-full flex items-center justify-between'
                                size={isMobile ? 'lg' : 'md'}
                                weight='bold'
                            >
                                {headerText}
                                <Button
                                    className='h-full p-0'
                                    color='white'
                                    data-testid='dt_order_details_chat_button'
                                    onClick={() => setShowChat(true)}
                                    variant='contained'
                                >
                                    <LegacyLiveChatOutlineIcon className='mt-2' iconSize='xs' />
                                </Button>
                            </Text>
                        )}
                    >
                        {shouldShowLostFundsBanner && (
                            <InlineMessage
                                className='w-fit mx-[1.6rem] mt-[1.6rem]'
                                iconPosition='top'
                                variant='warning'
                            >
                                <Text size={isMobile ? 'xs' : '2xs'}>{warningMessage}</Text>
                            </InlineMessage>
                        )}
                        <OrderDetailsCard sendFile={sendFile} />
                    </FullPageMobileWrapper>
                )}
            </OrderDetailsProvider>
        );
    }

    return (
        <OrderDetailsProvider value={{ isErrorOrderInfo: !!error, orderDetails }}>
            <div className='w-full'>
                <PageReturn onClick={onReturn} pageTitle={headerText} weight='bold' />
                <div className='order-details'>
                    {shouldShowLostFundsBanner && (
                        <InlineMessage className='w-fit mb-6' variant='warning'>
                            <Text size='2xs'>{warningMessage}</Text>
                        </InlineMessage>
                    )}
                    <div className='grid grid-cols-none lg:grid-cols-2 lg:gap-14 h-full'>
                        <OrderDetailsCard sendFile={sendFile} />
                        <OrdersChatSection
                            isInactive={!!orderDetails?.isInactiveOrder}
                            onReturn={onChatReturn}
                            otherUserDetails={orderDetails?.otherUserDetails}
                            sendFile={sendFile}
                            userId={userId ?? ''}
                            {...rest}
                        />
                    </div>
                </div>
            </div>
        </OrderDetailsProvider>
    );
};

export default OrderDetails;
