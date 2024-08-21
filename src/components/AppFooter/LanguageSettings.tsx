import { useMemo } from 'react';
import { LANGUAGES } from '@/constants';
import { useTranslations } from '@deriv-com/translations';
import { Text, Tooltip } from '@deriv-com/ui';
import { LocalStorageUtils } from '@deriv-com/utils';

type TLanguageSettings = {
    openLanguageSettingModal: () => void;
};

const LanguageSettings = ({ openLanguageSettingModal }: TLanguageSettings) => {
    const { localize } = useTranslations();
    const currentLang = LocalStorageUtils.getValue<string>('i18n_language') || 'EN';

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
