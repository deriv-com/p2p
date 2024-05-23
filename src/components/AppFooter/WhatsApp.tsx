import { LegacyWhatsappIcon } from '@deriv/quill-icons';
import { localize } from '@deriv-com/translations';
import { TooltipMenuIcon } from '@deriv-com/ui';

const WhatsApp = () => (
    <TooltipMenuIcon
        as='a'
        className='app-footer__icon'
        href='https://api.whatsapp.com/send/?phone=35699578341&text&type=phone_number&app_absent=0'
        target='_blank'
        tooltipContent={localize('WhatsApp')}
    >
        <LegacyWhatsappIcon iconSize='xs' />
    </TooltipMenuIcon>
);

export default WhatsApp;
