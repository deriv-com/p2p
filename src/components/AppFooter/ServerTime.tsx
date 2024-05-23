import { localize } from '@deriv-com/translations';
import { Text, TooltipMenuIcon } from '@deriv-com/ui';

export const ServerTime = () => {
    return (
        <TooltipMenuIcon
            as='div'
            className='app-footer__icon'
            disableHover
            tooltipContent={localize('01 Jan 2021 00:00:00 GMT')}
        >
            <Text size='xs'>01 Jan 2021 00:00:00 GMT</Text>
        </TooltipMenuIcon>
    );
};
