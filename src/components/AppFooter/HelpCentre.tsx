import { HELP_CENTRE } from '@/constants';
import { LegacyHelpCentreIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { TooltipMenuIcon } from '../TooltipMenuIcon';

const HelpCentre = () => {
    const { localize } = useTranslations();

    return (
        <TooltipMenuIcon
            as='a'
            className='app-footer__icon'
            href={HELP_CENTRE}
            target='_blank'
            tooltipContent={localize('Help centre')}
        >
            <LegacyHelpCentreIcon iconSize='xs' />
        </TooltipMenuIcon>
    );
};

export default HelpCentre;
