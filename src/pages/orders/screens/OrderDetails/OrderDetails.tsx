import { useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { FullPageMobileWrapper, PageReturn } from '@/components';
import { BUY_SELL_URL, ORDERS_URL } from '@/constants';
import { api } from '@/hooks';
import { useExtendedOrderDetails, useSendbird } from '@/hooks/custom-hooks';
import { ExtendedOrderDetails } from '@/hooks/custom-hooks/useExtendedOrderDetails';
import { OrderDetailsProvider } from '@/providers/OrderDetailsProvider';
import { LegacyLiveChatOutlineIcon } from '@deriv/quill-icons';
import { Button, InlineMessage, Loader, Text, useDevice } from '@deriv-com/ui';
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
    const { isMobile } = useDevice();
    const { sendFile, userId, ...rest } = useSendbird(orderDetails?.id, !!error, orderDetails?.chat_channel_url ?? '');

    const headerText = `${isBuyOrderForUser ? 'Buy' : 'Sell'} USD order`;
    const warningMessage = 'Don’t risk your funds with cash transactions. Use bank transfers or e-wallets instead.';

    const onReturn = () => {
        if ((location.state as { from: string })?.from === 'Orders' || codeParam) history.push(ORDERS_URL);
        else if (location.state === 'PastOrders' || orderStatusParam === 'completed')
            history.push(`${ORDERS_URL}?tab=Past+orders`);
        else if ((location.state as { from: string })?.from === 'BuySell') history.push(BUY_SELL_URL);
        else history.goBack();
    };

    const onChatReturn = () => {
        setShowChat(false);
        if (showChatParam) onReturn();
    };

    useEffect(() => {
        subscribe({
            id: orderId,
        });

        return () => {
            unsubscribe();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderId]);

    if (isLoading || (!orderInfo && !error)) return <Loader isFullScreen />;

    // TODO: replace with proper error screen once design is ready
    if (error) return <Text>{error?.error?.message}</Text>;

    if (isMobile) {
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
                            <Text as='div' className='w-full flex items-center justify-between' size='lg' weight='bold'>
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
                                <Text size='xs'>{warningMessage}</Text>
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
                    <div className='grid grid-cols-none lg:grid-cols-2 lg:gap-14'>
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
