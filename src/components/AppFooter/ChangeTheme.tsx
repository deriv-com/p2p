import { LegacySettings1pxIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { TooltipMenuIcon } from '@deriv-com/ui';

const ChangeTheme = () => {
    const { localize } = useTranslations();

    return (
        // TODO need to add theme logic
        // TODO update the component's tests after adding the logic
        <TooltipMenuIcon as='button' className='app-footer__icon' tooltipContent={localize('Change theme')}>
            <LegacySettings1pxIcon iconSize='xs' />
        </TooltipMenuIcon>
    );
};

export default ChangeTheme;
