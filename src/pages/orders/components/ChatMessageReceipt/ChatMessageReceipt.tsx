import { ComponentType, memo, SVGAttributes } from 'react';
import { CHAT_MESSAGE_STATUS } from '@/constants';
import { useSendbird } from '@/hooks/custom-hooks';
import { ReactComponent as MessageDeliveredIcon } from '../../../../public/ic-message-delivered.svg';
import { ReactComponent as MessageErroredIcon } from '../../../../public/ic-message-errored.svg';
import { ReactComponent as MessagePendingIcon } from '../../../../public/ic-message-pending.svg';
import { ReactComponent as MessageSeenIcon } from '../../../../public/ic-message-seen.svg';

export type TChatMessageReceiptProps = {
    chatChannel: NonNullable<ReturnType<typeof useSendbird>['activeChatChannel']>;
    message: ReturnType<typeof useSendbird>['messages'][number];
    userId: string;
};

const ChatMessageReceipt = ({ chatChannel, message, userId }: TChatMessageReceiptProps) => {
    let Icon: ComponentType<SVGAttributes<SVGElement>>;

    if (message.status === CHAT_MESSAGE_STATUS.PENDING) {
        Icon = MessagePendingIcon;
    } else if (message.status === CHAT_MESSAGE_STATUS.ERRORED) {
        Icon = MessageErroredIcon;
    } else {
        const channelUserIds = Object.keys(chatChannel.cachedUnreadMemberState);
        const otherSendbirdUserId = channelUserIds.find(id => id !== userId);
        if (
            otherSendbirdUserId &&
            chatChannel.cachedUnreadMemberState[
                otherSendbirdUserId as keyof typeof chatChannel.cachedUnreadMemberState
            ] >= message.createdAt
        ) {
            Icon = MessageSeenIcon;
        } else {
            Icon = MessageDeliveredIcon;
        }
    }

    return <Icon data-testid='dt_chat_message_receipt_icon' />;
};

export default memo(ChatMessageReceipt);
