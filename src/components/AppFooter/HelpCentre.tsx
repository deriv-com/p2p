import { LegacyHelpCentreIcon } from '@deriv/quill-icons';
import { localize } from '@deriv-com/translations';
import { TooltipMenuIcon } from '@deriv-com/ui';

const HelpCentre = () => (
    <TooltipMenuIcon
        as='a'
        className='app-footer__icon'
        href='https://deriv.com/help-centre/'
        target='_blank'
        tooltipContent={localize('Help centre')}
    >
        <LegacyHelpCentreIcon iconSize='xs' />
    </TooltipMenuIcon>
);

export default HelpCentre;
