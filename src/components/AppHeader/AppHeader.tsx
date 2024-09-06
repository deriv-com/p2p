import { useEffect } from 'react';
import { getOauthUrl } from '@/constants';
import { api, useOAuth } from '@/hooks';
import { getCurrentRoute } from '@/utils';
import { StandaloneCircleUserRegularIcon } from '@deriv/quill-icons';
import { useAuthData } from '@deriv-com/api-hooks';
import { useTranslations } from '@deriv-com/translations';
import { Button, Header, Text, useDevice, Wrapper } from '@deriv-com/ui';
import { LocalStorageUtils } from '@deriv-com/utils';
import { TooltipMenuIcon } from '../TooltipMenuIcon';
import { AccountsInfoLoader } from './AccountsInfoLoader';
import { AccountSwitcher } from './AccountSwitcher';
import { AppLogo } from './AppLogo';
import { MenuItems } from './MenuItems';
import { MobileMenu } from './MobileMenu';
import { Notifications } from './Notifications';
import { PlatformSwitcher } from './PlatformSwitcher';
import './AppHeader.scss';

// TODO: handle local storage values not updating after changing local storage values
const AppHeader = () => {
    const { isDesktop } = useDevice();
    const isEndpointPage = getCurrentRoute() === 'endpoint';
    const { activeLoginid } = useAuthData();
    const { data: activeAccount } = api.account.useActiveAccount();
    const { instance, localize } = useTranslations();
    const oauthUrl = getOauthUrl();
    const currentLang = LocalStorageUtils.getValue<string>('i18n_language');

    useEffect(() => {
        document.documentElement.dir = instance.dir((currentLang || 'en').toLowerCase());
    }, [currentLang, instance]);
    const { oAuthLogout } = useOAuth();

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
                    <Button className='mr-6' onClick={oAuthLogout} size='md'>
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
