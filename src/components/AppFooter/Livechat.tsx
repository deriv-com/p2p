import { useFreshchat, useGrowthbookGetFeatureValue, useIntercom, useLiveChat } from '@/hooks/custom-hooks';
import { Chat } from '@/utils';
import { LegacyLiveChatOutlineIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { Tooltip } from '@deriv-com/ui';

const Livechat = () => {
    const { LiveChatWidget } = useLiveChat();
    const { localize } = useTranslations();
    const [isFreshChatEnabled, isGBLoaded] = useGrowthbookGetFeatureValue({
        featureFlag: 'enable_freshworks_live_chat_p2p',
    });
    const [isIntercomEnabled] = useGrowthbookGetFeatureValue({
        featureFlag: 'enable_intercom_p2p',
    });

    const token = localStorage.getItem('authToken') || null;
    const freshChat = useFreshchat(token, isFreshChatEnabled);
    const icChat = useIntercom(token, isIntercomEnabled);

    setInterval(() => {
        /*  This is for livechat last open state, 
            once livechat is not loaded when freshchat is enabled then we can remove this */
        if (isFreshChatEnabled) {
            LiveChatWidget?.call('destroy');
        }
    }, 10);

    if (!isGBLoaded || (isFreshChatEnabled && !freshChat?.isReady) || (isIntercomEnabled && !icChat?.isReady)) {
        return null;
    }

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
