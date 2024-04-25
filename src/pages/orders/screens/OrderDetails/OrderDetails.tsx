import { useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { FullPageMobileWrapper, PageReturn } from '@/components';
import { api } from '@/hooks';
import { useExtendedOrderDetails } from '@/hooks/custom-hooks';
import { ExtendedOrderDetails } from '@/hooks/custom-hooks/useExtendedOrderDetails';
import { OrderDetailsProvider } from '@/providers/OrderDetailsProvider';
import { useAuthData } from '@deriv-com/api-hooks';
import { Button, InlineMessage, Loader, Text, useDevice } from '@deriv-com/ui';
import ChatIcon from '../../../../public/ic-chat.svg?react';
import { OrderDetailsCard } from '../../components/OrderDetailsCard';
import { OrderDetailsCardFooter } from '../../components/OrderDetailsCard/OrderDetailsCardFooter';
import { OrdersChatSection } from '../OrdersChatSection';
import './OrderDetails.scss';

const OrderDetails = () => {
    const history = useHistory();
    const location = useLocation();
    const showChatParam = new URLSearchParams(location.search).get('showChat');
    const [showChat, setShowChat] = useState(!!showChatParam);

    const { orderId } = useParams<{ orderId: string }>();
    const { isAuthorized: isSuccess } = useAuthData();
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

    const headerText = `${isBuyOrderForUser ? 'Buy' : 'Sell'} USD order`;
    const warningMessage = 'Don’t risk your funds with cash transactions. Use bank transfers or e-wallets instead.';

    const onReturn = () => history.goBack();
    const onChatReturn = () => {
        setShowChat(false);
        if (showChatParam) onReturn();
    };

    useEffect(() => {
        if (isSuccess) {
            subscribe({
                id: orderId,
            });
        }

        return () => {
            unsubscribe();
        };
    }, [isSuccess, orderId]);

    if (isLoading || (!orderInfo && !error)) return <Loader isFullScreen />;

    // TODO: replace with proper error screen once design is ready
    if (error) return <Text>{error?.message}</Text>;

    if (isMobile) {
        return (
            <OrderDetailsProvider value={{ isErrorOrderInfo: !!error, orderDetails }}>
                {showChat ? (
                    <OrdersChatSection
                        id={orderId}
                        isInactive={!!orderDetails?.isInactiveOrder}
                        onReturn={onChatReturn}
                        otherUserDetails={orderDetails?.otherUserDetails}
                    />
                ) : (
                    <FullPageMobileWrapper
                        className='order-details'
                        onBack={onReturn}
                        renderFooter={() => <OrderDetailsCardFooter />}
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
                                    <ChatIcon className='mt-2' />
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
                        <OrderDetailsCard />
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
                        <OrderDetailsCard />
                        <OrdersChatSection
                            id={orderId}
                            isInactive={!!orderDetails?.isInactiveOrder}
                            otherUserDetails={orderDetails?.otherUserDetails}
                        />
                    </div>
                </div>
            </div>
        </OrderDetailsProvider>
    );
};

export default OrderDetails;
