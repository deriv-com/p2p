import { useTranslations } from '@deriv-com/translations';
import { PlatformSwitcher as UIPlatformSwitcher, PlatformSwitcherItem } from '@deriv-com/ui';
import { platformsConfig } from '../HeaderConfig';

export const PlatformSwitcher = () => {
    const { localize } = useTranslations();

    return (
        <UIPlatformSwitcher
            bottomLinkLabel={localize('Looking for CFDs? Go to Trader’s Hub')}
            buttonProps={{
                className: 'hover:bg-transparent xl:hover:bg-[#e6e9e9] px-[1.6rem]',
                icon: platformsConfig[0].buttonIcon,
            }}
            itemsWrapperClassName='top-48 h-full xl:top-[4.7rem] xl:h-auto'
            overlayClassName='top-48 xl:top-[4.7rem]'
        >
            {platformsConfig.map(({ active, description, href, icon }) => (
                <PlatformSwitcherItem
                    active={active}
                    className='py-[1.4rem] px-[1.6rem] my-[1.4rem] mx-[1.6rem] h-auto xl:py-[2.4rem] xl:px-[1.6rem] xl:m-[1.6rem] xl:mt-[2.4rem] xl:h-[14.3rem]'
                    description={localize('{{description}}', { description })}
                    href={href}
                    icon={icon}
                    key={description}
                />
            ))}
        </UIPlatformSwitcher>
    );
};
