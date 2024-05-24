import { useTranslations } from '@deriv-com/translations';
import { TooltipMenuIcon } from '@deriv-com/ui';

export const NetworkStatus = () => {
    const { localize } = useTranslations();

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
