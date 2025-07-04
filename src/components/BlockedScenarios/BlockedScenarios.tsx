import { useShouldRedirectToLowCodeHub } from '@/hooks';
import { Chat } from '@/utils';
import {
    DerivLightIcCashierBlockedIcon,
    DerivLightIcCashierUnderMaintenanceIcon,
    DerivLightWalletCurrencyUnavailableIcon as P2pUnavailable,
} from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { ActionScreen, Button, Text, useDevice } from '@deriv-com/ui';

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

    const openDerivApp = () => {
        window.open(redirectLink, '_self');
    };

    const openLiveChat = () => {
        Chat.open();
    };

    const blockedScenarios: TBlockedScenariosObject = {
        crypto: {
            actionButton: (
                <Button onClick={openDerivApp} size='lg' textSize={buttonTextSize}>
                    <Localize i18n_default_text='Add real USD account' />
                </Button>
            ),
            description: (
                <Text align='center'>
                    <Localize i18n_default_text='To use Deriv P2P, add your real USD account.' />
                </Text>
            ),
            icon: <P2pUnavailable height={iconSize} width={iconSize} />,
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
                <Button onClick={openLiveChat} size='lg' textSize={buttonTextSize}>
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
    };

    return (
        <div className='pt-[2.4rem] m-[2.4rem]'>
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
