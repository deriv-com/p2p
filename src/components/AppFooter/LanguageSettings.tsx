import { useMemo } from 'react';
import { LANGUAGES } from '@/constants';
import { useTranslations } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';
import { TooltipMenuIcon } from '../TooltipMenuIcon';

type TLanguageSettings = {
    openLanguageSettingModal: () => void;
};

const LanguageSettings = ({ openLanguageSettingModal }: TLanguageSettings) => {
    const { currentLang, localize } = useTranslations();

    const countryIcon = useMemo(
        () => LANGUAGES.find(({ code }) => code == currentLang)?.placeholderIcon,
        [currentLang]
    );

    return (
        <TooltipMenuIcon
            as='button'
            className='app-footer__language'
            onClick={openLanguageSettingModal}
            tooltipContent={localize('Language')}
        >
            {countryIcon}
            <Text size='xs' weight='bold'>
                {currentLang}
            </Text>
        </TooltipMenuIcon>
    );
};

export default LanguageSettings;
