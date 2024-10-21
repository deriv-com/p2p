import { useCallback } from 'react';

/**
 * Hook that updates the status of a notification. The notification can be removed or marked as read or unread.
 *
 * @example
 * const { data, mutate } = useNotificationUpdate();
 * mutate({ notifications_update_status: 'read', ids: [notification_id]});
 * mutate({ notifications_update_status: 'unread', ids: [notification_id]});
 * mutate({ notifications_update_status: 'remove', ids: []});
 */
const useNotificationUpdate = () => {
    const readAllNotifications = useCallback(async() => {
        
        return fetch('https://fs191x.buildship.run/v4/notification/read', {
            body: JSON.stringify({
                authorize: localStorage.getItem('authToken'),
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
        });
    }, []);

    return {
        readAllNotifications,
    };
};

export default useNotificationUpdate;
