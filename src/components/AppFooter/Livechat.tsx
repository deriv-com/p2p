import { LegacyLiveChatOutlineIcon } from '@deriv/quill-icons';
import { localize } from '@deriv-com/translations';
import { TooltipMenuIcon } from '@deriv-com/ui';

const Livechat = () => (
    <TooltipMenuIcon as='button' className='app-footer__icon' tooltipContent={localize('Live chat')}>
        <LegacyLiveChatOutlineIcon iconSize='xs' />
    </TooltipMenuIcon>
);

export default Livechat;
