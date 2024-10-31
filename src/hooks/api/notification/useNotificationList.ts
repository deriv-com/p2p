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

const useNotificationList = () => {
    const [messages, setMessages] = useState<TNotification[]>([]);

    useEffect(() => {
        // Fetch data from the API endpoint
        const fetchNotifications = async () => {

            try {
                const response = await fetch('https://fs191x.buildship.run/v4/notification/list', {
                    headers: {
                        'Content-Type': 'application/json',
                        'token': localStorage.getItem('authToken'),

                    },
                    method: 'GET',
                });

                if (response.ok) {
                    const data = await response.json();
                    setMessages(data); // This is where the notifications are set directly
                } else {
                    //@ts-expext-error
                    console.error('Failed to fetch notifications:', response.statusText);
                }
            } catch (error) {
                //@ts-expext-error
                console.error('Error while fetching notifications:', error);
            }
        };

        fetchNotifications();
    }, []);

    return {
        data: messages || [],
    };
};

export default useNotificationList;