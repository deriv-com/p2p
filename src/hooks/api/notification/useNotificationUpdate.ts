import { useMutation } from '@deriv-com/api-hooks';

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
    const { data, ...rest } = useMutation({
        name: 'notifications_update_status',
    });

    return {
        data: data?.notifications_update_status,
        ...rest,
    };
};

export default useNotificationUpdate;
