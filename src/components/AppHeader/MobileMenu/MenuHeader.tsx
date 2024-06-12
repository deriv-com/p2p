import { ComponentProps, useMemo } from 'react';
import { LANGUAGES } from '@/constants';
import { useTranslations } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';

type TMenuHeader = {
    hideLanguageSetting: boolean;
    openLanguageSetting: ComponentProps<'button'>['onClick'];
};

export const MenuHeader = ({ hideLanguageSetting, openLanguageSetting }: TMenuHeader) => {
    const { currentLang, localize } = useTranslations();

    const countryIcon = useMemo(
        () => LANGUAGES.find(({ code }) => code === currentLang)?.placeholderIconInMobile,
        [currentLang]
    );

    return (
        <div className='flex items-center justify-between w-full pr-[1.6rem] pl-[0.4rem]'>
            <Text className='text-[1.6rem]' weight='bold'>
                {localize('Menu')}
            </Text>

            {!hideLanguageSetting && (
                <button className='flex items-center' onClick={openLanguageSetting}>
                    {countryIcon}
                    <Text className='ml-[0.4rem] text-[1.2rem]' weight='bold'>
                        {currentLang}
                    </Text>
                </button>
            )}
        </div>
    );
};
