import { Fragment, SyntheticEvent, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { TActiveChannel, TChatMessages, TTextColors } from 'types';
import { CHAT_FILE_TYPE, CHAT_MESSAGE_TYPE } from '@/constants';
import { convertToMB, formatMilliseconds } from '@/utils';
import { Localize } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';
import { ReactComponent as PDFIcon } from '../../../../public/ic-pdf.svg';
import { ChatMessageReceipt } from '../ChatMessageReceipt';
import { ChatMessageText } from '../ChatMessageText';
import './ChatMessages.scss';

type TChatMessagesProps = {
    chatChannel: TActiveChannel;
    chatMessages: TChatMessages;
    userId?: string;
};

const AdminMessage = () => (
    <div className='chat-messages__item chat-messages__item__admin'>
        <ChatMessageText color='general' type='admin'>
            <Localize i18n_default_text='Hello! This is where you can chat with the counterparty to confirm the order details.<br /> Note: In case of a dispute, we’ll use this chat as a reference.' />
        </ChatMessageText>
    </div>
);

const ChatMessages = ({ chatChannel, chatMessages = [], userId = '' }: TChatMessagesProps) => {
    const { isDesktop } = useDevice();
    let currentDate = '';
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatMessages.length > 0 && scrollRef.current) {
            // Scroll all the way to the bottom of the container.
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chatMessages.length]);

    const getMessageFormat = (chatMessage: TChatMessages[number], messageColor: TTextColors) => {
        const { fileType = '', name, size = 0, url } = chatMessage ?? {};
        switch (fileType) {
            case CHAT_FILE_TYPE.IMAGE:
                return (
                    <a
                        className='chat-messages__item__image'
                        data-testid='dt_chat_messages_item_image'
                        href={url}
                        rel='noopener noreferrer'
                        target='_blank'
                    >
                        <img alt={name} onLoad={onImageLoad} src={url} />
                    </a>
                );
            case CHAT_FILE_TYPE.PDF:
                return (
                    <ChatMessageText color={messageColor}>
                        <div className='chat-messages__item__pdf'>
                            <PDFIcon />
                            <a href={url} rel='noopener noreferrer' target='_blank'>
                                {name}
                            </a>
                        </div>
                        {`${convertToMB(size).toFixed(2)}MB`}
                    </ChatMessageText>
                );

            default:
                return (
                    <ChatMessageText color={messageColor}>
                        <a className='chat-messages__item__file' href={url} rel='noopener noreferrer' target='_blank'>
                            {name}
                        </a>
                    </ChatMessageText>
                );
        }
    };

    const onImageLoad = (event: SyntheticEvent<HTMLImageElement, Event>) => {
        // Height of element changes after the image is loaded. Accommodate
        // this extra height in the scroll.
        if (scrollRef.current) {
            scrollRef.current.scrollTop += event.currentTarget.parentElement
                ? event.currentTarget.parentElement.clientHeight
                : 0;
        }
    };

    return (
        <div className='chat-messages' ref={scrollRef}>
            <AdminMessage />
            {chatMessages.map(chatMessage => {
                const isMyMessage = chatMessage.senderUserId === userId;
                const messageDate = formatMilliseconds(chatMessage.createdAt, 'MMMM D, YYYY');
                const messageColor = isMyMessage ? 'white' : 'general';
                const shouldRenderDate = currentDate !== messageDate && !!(currentDate = messageDate);
                const { customType, message, messageType } = chatMessage;

                return (
                    <Fragment key={chatMessage.id}>
                        {shouldRenderDate && (
                            <div className='chat-messages__date'>
                                <Text
                                    align='center'
                                    color='less-prominent'
                                    size={isDesktop ? 'sm' : 'md'}
                                    weight='bold'
                                >
                                    {messageDate}
                                </Text>
                            </div>
                        )}
                        <div
                            className={clsx(
                                'chat-messages__item',
                                `chat-messages__item__${isMyMessage ? 'outgoing' : 'incoming'}`
                            )}
                            data-testid={`dt_chat_messages_item_${isMyMessage ? 'outgoing' : 'incoming'}`}
                        >
                            {messageType === CHAT_MESSAGE_TYPE.USER && (
                                <ChatMessageText color={messageColor} type={customType}>
                                    {message}
                                </ChatMessageText>
                            )}
                            {messageType === CHAT_MESSAGE_TYPE.FILE && getMessageFormat(chatMessage, messageColor)}
                            <div
                                className='chat-messages__item__timestamp'
                                data-testid='dt_chat_messages_item_timestamp'
                            >
                                <Text color='less-prominent' size={isDesktop ? '2xs' : 'xs'}>
                                    {formatMilliseconds(chatMessage.createdAt, 'HH:mm', true)}
                                </Text>
                                {isMyMessage && (
                                    <ChatMessageReceipt
                                        chatChannel={chatChannel as NonNullable<TActiveChannel>}
                                        message={chatMessage}
                                        userId={userId}
                                    />
                                )}
                            </div>
                        </div>
                    </Fragment>
                );
            })}
        </div>
    );
};

export default ChatMessages;
