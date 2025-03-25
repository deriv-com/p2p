import { useShouldRedirectToLowCodeHub } from '@/hooks';
import { useTranslations } from '@deriv-com/translations';
import { MenuItem, Text, useDevice } from '@deriv-com/ui';
import { getMenuItems } from '../HeaderConfig';
import './MenuItems.scss';

const MenuItems = () => {
    const { localize } = useTranslations();
    const { isDesktop } = useDevice();
    const items = getMenuItems(localize);
    const redirectLink = useShouldRedirectToLowCodeHub();

    return (
        <>
            {isDesktop &&
                items.map(({ as, href, icon, label, name }) => (
                    <MenuItem
                        as={as}
                        className='app-header__menu'
                        href={name === "Trader's Hub" ? redirectLink : href}
                        key={label}
                        leftComponent={icon}
                    >
                        <Text>{localize(label)}</Text>
                    </MenuItem>
                ))}
        </>
    );
};

export default MenuItems;
