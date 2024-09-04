import { useMemo } from 'react';
import { useSubscribe } from '@deriv-com/api-hooks';

/**
 * Hook that returns the list of notifications.
 *
 * @example const { data: notifications } = useNotificationList();
 */
const useNotificationList = () => {
    // @ts-expect-error Type undefined. This endpoint will be added to api-hooks.
    const { data, ...rest } = useSubscribe('notifications_list');

    const modified_data = useMemo(() => {
        // @ts-expect-error Type undefined.
        if (!data?.notifications_list.messages) return undefined;

        // TODO: Remove this filter once all the notifications are implemented
        // @ts-expect-error Type undefined.
        const notifications = data?.notifications_list.messages.filter((notification: { message_key: string }) =>
            ['p2p-limit-upgrade-available'].includes(notification.message_key)
        );

        return notifications;
    }, [data]);

    return {
        data: modified_data || [],
        ...rest,
    };
};

export default useNotificationList;
