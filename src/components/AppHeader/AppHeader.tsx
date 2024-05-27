import { useEffect, useState } from 'react';
import {
    LegacyMenuHamburger2pxIcon,
    LegacyNotificationIcon,
    StandaloneCircleUserRegularIcon,
} from '@deriv/quill-icons';
import { useAccountList, useAuthData } from '@deriv-com/api-hooks';
import { useTranslations } from '@deriv-com/translations';
import {
    Button,
    Drawer,
    Header,
    MenuItem,
    PlatformSwitcher,
    PlatformSwitcherItem,
    Text,
    TooltipMenuIcon,
    useDevice,
    Wrapper,
} from '@deriv-com/ui';
import { LocalStorageConstants, LocalStorageUtils, URLUtils } from '@deriv-com/utils';
import { AccountSwitcher } from './AccountSwitcher';
import { MenuItems, platformsConfig } from './HeaderConfig';
import './AppHeader.scss';

// TODO: handle local storage values not updating after changing local storage values
const AppHeader = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const { data: accounts } = useAccountList();
    const { isDesktop } = useDevice();
    const { activeLoginid, logout } = useAuthData();
    const { localize } = useTranslations();
    const appId = LocalStorageUtils.getValue(LocalStorageConstants.configAppId);
    const serverUrl = localStorage.getItem(LocalStorageConstants.configServerURL.toString());
    const oauthUrl =
        appId && serverUrl
            ? `https://${serverUrl}/oauth2/authorize?app_id=${appId}&l=EN&&brand=deriv`
            : URLUtils.getOauthURL();

    useEffect(() => {
        const shouldRedirectToLogin = () => {
            if (typeof accounts !== 'undefined') {
                const userHasNoP2PAccount = !accounts.find(
                    account => account.broker === 'CR' && account.currency === 'USD'
                );
                const activeAccount = accounts.find(account => account.loginid === activeLoginid);
                const activeAccountCurrency = activeAccount?.currency || null;

                if (userHasNoP2PAccount || activeAccountCurrency !== 'USD') {
                    window.open(oauthUrl, '_self');
                }
            }
        };

        shouldRedirectToLogin();
    }, [accounts, activeLoginid, oauthUrl]);

    return (
        <Header className={!isDesktop ? 'h-[40px]' : ''}>
            {isDesktop ? (
                <Wrapper variant='left'>
                    <PlatformSwitcher
                        bottomLinkLabel='Looking for CFDs? Go to Trader’s Hub'
                        buttonProps={{
                            className: 'py-0 px-4',
                            icon: platformsConfig[0].buttonIcon,
                        }}
                    >
                        {platformsConfig.map(({ active, description, href, icon }) => (
                            <PlatformSwitcherItem
                                active={active}
                                description={description}
                                href={href}
                                icon={icon}
                                key={description}
                            />
                        ))}
                    </PlatformSwitcher>
                    {MenuItems.map(({ as, href, icon, label }) => (
                        <MenuItem as={as} className='flex gap-2 p-5' href={href} key={label} leftComponent={icon}>
                            <Text>{localize(label)}</Text>
                        </MenuItem>
                    ))}
                </Wrapper>
            ) : (
                <Wrapper variant='left'>
                    <div
                        className='flex items-center justify-center py-2 px-4 h-full'
                        onClick={() => setIsDrawerOpen(true)}
                    >
                        <LegacyMenuHamburger2pxIcon iconSize='xs' />
                    </div>
                    <Drawer
                        isOpen={isDrawerOpen}
                        onCloseDrawer={() => {
                            setIsDrawerOpen(false);
                        }}
                        width='300px'
                    >
                        aaa
                    </Drawer>
                    <MenuItem
                        as={MenuItems[1].as}
                        className='flex gap-2 p-5'
                        href={MenuItems[1].href}
                        key={MenuItems[1].label}
                        leftComponent={MenuItems[1].icon}
                    >
                        <Text>{localize(MenuItems[1].label)}</Text>
                    </MenuItem>
                </Wrapper>
            )}
            <Wrapper variant='right'>
                {activeLoginid ? (
                    <>
                        <TooltipMenuIcon
                            as='button'
                            className={isDesktop ? 'mr-4 pl-2 border-l-[1px] h-[32px]' : ''}
                            disableHover
                            tooltipContent={localize('View notifications')}
                            tooltipPosition='bottom'
                        >
                            <LegacyNotificationIcon fill='red' iconSize='sm' />
                        </TooltipMenuIcon>
                        {isDesktop && (
                            <TooltipMenuIcon
                                as='a'
                                className='pr-3 border-r-[1px] h-[32px]'
                                disableHover
                                href='https://app.deriv.com/account/personal-details'
                                tooltipContent={localize('Manage account settings')}
                                tooltipPosition='bottom'
                            >
                                <StandaloneCircleUserRegularIcon fill='#626262' />
                            </TooltipMenuIcon>
                        )}
                        <AccountSwitcher />
                        <Button className='mr-6' onClick={logout} size='md'>
                            <Text weight='bold'>{localize('Logout')}</Text>
                        </Button>
                    </>
                ) : (
                    <Button
                        className='w-36'
                        color='primary-light'
                        onClick={() => window.open(oauthUrl, '_self')}
                        variant='ghost'
                    >
                        <Text weight='bold'>{localize('Log in')}</Text>
                    </Button>
                )}
            </Wrapper>
        </Header>
    );
};

export default AppHeader;
