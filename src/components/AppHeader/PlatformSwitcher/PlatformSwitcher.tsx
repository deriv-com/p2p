import { useShouldRedirectToLowCodeHub } from '@/hooks';
import { useTranslations } from '@deriv-com/translations';
import { PlatformSwitcher as UIPlatformSwitcher, PlatformSwitcherItem } from '@deriv-com/ui';
import { getPlatformsConfig } from '../HeaderConfig';
import './PlatformSwitcher.scss';

const PlatformSwitcher = () => {
    const { localize } = useTranslations();
    const platformsConfig = getPlatformsConfig(localize);
    const redirectLink = useShouldRedirectToLowCodeHub(true);

    return (
        <UIPlatformSwitcher
            bottomLinkLabel={localize('Looking for CFDs? Go to Trader’s Hub')}
            bottomLinkProps={{
                href: redirectLink,
            }}
            buttonProps={{
                className: 'hover:bg-transparent lg:hover:bg-[#e6e9e9] px-[1.6rem]',
                icon: platformsConfig[0].buttonIcon,
            }}
            itemsWrapperClassName='platform-switcher'
            overlayClassName='platform-switcher__overlay'
        >
            {platformsConfig.map(({ active, description, href, icon }) => (
                <PlatformSwitcherItem
                    active={active}
                    className='platform-switcher__item'
                    description={localize('{{description}}', { description })}
                    href={href}
                    icon={icon}
                    key={description}
                />
            ))}
        </UIPlatformSwitcher>
    );
};

export default PlatformSwitcher;
