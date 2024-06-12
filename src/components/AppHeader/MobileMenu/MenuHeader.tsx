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
        <div className='flex items-center justify-between w-full pr-[16px] pl-[4px]'>
            <Text className='text-[16px]' weight='bold'>
                {localize('Menu')}
            </Text>

            {!hideLanguageSetting && (
                <button className='flex items-center' onClick={openLanguageSetting}>
                    {countryIcon}
                    <Text className='ml-[4px] text-[12px]' weight='bold'>
                        {currentLang}
                    </Text>
                </button>
            )}
        </div>
    );
};
