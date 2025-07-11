import { Chat } from '@/utils';
import { LegacyLiveChatOutlineIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { Tooltip } from '@deriv-com/ui';

const Livechat = () => {
    const { localize } = useTranslations();

    const showChat = () => {
        Chat.open();
    };

    return (
        <Tooltip as='button' className='app-footer__icon' onClick={showChat} tooltipContent={localize('Live chat')}>
            <LegacyLiveChatOutlineIcon iconSize='xs' />
        </Tooltip>
    );
};

export default Livechat;
