import { LegacyDerivIcon } from '@deriv/quill-icons';
import { localize } from '@deriv-com/translations';
import { TooltipMenuIcon } from '@deriv-com/ui';

const Deriv = () => (
    <TooltipMenuIcon
        as='a'
        className='app-footer__icon'
        href='https://deriv.com/'
        target='_blank'
        tooltipContent={localize('Go to deriv.com')}
    >
        <LegacyDerivIcon iconSize='xs' />
    </TooltipMenuIcon>
);

export default Deriv;
