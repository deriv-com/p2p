import { useFullScreen } from '@/hooks';
import { LegacyFullscreen1pxIcon } from '@deriv/quill-icons';
import { localize } from '@deriv-com/translations';
import { TooltipMenuIcon } from '@deriv-com/ui';

const FullScreen = () => {
    const { toggleFullScreenMode } = useFullScreen();

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
