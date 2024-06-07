import { LegacyWhatsappIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { TooltipMenuIcon } from '@deriv-com/ui';
import { URLConstants } from '@deriv-com/utils';

const WhatsApp = () => {
    const { localize } = useTranslations();

    return (
        <TooltipMenuIcon
            as='a'
            className='app-footer__icon'
            href={URLConstants.whatsApp}
            target='_blank'
            tooltipContent={localize('WhatsApp')}
        >
            <LegacyWhatsappIcon iconSize='xs' />
        </TooltipMenuIcon>
    );
};

export default WhatsApp;
