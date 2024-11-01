import { useEffect, useState } from 'react';

type TNotificationLinks = {
    href: string;
    rel: string;
};
type TNotification = {
    category: string;
    id: number;
    links?: TNotificationLinks[];
    message_key: string;
    payload: string;
    read: boolean;
    removed: boolean;
};

/**
 * Hook that returns the list of notifications.
 *
 */
const useNotificationList = () => {
    const [notifications, setNotifications] = useState<TNotification[]>([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch('https://fs191x.buildship.run/v4/notification/list', {
                    headers: {
                        'Content-Type': 'application/json',
                        token: localStorage.getItem('authToken') || '',
                    },
                    method: 'GET',
                });

                if (response.ok) {
                    const data = await response.json();

                    // TODO: Remove this filter once all the notifications are implemented
                    const messages = data.filter((notification: { message_key: string }) =>
                        ['p2p-limit-upgrade-available'].includes(notification.message_key)
                    );
                    setNotifications(messages);
                } else {
                    // eslint-disable-next-line no-console
                    console.error('Failed to fetch notifications');
                }
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error(error);
            }
        };

        fetchNotifications();
    }, []);

    return {
        data: notifications || [],
    };
};

export default useNotificationList;
