import { localize } from '@deriv-com/translations';
import { TooltipMenuIcon } from '@deriv-com/ui';

export const NetworkStatus = () => {
    return (
        <TooltipMenuIcon
            as='div'
            className='app-footer__icon'
            disableHover
            tooltipContent={localize('Network status: Online')}
        >
            <div className='app-footer__network-status' />
        </TooltipMenuIcon>
    );
};
