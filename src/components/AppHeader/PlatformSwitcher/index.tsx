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
        >
            {platformsConfig.map(({ active, description, href, icon }) => (
                <PlatformSwitcherItem
                    active={active}
                    description={localize('{{description}}', { description })}
                    href={href}
                    icon={icon}
                    key={description}
                />
            ))}
        </UIPlatformSwitcher>
    );
};
