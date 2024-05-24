import { LegacyLiveChatOutlineIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { TooltipMenuIcon } from '@deriv-com/ui';

const Livechat = () => {
    const { localize } = useTranslations();

    return (
        <TooltipMenuIcon as='button' className='app-footer__icon' tooltipContent={localize('Live chat')}>
            <LegacyLiveChatOutlineIcon iconSize='xs' />
        </TooltipMenuIcon>
    );
};

export default Livechat;
