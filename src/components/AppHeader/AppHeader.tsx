import { useEffect } from 'react';
import clsx from 'clsx';
import { useShallow } from 'zustand/react/shallow';
import { getOauthUrl } from '@/constants';
import { api, useGrowthbookGetFeatureValue, useOAuth, useShouldRedirectToLowCodeHub } from '@/hooks';
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

type TAppHeaderProps = {
    isMigrated: boolean;
    isTMBEnabled: boolean;
};
// TODO: handle local storage values not updating after changing local storage values
const AppHeader = ({ isMigrated, isTMBEnabled }: TAppHeaderProps) => {
    const { isDesktop } = useDevice();
    const isEndpointPage = getCurrentRoute() === 'endpoint';
    const { activeLoginid } = useAuthData();
    const { data: activeAccount } = api.account.useActiveAccount();
    const { instance, localize } = useTranslations();
    const oauthUrl = getOauthUrl();
    const currentLang = LocalStorageUtils.getValue<string>('i18n_language');
    const origin = window.location.origin;
    const isProduction = process.env.VITE_NODE_ENV === 'production' || origin === URLConstants.derivP2pProduction;
    const isStaging = process.env.VITE_NODE_ENV === 'staging' || origin === URLConstants.derivP2pStaging;
    const isOAuth2Enabled = isProduction || isStaging;
    const redirectLink = useShouldRedirectToLowCodeHub('personal-details');

    useEffect(() => {
        document.documentElement.dir = instance.dir((currentLang || 'en').toLowerCase());
    }, [currentLang, instance]);
    const { oAuthLogout } = useOAuth();
    const [isNotificationServiceEnabled] = useGrowthbookGetFeatureValue({
        featureFlag: 'new_notifications_service_enabled',
    });
    const { isCheckingOidcTokens, setIsCheckingOidcTokens } = useIsLoadingOidcStore(
        useShallow(state => ({
            isCheckingOidcTokens: state.isCheckingOidcTokens,
            setIsCheckingOidcTokens: state.setIsCheckingOidcTokens,
        }))
    );

    const renderAccountSection = () => {
        if ((!isEndpointPage && !activeAccount) || (!isEndpointPage && isCheckingOidcTokens)) {
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
                            href={redirectLink}
                            tooltipContent={localize('Manage account settings')}
                            tooltipPosition='bottom'
                        >
                            <StandaloneCircleUserRegularIcon fill='#626262' />
                        </Tooltip>
                    )}
                    <AccountSwitcher account={activeAccount!} />
                    {isEndpointPage && (
                        <Button
                            className='mr-6'
                            onClick={() => {
                                setIsCheckingOidcTokens(true);
                                Chat.clear();
                                oAuthLogout();
                            }}
                            size='md'
                        >
                            <Text size='sm' weight='bold'>
                                {localize('Logout')}
                            </Text>
                        </Button>
                    )}
                </>
            );
        }

        return (
            <Button
                className='w-36'
                color='primary-light'
                onClick={async () => {
                    if (isOAuth2Enabled && !isTMBEnabled) {
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
        <Header
            className={clsx({
                'h- [40px]': !isDesktop,
                hidden: isMigrated,
            })}
        >
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
