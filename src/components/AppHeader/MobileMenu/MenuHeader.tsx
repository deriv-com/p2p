import { ComponentProps, useMemo } from 'react';
import { LANGUAGES } from '@/constants';
import { useTranslations } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';

type TMenuHeader = {
    hideLanguageSetting: boolean;
    openLanguageSetting: ComponentProps<'button'>['onClick'];
};

export const MenuHeader = ({ hideLanguageSetting, openLanguageSetting }: TMenuHeader) => {
    const { currentLang, localize } = useTranslations();
    const { isDesktop } = useDevice();

    const countryIcon = useMemo(
        () => LANGUAGES.find(({ code }) => code === currentLang)?.placeholderIconInMobile,
        [currentLang]
    );

    return (
        <div className='flex items-center justify-between w-full pr-[1.6rem] pl-[0.4rem]'>
            <Text size={isDesktop ? 'md' : 'lg'} weight='bold'>
                {localize('Menu')}
            </Text>

            {!hideLanguageSetting && (
                <button className='flex items-center' onClick={openLanguageSetting}>
                    {countryIcon}
                    <Text className='ml-[0.4rem]' size={isDesktop ? 'xs' : 'sm'} weight='bold'>
                        {currentLang}
                    </Text>
                </button>
            )}
        </div>
    );
};
