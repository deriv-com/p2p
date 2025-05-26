/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { useEffect, useState } from 'react';
import { api, useShouldRedirectToLowCodeHub } from '@/hooks';
import { Chat } from '@/utils';
import {
    DerivLightIcCashierBlockedIcon,
    DerivLightIcCashierUnderMaintenanceIcon,
    DerivLightWalletCurrencyUnavailableIcon as P2pUnavailable,
} from '@deriv/quill-icons';
import { requestOidcAuthentication } from '@deriv-com/auth-client';
import { Localize } from '@deriv-com/translations';
import { ActionScreen, Button, Loader, Text, useDevice } from '@deriv-com/ui';
import { ReactComponent as IcWalletAccountBlocked } from '../../public/ic-wallet-account-blocked.svg';
import { ReactComponent as IcWalletAccountCreated } from '../../public/ic-wallet-account-created.svg';
import './BlockedScenarios.scss';

type TBlockedScenariosObject = {
    [key: string]: {
        actionButton?: JSX.Element;
        description: JSX.Element;
        icon: JSX.Element;
        title: JSX.Element;
    };
};

const BlockedScenarios = ({ type }: { type: string }) => {
    const { isMobile } = useDevice();

    const buttonTextSize = isMobile ? 'md' : 'sm';
    const iconSize = isMobile ? 96 : 128;
    const redirectLink = useShouldRedirectToLowCodeHub();
    const redirectToWalletsLink = useShouldRedirectToLowCodeHub('', false, true);
    const { data: walletAccount, isAuthorized, mutateAsync } = api.account.useCreateWalletAccount();
    const { isSuccess: isMutateRealAccountSuccess, mutate: mutateRealAccount } = api.account.useCreateRealAccount();
    const { data } = api.account.useActiveAccount();
    const hasWalletAccount = data?.isWalletAccount;
    const [isLoading, setIsLoading] = useState(false);
    const [isWalletCreatedVisible, setIsWalletCreatedVisible] = useState(false);

    const openDerivApp = () => {
        window.open(redirectLink, '_self');
    };

    const redirectToWallets = () => {
        window.open(redirectToWalletsLink, '_self');
    };

    const createAccount = () => {
        if (hasWalletAccount) {
            createWalletAccount();
        } else {
            openDerivApp();
        }
    };
    const createWalletAccount = () => {
        setIsLoading(true);
        mutateAsync({ account_type: 'doughflow', currency: 'USD', loginid: data?.loginid });
    };

    useEffect(() => {
        if (isAuthorized) {
            mutateRealAccount({ currency: walletAccount?.currency, loginid: walletAccount?.client_id });
        }
    }, [isAuthorized]);

    useEffect(() => {
        setIsLoading(false);
        if (isMutateRealAccountSuccess) {
            setIsWalletCreatedVisible(true);
        } else {
            setIsWalletCreatedVisible(false);
        }
    }, [isMutateRealAccountSuccess]);

    const redirectToHome = () => {
        setIsLoading(true);
        try {
            requestOidcAuthentication({
                redirectCallbackUri: `${window.location.origin}/callback`,
            });
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Failed to refetch OIDC tokens', error);
        }
    };

    const openLiveChat = () => {
        Chat.open();
    };

    const blockedScenarios: TBlockedScenariosObject = {
        crypto: {
            actionButton: (
                <div className='blocked-scenarios__wallet--action'>
                    <Button onClick={createAccount} rounded='lg' size='lg' textSize={buttonTextSize}>
                        {hasWalletAccount ? (
                            <Localize i18n_default_text='Add USD wallet' />
                        ) : (
                            <Localize i18n_default_text='Add real USD account' />
                        )}
                    </Button>
                    {hasWalletAccount && (
                        <Button
                            borderWidth='sm'
                            onClick={redirectToWallets}
                            rounded='lg'
                            size='lg'
                            textSize={buttonTextSize}
                            variant='outlined'
                        >
                            <Localize i18n_default_text='Maybe Later' />
                        </Button>
                    )}
                </div>
            ),
            description: (
                <Text align='center'>
                    {hasWalletAccount ? (
                        <Localize i18n_default_text='To use Deriv P2P, add a USD wallet.' />
                    ) : (
                        <Localize i18n_default_text='To use Deriv P2P, add your real USD account.' />
                    )}
                </Text>
            ),
            icon: <IcWalletAccountBlocked />,
            title: (
                <Text align='center' weight='bold'>
                    <Localize i18n_default_text='Cryptocurrencies not supported' />
                </Text>
            ),
        },
        demo: {
            actionButton: (
                <Button onClick={openDerivApp} size='lg' textSize={buttonTextSize}>
                    <Localize i18n_default_text='Switch to real USD account' />
                </Button>
            ),
            description: (
                <Text align='center'>
                    <Localize i18n_default_text='Please switch to Real USD account to access the Deriv P2P marketplace.' />
                </Text>
            ),
            icon: <P2pUnavailable height={iconSize} width={iconSize} />,
            title: (
                <Text align='center' weight='bold'>
                    <Localize i18n_default_text='You are using a demo account' />
                </Text>
            ),
        },
        nonUSD: {
            actionButton: (
                <Button onClick={openLiveChat} rounded='lg' size='lg' textSize={buttonTextSize}>
                    <Localize i18n_default_text='Live chat' />
                </Button>
            ),
            description: (
                <Text align='center'>
                    <Localize i18n_default_text='Please use live chat to contact our Customer Support team for help.' />
                </Text>
            ),
            icon: <P2pUnavailable height={iconSize} width={iconSize} />,
            title: (
                <Text align='center' weight='bold'>
                    <Localize i18n_default_text='You have no Real USD account' />
                </Text>
            ),
        },
        p2pBlocked: {
            actionButton: (
                <Button onClick={openLiveChat} size='lg' textSize={buttonTextSize}>
                    <Localize i18n_default_text='Live chat' />
                </Button>
            ),
            description: (
                <Text align='center'>
                    <Localize i18n_default_text='Please use live chat to contact our Customer Support team for help.' />
                </Text>
            ),
            icon: <DerivLightIcCashierBlockedIcon height={iconSize} width={iconSize} />,
            title: (
                <Text align='center' weight='bold'>
                    <Localize i18n_default_text='Your Deriv P2P cashier is blocked' />
                </Text>
            ),
        },
        p2pBlockedForPa: {
            description: (
                <Text align='center'>
                    <Localize i18n_default_text='P2P transactions are locked. This feature is not available for payment agents.' />
                </Text>
            ),
            icon: <DerivLightIcCashierBlockedIcon height={iconSize} width={iconSize} />,
            title: (
                <Text align='center' weight='bold'>
                    <Localize i18n_default_text='Your Deriv P2P cashier is blocked' />
                </Text>
            ),
        },
        RestrictedCountry: {
            actionButton: (
                <Button onClick={() => window.open(redirectLink)} size='lg' textSize={buttonTextSize}>
                    <Localize i18n_default_text="Go to Trader's Hub" />
                </Button>
            ),
            description: (
                <Text align='center'>
                    <Localize i18n_default_text='This service is currently not offered in your country.' />
                </Text>
            ),
            icon: <DerivLightIcCashierBlockedIcon height={iconSize} width={iconSize} />,
            title: (
                <Text align='center' weight='bold'>
                    <Localize i18n_default_text='Deriv P2P unavailable' />
                </Text>
            ),
        },
        systemMaintenance: {
            description: (
                <div className='flex flex-col'>
                    <Text align='center'>
                        <Localize i18n_default_text='Please check back in a few minutes.' />
                    </Text>
                    <Text align='center'>
                        <Localize i18n_default_text='Thank you for your patience.' />
                    </Text>
                </div>
            ),
            icon: <DerivLightIcCashierUnderMaintenanceIcon height={iconSize} width={iconSize} />,
            title: (
                <Text weight='bold'>
                    <Localize i18n_default_text='Cashier is currently down for maintenance' />
                </Text>
            ),
        },
        walletCreated: {
            actionButton: (
                <div className='blocked-scenarios__wallet--action'>
                    <Button onClick={redirectToHome} rounded='lg' size='lg' textSize={buttonTextSize}>
                        <Localize i18n_default_text='Start using Deriv P2P' />
                    </Button>
                </div>
            ),
            description: (
                <div className='flex flex-col w-[32rem]'>
                    <Text align='center'>
                        <Localize i18n_default_text='You can now use Deriv P2P with your new USD Wallet and USD Deriv account.' />
                    </Text>
                </div>
            ),
            icon: <IcWalletAccountCreated />,
            title: (
                <Text weight='bold'>
                    <Localize i18n_default_text='Your USD Wallet is ready' />
                </Text>
            ),
        },
    };

    if (isLoading) return <Loader />;

    if (isWalletCreatedVisible || type === 'crypto') {
        const updatedType = isWalletCreatedVisible ? 'walletCreated' : type;

        return (
            <div className='pt-[2.4rem] mt-[10rem] blocked-scenarios__wallet'>
                <ActionScreen
                    actionButtons={blockedScenarios[updatedType].actionButton}
                    description={blockedScenarios[updatedType].description}
                    icon={blockedScenarios[updatedType].icon}
                    title={blockedScenarios[updatedType].title}
                />
            </div>
        );
    }

    return (
        <div className='pt-[2.4rem] mx-[2.4rem] mt-[10rem]'>
            {type && (
                <ActionScreen
                    actionButtons={blockedScenarios[type].actionButton}
                    description={blockedScenarios[type].description}
                    icon={blockedScenarios[type].icon}
                    title={blockedScenarios[type].title}
                />
            )}
        </div>
    );
};

export default BlockedScenarios;
