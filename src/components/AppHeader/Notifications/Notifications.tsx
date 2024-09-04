import { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { TooltipMenuIcon } from '@/components/TooltipMenuIcon';
import { getNotification, MY_PROFILE_URL } from '@/constants';
import { api } from '@/hooks';
import { LegacyAnnouncementIcon, LegacyNotificationIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { Badge, Notifications as UINotifications, Text, useDevice } from '@deriv-com/ui';

const Notifications = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { localize } = useTranslations();
    const { isDesktop, isMobile } = useDevice();
    const { data: activeAccountData } = api.account.useActiveAccount();
    const { data: notifications, subscribe, unsubscribe } = api.notification.useGetList();
    const { mutate: updateNotification } = api.notification.useUpdate();
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
                message: <Text size={isMobile ? 'sm' : 'xs'}>{message}</Text>,
                title,
            };
        });
    }, [notifications]);

    useEffect(() => {
        if (activeAccountData) {
            subscribe({});
        }

        return () => {
            unsubscribe();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeAccountData]);

    return (
        <>
            <TooltipMenuIcon
                as='button'
                className={isMobile ? '' : 'mr-4 pl-2 border-l-[1px] h-[32px]'}
                disableHover
                onClick={() => setIsOpen(!isOpen)}
                tooltipContent={localize('View notifications')}
                tooltipPosition='bottom'
            >
                <LegacyNotificationIcon iconSize='sm' />
                {notifications?.length > 0 && (
                    <Badge
                        badgeSize='xs'
                        className={isDesktop ? 'absolute top-[1rem] ml-[1rem]' : 'absolute top-[0.8rem] ml-[1rem]'}
                        color='danger'
                        isBold
                        textSize={isDesktop ? '2xs' : 'xs'}
                    >
                        {notifications?.length}
                    </Badge>
                )}
            </TooltipMenuIcon>
            <UINotifications
                className={isMobile ? '' : 'absolute top-20 right-80 z-10 w-[26.4rem]'}
                clearNotificationsCallback={() => {
                    updateNotification({ ids: [], notifications_update_status: 'remove' });
                }}
                componentConfig={{
                    clearButtonText: localize('Clear all'),
                    modalTitle: localize('Notifications'),
                    noNotificationsMessage: localize('You have yet to receive any notifications'),
                    noNotificationsTitle: localize('No notifications'),
                }}
                isOpen={isOpen}
                notifications={modifiedNotifications || []}
                setIsOpen={setIsOpen}
            />
        </>
    );
};

export default Notifications;
