import { useEffect } from 'react';
import { getOAuthLogoutUrl, getOAuthOrigin, getOauthUrl } from '@/constants';
import { api, useRedirectToOauth } from '@/hooks';
import useOAuth2Enabled from '@/hooks/custom-hooks/useOAuth2Enabled';
import { getCurrentRoute } from '@/utils';
import { StandaloneCircleUserRegularIcon } from '@deriv/quill-icons';
import { useAuthData } from '@deriv-com/api-hooks';
import { useTranslations } from '@deriv-com/translations';
import { Button, Header, Text, useDevice, Wrapper } from '@deriv-com/ui';
import { TooltipMenuIcon } from '../TooltipMenuIcon';
import { AccountsInfoLoader } from './AccountsInfoLoader';
import { AccountSwitcher } from './AccountSwitcher';
import { AppLogo } from './AppLogo';
import { MenuItems } from './MenuItems';
import { MobileMenu } from './MobileMenu';
import { Notifications } from './Notifications';
import { PlatformSwitcher } from './PlatformSwitcher';
import './AppHeader.scss';

type MessageEvent = {
    data: 'logout_complete' | 'logout_error';
    origin: string;
};

// TODO: handle local storage values not updating after changing local storage values
const AppHeader = () => {
    const { isDesktop } = useDevice();
    const isEndpointPage = getCurrentRoute() === 'endpoint';
    const { redirectToOauth } = useRedirectToOauth();
    const { activeLoginid, logout } = useAuthData();
    const { data: activeAccount } = api.account.useActiveAccount();
    const { localize } = useTranslations();
    const oauthUrl = getOauthUrl();
    const [isOAuth2Enabled] = useOAuth2Enabled();

    const WSLogoutAndRedirect = async () => {
        await logout();
        redirectToOauth();
    };

    useEffect(() => {
        const onMessage = async (event: MessageEvent) => {
            const allowedOrigin = getOAuthOrigin();
            if (allowedOrigin === event.origin) {
                if (event.data === 'logout_complete') {
                    WSLogoutAndRedirect();
                } else {
                    // eslint-disable-next-line no-console
                    console.warn('Unexpected message received: ', event.data);
                }
            } else {
                // eslint-disable-next-line no-console
                console.warn('Unexpected postmessage origin: ', event.origin);
            }
        };

        window.addEventListener('message', onMessage);

        return () => {
            window.removeEventListener('message', onMessage);
        };
    }, []);

    const handleLogout = async () => {
        if (isOAuth2Enabled) {
            let iframe: HTMLIFrameElement | null = document.getElementById('logout-iframe') as HTMLIFrameElement;
            if (!iframe) {
                iframe = document.createElement('iframe');
                iframe.id = 'logout-iframe';
                iframe.style.display = 'none';
                document.body.appendChild(iframe);
            }

            iframe.src = getOAuthLogoutUrl();

            // Reject the promise if there is an error
            iframe.onerror = error => {
                // eslint-disable-next-line no-console
                console.error('There has been a problem with the logout: ', error);
            };
        } else {
            WSLogoutAndRedirect();
        }
    };

    const renderAccountSection = () => {
        if (!isEndpointPage && !activeAccount) {
            return <AccountsInfoLoader isLoggedIn isMobile={!isDesktop} speed={3} />;
        }

        if (activeLoginid) {
            return (
                <>
                    <Notifications />
                    {isDesktop && (
                        <TooltipMenuIcon
                            as='a'
                            className='pr-3 border-r-[0.1rem] h-[3.2rem]'
                            disableHover
                            href='https://app.deriv.com/account/personal-details'
                            tooltipContent={localize('Manage account settings')}
                            tooltipPosition='bottom'
                        >
                            <StandaloneCircleUserRegularIcon fill='#626262' />
                        </TooltipMenuIcon>
                    )}
                    <AccountSwitcher account={activeAccount!} />
                    <Button className='mr-6' onClick={handleLogout} size='md'>
                        <Text size='sm' weight='bold'>
                            {localize('Logout')}
                        </Text>
                    </Button>
                </>
            );
        }

        return (
            <Button
                className='w-36'
                color='primary-light'
                onClick={() => window.open(oauthUrl, '_self')}
                variant='ghost'
            >
                <Text weight='bold'>{localize('Log in')}</Text>
            </Button>
        );
    };

    return (
        <Header className={!isDesktop ? 'h-[40px]' : ''}>
            <Wrapper variant='left'>
                <AppLogo />
                <MobileMenu />
                {isDesktop && <PlatformSwitcher />}
                {isDesktop && <MenuItems />}
            </Wrapper>
            <Wrapper variant='right'>{renderAccountSection()}</Wrapper>
        </Header>
    );
};

export default AppHeader;
