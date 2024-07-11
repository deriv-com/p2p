import { LegacyThemeLightIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { TooltipMenuIcon } from '../TooltipMenuIcon';

const ChangeTheme = () => {
    const { localize } = useTranslations();

    return (
        // TODO need to add theme logic
        // TODO update the component's tests after adding the logic
        <TooltipMenuIcon as='button' className='app-footer__icon' tooltipContent={localize('Change theme')}>
            <LegacyThemeLightIcon iconSize='xs' />
        </TooltipMenuIcon>
    );
};

export default ChangeTheme;
