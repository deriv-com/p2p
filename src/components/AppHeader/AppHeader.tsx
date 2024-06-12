import { getOauthUrl } from '@/constants';
import { StandaloneCircleUserRegularIcon } from '@deriv/quill-icons';
import { useAuthData } from '@deriv-com/api-hooks';
import { useTranslations } from '@deriv-com/translations';
import { Button, Header, Text, TooltipMenuIcon, useDevice, Wrapper } from '@deriv-com/ui';
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
    const { activeLoginid, logout } = useAuthData();
    const { localize } = useTranslations();
    const oauthUrl = getOauthUrl();

    return (
        <Header className={!isDesktop ? 'h-[40px]' : ''}>
            <Wrapper variant='left'>
                <AppLogo />
                <MobileMenu />
                <PlatformSwitcher />
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
