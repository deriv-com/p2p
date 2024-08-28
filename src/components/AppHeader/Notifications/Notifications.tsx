import { useState, useMemo } from 'react';
import { TooltipMenuIcon } from '@/components/TooltipMenuIcon';
import { LegacyNotificationIcon, LegacyAnnouncementIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { Notifications as UINotifications, useDevice } from '@deriv-com/ui';

import './Notifications.scss';

import { useNotifications }  from '@/hooks/api/notifications/notifications';
import { Badge } from '@deriv-com/ui';

import { getTitle, getMessage, getActionText } from './translations';

const MAX_UNREAD_COUNT = 9;

const Notifications = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { localize } = useTranslations();
    const { isMobile } = useDevice();

    const { messages, unreadCount, removeAll, loadMore } = useNotifications();

    const modifiedMessages = useMemo(() => {
        return messages && messages.map((message: any) => {
            const msg : { 
                icon: JSX.Element, 
                title: string, 
                message: string, 
                buttonAction: (() => void) | null, actionText: string | null 
            } = {
                icon: <LegacyAnnouncementIcon width='16' height='16' />,
                title: getTitle(localize, message.message_key, message.payload),
                message: getMessage(localize, message.message_key, message.payload),
                buttonAction: null,
                actionText: null,
            };

            // TODO: really, any message can have a button, not just 'act', so make it universal
            // but for the sake of demo, let it be, 
            if (message.category === 'act') {
                msg.buttonAction = () => {}; // TODO: to be defined from payload
                msg.actionText = getActionText(localize, message.message_key, message.payload);
            }

            return msg;
        });
    }, [messages, localize]);

    return (
        <>
            <TooltipMenuIcon
                as='button'
                className={isMobile ? '' : 'notifications__icon mr-4 pl-2 border-l-[1px] h-[32px]'}
                disableHover
                onClick={() => setIsOpen(!isOpen)}
                tooltipContent={localize('View notifications')}
                tooltipPosition='bottom'
            >
                <LegacyNotificationIcon fill='red' iconSize='sm' />
                {(unreadCount > 0) && (
                    <Badge
                        textSize='sm'
                        badgeSize='xs'
                        color='danger'
                        rounded='lg'
                        className="notifications__badge"
                    >
                        {unreadCount >= MAX_UNREAD_COUNT ? `${MAX_UNREAD_COUNT}+` : unreadCount}
                    </Badge>
                )}
            
            </TooltipMenuIcon>
            <UINotifications
                className={isMobile ? '' : 'absolute top-20 right-80 z-10'}
                clearNotificationsCallback={removeAll}
                componentConfig={{
                    clearButtonText: localize('Clear all'),
                    modalTitle: localize('Notifications'),
                    noNotificationsMessage: localize('No notifications MESSAGE'),
                    noNotificationsTitle: localize('No notifications'),
                }}
                isOpen={isOpen}
                loadMoreFunction={() => {
                    loadMore();
                }}
                /* @ts-ignore */
                notifications={modifiedMessages || []}
                setIsOpen={() => {
                    setIsOpen(false)
                }}
            />
        </>
    );
};

export default Notifications;
