import { useEffect } from 'react';
import { StandaloneCircleUserRegularIcon } from '@deriv/quill-icons';
import { useAccountList, useAuthData } from '@deriv-com/api-hooks';
import { useTranslations } from '@deriv-com/translations';
import { Button, Header, Text, TooltipMenuIcon, useDevice, Wrapper } from '@deriv-com/ui';
import { LocalStorageConstants, LocalStorageUtils, URLUtils } from '@deriv-com/utils';
import { AccountSwitcher } from './AccountSwitcher';
import { AppLogo } from './AppLogo';
import { MenuItems } from './MenuItems';
import { MobileMenu } from './MobileMenu';
import { Notifications } from './Notifications';
import { PlatformSwitcher } from './PlatformSwitcher';
import './AppHeader.scss';

// TODO: handle local storage values not updating after changing local storage values
const AppHeader = () => {
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
            <Wrapper variant='left'>
                <AppLogo />
                <MobileMenu />
                {isDesktop && <PlatformSwitcher />}
                <MenuItems />
            </Wrapper>
            <Wrapper variant='right'>
                {activeLoginid ? (
                    <>
                        <Notifications />
                        {isDesktop && (
                            <TooltipMenuIcon
                                as='a'
                                className='pr-3 border-r-[1px] h-[32px]'
                                disableHover
                                href='https://app.deriv.com/account/personal-details'
                                tooltipContainerClassName='z-20'
                                tooltipContent={localize('Manage account settings')}
                                tooltipPosition='bottom'
                            >
                                <StandaloneCircleUserRegularIcon fill='#626262' />
                            </TooltipMenuIcon>
                        )}
                        <AccountSwitcher />
                        <Button className='mr-6' onClick={logout} size='md'>
                            <Text size='sm' weight='bold'>
                                {localize('Logout')}
                            </Text>
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
