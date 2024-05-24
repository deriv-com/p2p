import { LegacyHelpCentreIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { TooltipMenuIcon } from '@deriv-com/ui';

const HelpCentre = () => {
    const { localize } = useTranslations();

    return (
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
};

export default HelpCentre;
