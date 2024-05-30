import { useState } from 'react';
import { LegacyNotificationIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { Notifications as UINotifications, TooltipMenuIcon, useDevice } from '@deriv-com/ui';

export const Notifications = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { localize } = useTranslations();
    const { isDesktop } = useDevice();
    return (
        <>
            <TooltipMenuIcon
                as='button'
                className={isDesktop ? 'mr-4 pl-2 border-l-[1px] h-[32px]' : ''}
                disableHover
                onClick={() => setIsOpen(!isOpen)}
                tooltipContainerClassName='z-20'
                tooltipContent={localize('View notifications')}
                tooltipPosition='bottom'
            >
                <LegacyNotificationIcon fill='red' iconSize='sm' />
            </TooltipMenuIcon>
            <UINotifications
                className={isDesktop ? 'notifications__wrapper absolute top-20 right-80 z-10' : ''}
                clearNotificationsCallback={() => {}}
                componentConfig={{
                    clearButtonText: localize('Clear all'),
                    modalTitle: localize('Notifications'),
                    noNotificationsMessage: localize('No notifications MESSAGE'),
                    noNotificationsTitle: localize('No notifications'),
                }}
                isOpen={isOpen}
                notifications={[]}
                setIsOpen={setIsOpen}
            />
        </>
    );
};
