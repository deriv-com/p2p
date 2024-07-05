import { ReactComponent as P2pUnavailable } from '@/assets/p2p-unavailable.svg';
import { Localize } from '@deriv-com/translations';
import { ActionScreen, Button, Text, useDevice } from '@deriv-com/ui';
import { URLConstants } from '@deriv-com/utils';

type TBlockedScenariosObject = {
    [key: string]: {
        actionButtons: JSX.Element;
        description: JSX.Element;
        icon: JSX.Element;
        title: JSX.Element;
    };
};

const BlockedScenarios = ({ type }: { type: string }) => {
    const { isDesktop } = useDevice();

    const buttonTextSize = isDesktop ? 'sm' : 'md';

    // TODO: change redirection when account switcher is implemented
    const openDerivApp = () => {
        window.open(URLConstants.derivAppProduction, '_blank')?.focus();
    };

    const blockedScenarios: TBlockedScenariosObject = {
        crypto: {
            actionButtons: (
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
            actionButtons: (
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
            actionButtons: (
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
    };
    return (
        <div className='pt-[2.4rem] m-[2.4rem]'>
            <ActionScreen
                actionButtons={blockedScenarios[type].actionButtons}
                description={blockedScenarios[type].description}
                icon={blockedScenarios[type].icon}
                title={blockedScenarios[type].title}
            />
        </div>
    );
};

export default BlockedScenarios;
