import { useState } from 'react';
import { TooltipMenuIcon } from '@/components/TooltipMenuIcon';
import { LegacyNotificationIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { Notifications as UINotifications, useDevice } from '@deriv-com/ui';

export const Notifications = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { localize } = useTranslations();
    const { isMobile } = useDevice();
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
            </TooltipMenuIcon>
            <UINotifications
                className={isMobile ? '' : 'notifications__wrapper absolute top-20 right-80 z-10'}
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
