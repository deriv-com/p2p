import { useMemo } from 'react';
import clsx from 'clsx';
import { useNetworkStatus } from '@/hooks';
import { useTranslations } from '@deriv-com/translations';
import { TooltipMenuIcon } from '@deriv-com/ui';

const statusConfigs = {
    blinking: {
        className: 'app-footer__network-status-online app-footer__network-status-blinking',
        tooltip: 'Connecting to server',
    },
    offline: { className: 'app-footer__network-status-offline', tooltip: 'Offline' },
    online: { className: 'app-footer__network-status-online', tooltip: 'Online' },
};

const NetworkStatus = () => {
    const status = useNetworkStatus();
    const { localize } = useTranslations();
    const { className, tooltip } = useMemo(() => statusConfigs[status], [status]);

    return (
        <TooltipMenuIcon
            as='div'
            className='app-footer__icon'
            disableHover
            tooltipContent={localize('Network status: {{status}}', { status: tooltip })}
        >
            <div className={clsx('app-footer__network-status', className)} />
        </TooltipMenuIcon>
    );
};

export default NetworkStatus;
