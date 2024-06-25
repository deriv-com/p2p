import { LegacyLiveChatOutlineIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { TooltipMenuIcon } from '../TooltipMenuIcon';

const Livechat = () => {
    const { localize } = useTranslations();
    // TODO add the logic of this
    // TODO add the test cases for this after adding the logics

    return (
        <TooltipMenuIcon as='button' className='app-footer__icon' tooltipContent={localize('Live chat')}>
            <LegacyLiveChatOutlineIcon iconSize='xs' />
        </TooltipMenuIcon>
    );
};

export default Livechat;
