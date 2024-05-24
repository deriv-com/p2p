import { LANGUAGES } from '@/constants';
import { useTranslations } from '@deriv-com/translations';
import { Text, TooltipMenuIcon } from '@deriv-com/ui';
import './AppFooter.scss';

type TLanguageSettings = {
    openLanguageSettingModal: () => void;
};

const LanguageSettings = ({ openLanguageSettingModal }: TLanguageSettings) => {
    const { currentLang, localize } = useTranslations();

    const countryIcon = LANGUAGES.find(({ code }) => code == currentLang)?.icon;

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
