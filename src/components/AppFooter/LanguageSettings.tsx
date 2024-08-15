import { useMemo } from 'react';
import { LANGUAGES } from '@/constants';
import { useTranslations } from '@deriv-com/translations';
import { Text, Tooltip } from '@deriv-com/ui';

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
        <Tooltip
            as='button'
            className='app-footer__language'
            onClick={openLanguageSettingModal}
            tooltipContent={localize('Language')}
        >
            {countryIcon}
            <Text size='xs' weight='bold'>
                {currentLang}
            </Text>
        </Tooltip>
    );
};

export default LanguageSettings;
