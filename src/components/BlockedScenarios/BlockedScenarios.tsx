import { ReactComponent as P2pUnavailable } from '@/assets/p2p-unavailable.svg';
import {
    DerivLightIcCashierBlockedIcon,
    DerivLightIcCashierLockedIcon,
    DerivLightIcCashierUnderMaintenanceIcon,
} from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { ActionScreen, Button, Text, useDevice } from '@deriv-com/ui';
import { URLConstants } from '@deriv-com/utils';

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

    // TODO: change redirection when account switcher is implemented
    const openDerivApp = () => {
        window.open(URLConstants.derivAppProduction, '_blank')?.focus();
    };

    // TODO: implement this function to open live chat
    const openLiveChat = () => {};

    const blockedScenarios: TBlockedScenariosObject = {
        cashierLocked: {
            actionButton: (
                <Button onClick={openLiveChat} size='lg' textSize={buttonTextSize}>
                    <Localize i18n_default_text='Live chat' />
                </Button>
            ),
            description: (
                <Text align='center'>
                    <Localize i18n_default_text='Your cashier is currently locked. Please contact us via live chat to find out why.' />
                </Text>
            ),
            icon: <DerivLightIcCashierLockedIcon height={iconSize} width={iconSize} />,
            title: (
                <Text weight='bold'>
                    <Localize i18n_default_text='Cashier is locked' />
                </Text>
            ),
        },
        crypto: {
            actionButton: (
                <Button onClick={openDerivApp} size='lg' textSize={buttonTextSize}>
                    <Localize i18n_default_text='Switch to real USD account' />
                </Button>
            ),
            description: (
                <Text align='center'>
                    <Localize i18n_default_text='Please switch to your USD account to access the Deriv P2P marketplace.' />
                </Text>
            ),
            icon: <P2pUnavailable />,
            title: (
                <Text weight='bold'>
                    <Localize i18n_default_text='Crypto is not supported for Deriv P2P!' />
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
            icon: <P2pUnavailable />,
            title: (
                <Text weight='bold'>
                    <Localize i18n_default_text='You are using a demo account' />
                </Text>
            ),
        },
        nonUSD: {
            actionButton: (
                <Button onClick={openDerivApp} size='lg' textSize={buttonTextSize}>
                    <Localize i18n_default_text='Create real USD account' />
                </Button>
            ),
            description: (
                <Text align='center'>
                    <Localize i18n_default_text='Please create a Real USD account to access the Deriv P2P marketplace.' />
                </Text>
            ),
            icon: <P2pUnavailable />,
            title: (
                <Text weight='bold'>
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
                <Text weight='bold'>
                    <Localize i18n_default_text='Your Deriv P2P cashier is blocked' />
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
