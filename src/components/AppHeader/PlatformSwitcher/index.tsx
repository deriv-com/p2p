import { useTranslations } from '@deriv-com/translations';
import { PlatformSwitcher as UIPlatformSwitcher, PlatformSwitcherItem, useDevice } from '@deriv-com/ui';
import { platformsConfig } from '../HeaderConfig';
import './PlatformSwitcher.scss';

export const PlatformSwitcher = () => {
    const { localize } = useTranslations();
    const { isDesktop } = useDevice();

    if (!isDesktop) return null;
    return (
        <UIPlatformSwitcher
            bottomLinkLabel={localize('Looking for CFDs? Go to Trader’s Hub')}
            buttonProps={{
                className: 'app-header__platform-switcher',
                icon: platformsConfig[0].buttonIcon,
            }}
        >
            {platformsConfig.map(({ active, description, href, icon }) => (
                <PlatformSwitcherItem
                    active={active}
                    description={localize(description)}
                    href={href}
                    icon={icon}
                    key={description}
                />
            ))}
        </UIPlatformSwitcher>
    );
};
