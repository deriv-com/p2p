import clsx from 'clsx';
import { TActiveChannel, TChatMessages } from 'types';
import { FullPageMobileWrapper, LightDivider } from '@/components';
import { useExtendedOrderDetails } from '@/hooks/custom-hooks';
import { Loader, useDevice } from '@deriv-com/ui';
import { ChatError, ChatFooter, ChatHeader, ChatMessages } from '../../components';
import './OrdersChatSection.scss';

type TOrdersChatSectionProps = {
    activeChatChannel: TActiveChannel;
    isChatLoading: boolean;
    isError: boolean;
    isInactive: boolean;
    messages: TChatMessages;
    onReturn?: () => void;
    otherUserDetails: ReturnType<typeof useExtendedOrderDetails>['data']['otherUserDetails'];
    refreshChat: () => void;
    sendFile: (file: File) => void;
    sendMessage: (message: string) => void;
    userId: string;
};

const OrdersChatSection = ({ isInactive, onReturn, otherUserDetails, ...sendBirdData }: TOrdersChatSectionProps) => {
    const { activeChatChannel, isChatLoading, isError, messages, refreshChat, sendFile, sendMessage, userId } =
        sendBirdData;
    const { isDesktop } = useDevice();
    const { is_online: isOnline, last_online_time: lastOnlineTime, name } = otherUserDetails ?? {};
    const isChannelClosed = isInactive || !!activeChatChannel?.isFrozen;

    if (isError) {
        return (
            <div className='orders-chat-section'>
                <ChatError onClickRetry={refreshChat} />
            </div>
        );
    }

    if (!isDesktop) {
        return (
            <FullPageMobileWrapper
                className={clsx('orders-chat-section__full-page', {
                    'orders-chat-section__full-page--closed': isChannelClosed,
                })}
                //TODO: handle goback based on route
                onBack={onReturn}
                renderFooter={() => (
                    <ChatFooter isClosed={isChannelClosed} sendFile={sendFile} sendMessage={sendMessage} />
                )}
                renderHeader={() => <ChatHeader isOnline={isOnline} lastOnlineTime={lastOnlineTime} nickname={name} />}
            >
                {isChatLoading || !activeChatChannel ? (
                    <Loader isFullScreen={false} />
                ) : (
                    <ChatMessages chatChannel={activeChatChannel} chatMessages={messages} userId={userId} />
                )}
            </FullPageMobileWrapper>
        );
    }
    return (
        <div className='orders-chat-section'>
            {isChatLoading || !activeChatChannel ? (
                <Loader isFullScreen={false} />
            ) : (
                <>
                    <ChatHeader isOnline={isOnline} lastOnlineTime={lastOnlineTime} nickname={name} />
                    <LightDivider className='w-full' />
                    <ChatMessages chatChannel={activeChatChannel} chatMessages={messages} userId={userId} />
                    <LightDivider className='w-full' />
                    <ChatFooter isClosed={isChannelClosed} sendFile={sendFile} sendMessage={sendMessage} />
                </>
            )}
        </div>
    );
};

export default OrdersChatSection;
