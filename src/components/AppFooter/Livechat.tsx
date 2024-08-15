import { useLiveChat } from '@/hooks/custom-hooks';
import { LegacyLiveChatOutlineIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { Tooltip } from '@deriv-com/ui';

const Livechat = () => {
    const { LiveChatWidget } = useLiveChat();
    const { localize } = useTranslations();

    return (
        <Tooltip
            as='button'
            className='app-footer__icon'
            onClick={() => {
                LiveChatWidget.call('maximize');
            }}
            tooltipContent={localize('Live chat')}
        >
            <LegacyLiveChatOutlineIcon iconSize='xs' />
        </Tooltip>
    );
};

export default Livechat;
