import { useIsWalletAccount, useShouldRedirectToLowCodeHub } from '@/hooks';
import { useTranslations } from '@deriv-com/translations';
import { MenuItem, Text, useDevice } from '@deriv-com/ui';
import { getMenuItems } from '../HeaderConfig';
import './MenuItems.scss';

const MenuItems = () => {
    const { localize } = useTranslations();
    const { isDesktop } = useDevice();
    const items = getMenuItems(localize);
    const redirectLink = useShouldRedirectToLowCodeHub();
    const { isFetchedAfterMount, isWalletAccount } = useIsWalletAccount();

    if (!isFetchedAfterMount) return null;

    return (
        <>
            {isDesktop ? (
                items.map(({ as, href, icon, label, name }) => {
                    if (isWalletAccount && (name === 'Cashier' || name === 'Reports')) return null;
                    return (
                        <MenuItem
                            as={as}
                            className='app-header__menu'
                            href={
                                name === "Trader's Hub" || name === 'Reports' || name === 'Cashier'
                                    ? redirectLink
                                    : href
                            }
                            key={label}
                            leftComponent={icon}
                        >
                            <Text>{localize(label)}</Text>
                        </MenuItem>
                    );
                })
            ) : (
                <MenuItem
                    as={items[1].as}
                    className='flex gap-2 p-5'
                    href={items[1].href}
                    key={items[1].label}
                    leftComponent={items[1].icon}
                >
                    <Text>{localize(items[1].label)}</Text>
                </MenuItem>
            )}
        </>
    );
};

export default MenuItems;
