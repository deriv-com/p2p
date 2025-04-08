import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { getOauthUrl } from '@/constants';
import { api, useGrowthbookGetFeatureValue, useOAuth } from '@/hooks';
import { useIsLoadingOidcStore } from '@/stores';
import { Chat, getCurrentRoute } from '@/utils';
import { StandaloneCircleUserRegularIcon } from '@deriv/quill-icons';
import { useAuthData } from '@deriv-com/api-hooks';
import { requestOidcAuthentication } from '@deriv-com/auth-client';
import { useTranslations } from '@deriv-com/translations';
import { Button, Header, Text, Tooltip, useDevice, Wrapper } from '@deriv-com/ui';
import { LocalStorageUtils, URLConstants } from '@deriv-com/utils';
import { AccountsInfoLoader } from './AccountsInfoLoader';
import { AccountSwitcher } from './AccountSwitcher';
import { AppLogo } from './AppLogo';
import { MenuItems } from './MenuItems';
import { MobileMenu } from './MobileMenu';
import { Notifications } from './Notifications';
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
    const isProduction = process.env.VITE_NODE_ENV === 'production' || origin === URLConstants.derivP2pProduction;
    const isStaging = process.env.VITE_NODE_ENV === 'staging' || origin === URLConstants.derivP2pStaging;
    const isOAuth2Enabled = isProduction || isStaging;

    useEffect(() => {
        document.documentElement.dir = instance.dir((currentLang || 'en').toLowerCase());
    }, [currentLang, instance]);
    const { oAuthLogout } = useOAuth();
    const [isNotificationServiceEnabled] = useGrowthbookGetFeatureValue({
        featureFlag: 'new_notifications_service_enabled',
    });
    const { isCheckingOidcTokens } = useIsLoadingOidcStore(
        useShallow(state => ({
            isCheckingOidcTokens: state.isCheckingOidcTokens,
        }))
    );

    const renderAccountSection = () => {
        if ((!isEndpointPage && !activeAccount) || isCheckingOidcTokens) {
            return <AccountsInfoLoader isLoggedIn isMobile={!isDesktop} speed={3} />;
        }

        if (activeLoginid) {
            return (
                <>
                    {isNotificationServiceEnabled && <Notifications />}
                    {isDesktop && (
                        <Tooltip
                            as='a'
                            className='pr-3 border-r-[0.1rem] h-[3.2rem]'
                            href='https://app.deriv.com/account/personal-details'
                            tooltipContent={localize('Manage account settings')}
                            tooltipPosition='bottom'
                        >
                            <StandaloneCircleUserRegularIcon fill='#626262' />
                        </Tooltip>
                    )}
                    <AccountSwitcher account={activeAccount!} />
                    <Button
                        className='mr-6'
                        onClick={() => {
                            Chat.clear();
                            oAuthLogout();
                            localStorage.removeItem(`p2p_${activeAccount?.loginid}_is_awareness_banner_hidden`);
                        }}
                        size='md'
                    >
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
                onClick={async () => {
                    if (isOAuth2Enabled) {
                        await requestOidcAuthentication({
                            redirectCallbackUri: `${window.location.origin}/callback`,
                        });
                    } else {
                        window.open(oauthUrl, '_self');
                    }
                }}
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
                {isDesktop && <MenuItems />}
            </Wrapper>
            <Wrapper variant='right'>{renderAccountSection()}</Wrapper>
        </Header>
    );
};

export default AppHeader;
