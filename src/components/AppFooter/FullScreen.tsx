import { useFullScreen } from '@/hooks';
import { LegacyFullscreen1pxIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { TooltipMenuIcon } from '../TooltipMenuIcon';

const FullScreen = () => {
    const { toggleFullScreenMode } = useFullScreen();
    const { localize } = useTranslations();

    return (
        <TooltipMenuIcon
            as='button'
            className='app-footer__icon'
            onClick={toggleFullScreenMode}
            tooltipContent={localize('Full screen')}
        >
            <LegacyFullscreen1pxIcon iconSize='xs' />
        </TooltipMenuIcon>
    );
};

export default FullScreen;
