import { useEffect, useMemo, useState } from 'react';
import { useSubscribe } from '@deriv-com/api-hooks';

type TNotificationLinks = {
    href: string;
    rel: string;
};
type TNotification = {
    category: string;
    id: number;
    links: TNotificationLinks[];
    message_key: string;
    payload: string;
    read: boolean;
    removed: boolean;
};

const handleData = (incomingMessages: TNotification[], prevMessages: TNotification[]) => {
    if (!incomingMessages) return prevMessages;

    let notifications = prevMessages;
    for (let updateIdx = 0; updateIdx < incomingMessages.length; updateIdx++) {
        const update = incomingMessages[updateIdx];

        const existingMessageIndex = notifications.findIndex((message: TNotification) => message.id === update.id);
        const existingMessage = notifications[existingMessageIndex];

        if (existingMessage) {
            if (update.removed)
                notifications = notifications.filter((message: TNotification) => message.id !== update.id);
            else notifications[existingMessageIndex] = { ...existingMessage, ...update };
        } else notifications.unshift(update);
    }

    notifications.sort((a: TNotification, b: TNotification) => b.id - a.id);

    return [...notifications];
};

/**
 * Hook that returns the list of notifications.
 *
 * @example const { data: notifications } = useNotificationList();
 */
const useNotificationList = () => {
    // @ts-expect-error Type undefined. This endpoint will be added to api-hooks.
    const { data, ...rest } = useSubscribe('notifications_list');
    const [messages, setMessages] = useState<TNotification[]>([]);

    const modified_data = useMemo(() => {
        if (!messages) return undefined;

        // TODO: Remove this filter once all the notifications are implemented
        const notifications = messages.filter((notification: { message_key: string }) =>
            ['p2p-limit-upgrade-available', 'p2p-order-completed'].includes(notification.message_key)
        );

        return notifications;
    }, [messages]);

    useEffect(() => {
        // @ts-expect-error Type undefined.
        if (data?.notifications_list) {
            setMessages(prevMessages => {
                // @ts-expect-error Type undefined.
                return handleData(data.notifications_list.messages, prevMessages);
            });
        }
    }, [data]);

    return {
        data: modified_data || [],
        ...rest,
    };
};

export default useNotificationList;
