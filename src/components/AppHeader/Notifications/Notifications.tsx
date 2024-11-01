import { useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getNotification, MY_PROFILE_URL } from '@/constants';
import { api } from '@/hooks';
import { LegacyAnnouncementIcon, LegacyNotificationIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { Badge, Notifications as UINotifications, Text, Tooltip, useDevice } from '@deriv-com/ui';

const Notifications = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { localize } = useTranslations();
    const { isDesktop, isMobile } = useDevice();
    const { data: notifications } = api.notification.useGetList();
    const { readAllNotifications } = api.notification.useUpdate();
    const history = useHistory();

    const modifiedNotifications = useMemo(() => {
        return notifications?.map((notification: { message_key: string; payload: string }) => {
            const { actionText, message, title } = getNotification(
                localize,
                notification.message_key,
                notification.payload
            );

            return {
                actionText,
                buttonAction: () => {
                    if (notification.message_key === 'p2p-limit-upgrade-available') history.push(MY_PROFILE_URL);

                    setIsOpen(false);
                },
                icon: <LegacyAnnouncementIcon height='16' width='16' />,
                id: notification.message_key,
                message: <Text size={isDesktop ? 'xs' : 'sm'}>{message}</Text>,
                title,
            };
        });
    }, [notifications]);

    return (
        <>
            <Tooltip
                as='button'
                className={isMobile ? '' : 'mr-4 pl-2 border-l-[1px] h-[32px]'}
                hideTooltip={!isDesktop}
                onClick={() => setIsOpen(prev => !prev)}
                tooltipContent={localize('View notifications')}
                tooltipPosition='bottom'
            >
                <LegacyNotificationIcon iconSize='sm' />
                {notifications?.length > 0 && (
                    <Badge
                        badgeSize='xs'
                        className={
                            isDesktop
                                ? 'absolute top-[1rem] ml-[1rem] text-white'
                                : 'absolute top-[0.8rem] ml-[1rem] text-white'
                        }
                        color='danger'
                        isBold
                        textSize={isDesktop ? '2xs' : 'xs'}
                    >
                        {notifications?.length}
                    </Badge>
                )}
            </Tooltip>
            <UINotifications
                className={isMobile ? '' : 'absolute top-20 right-80 z-10 w-[26.4rem]'}
                clearNotificationsCallback={() => {
                    readAllNotifications();
                }}
                componentConfig={{
                    clearButtonText: localize('Clear all'),
                    modalTitle: localize('Notifications'),
                    noNotificationsMessage: localize('You have yet to receive any notifications'),
                    noNotificationsTitle: localize('No notifications'),
                }}
                isLoading={false}
                isOpen={isOpen}
                notifications={modifiedNotifications || []}
                setIsOpen={setIsOpen}
            />
        </>
    );
};

export default Notifications;
