import { useState, useEffect, useMemo } from 'react';
import { TooltipMenuIcon } from '@/components/TooltipMenuIcon';
import { LegacyNotificationIcon, LegacyAnnouncementIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { Notifications as UINotifications, useDevice } from '@deriv-com/ui';
import { TLocalize } from 'types';

import { useNotifications }  from '@/hooks/api/notifications/notifications';

const getTitle = (localize: TLocalize, message_key: string, payload?: any) => {
    switch (message_key) {
        case 'p2p-order-complete':
            return localize('Your order got completed!', payload);
        case 'p2p-limit-upgrade-available':
            return localize('Your daily limits got automatically updated!', payload);
            // return localize('Click here to increase your daily limits!', payload);
        case 'p2p-limit-upgraded':
            return localize('Your daily limits got automatically updated!', payload);
        default:
            return localize('Unknown notification, ' + message_key, payload);
    }
};

const getMessage = (localize: TLocalize, message_key: string, payload?: any) => {
    switch (message_key) {
        case 'p2p-order-complete':
            return localize('Your order got completed!', payload);
        case 'p2p-limit-upgrade-available':
            return localize('Your daily limits got automatically updated!', payload);
            // return localize('Click here to increase your daily limits!', payload);
        case 'p2p-limit-upgraded':
            return localize('Your daily limits got automatically updated!', payload);
        default:
            return localize('Unknown notification, ' + message_key, payload);
    }
}

const getActionText = (localize: TLocalize, message_key: string, payload?: any) => {
    switch (message_key) {
        case 'p2p-order-complete':
            return localize('Your order got completed!', payload);
        case 'p2p-limit-upgrade-available':
            return localize('Your daily limits got automatically updated!', payload);
            // return localize('Click here to increase your daily limits!', payload);
        case 'p2p-limit-upgraded':
            return localize('Your daily limits got automatically updated!', payload);
        default:
            return localize('Unknown notification, ' + message_key, payload);
    }
}

const Notifications = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { localize } = useTranslations();
    const { isMobile } = useDevice();

    const { messages, unreadCount } = useNotifications();

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
                className={isMobile ? '' : 'mr-4 pl-2 border-l-[1px] h-[32px]'}
                disableHover
                onClick={() => setIsOpen(!isOpen)}
                tooltipContent={localize('View notifications')}
                tooltipPosition='bottom'
            >
                <LegacyNotificationIcon fill='red' iconSize='sm' />
                <span className='notification-badge'>{unreadCount}</span>
            </TooltipMenuIcon>
            <UINotifications
                className={isMobile ? '' : 'absolute top-20 right-80 z-10'}
                clearNotificationsCallback={() => {}}
                componentConfig={{
                    clearButtonText: localize('Clear all'),
                    modalTitle: localize('Notifications'),
                    noNotificationsMessage: localize('No notifications MESSAGE'),
                    noNotificationsTitle: localize('No notifications'),
                }}
                isOpen={isOpen}
                loadMoreFunction={() => {
                    console.log('load more');
                }}
                /* @ts-ignore */
                notifications={modifiedMessages || []}
                setIsOpen={() => {
                    // setIsOpen(false)
                }}
            />
        </>
    );
};

export default Notifications;
