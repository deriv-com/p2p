//TODO: Replace these with Quill icons once ready
import { ReactComponent as ScamAdvancePaymentIcon } from '@/assets/scam-advance-payment.svg';
import { ReactComponent as ScamPotIcon } from '@/assets/scam-pot.svg';
import { ReactComponent as ScamSmsIcon } from '@/assets/scam-sms.svg';
import { Localize } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';
import { Carousel } from '../../components';

const Awareness = () => {
    const { isDesktop } = useDevice();

    return (
        <div>
            <Text as='div' size={isDesktop ? 'lg' : 'md'} weight='bold'>
                <Localize i18n_default_text='P2P awareness and precautions' />
            </Text>
            <Carousel
                items={[
                    {
                        className: 'flex flex-col items-center p-[2.4rem]',
                        description: (
                            <Text align='center' as='div' color='white' size='sm'>
                                <Localize i18n_default_text='Release funds only after confirming the payment has been received in your account. Scammers often disappear after receiving upfront payments.' />
                            </Text>
                        ),
                        icon: <ScamAdvancePaymentIcon />,
                        id: 0,
                        title: (
                            <Text align='center' as='div' color='red' size='md' weight='bold'>
                                <Localize i18n_default_text="Don't pay upfront" />
                            </Text>
                        ),
                    },
                    {
                        className: 'flex flex-col items-center p-[2.4rem]',
                        description: (
                            <Text align='center' as='div' color='white' size='sm'>
                                <Localize i18n_default_text='Always log in to your payment account to verify you’ve received the correct amount. Scammers may provide fake or altered payment receipt(s).' />
                            </Text>
                        ),
                        icon: <ScamPotIcon />,
                        id: 1,
                        title: (
                            <Text align='center' as='div' color='red' size='md' weight='bold'>
                                <Localize i18n_default_text="Confirm you've received payment" />
                            </Text>
                        ),
                    },
                    {
                        className: 'flex flex-col items-center p-[2.4rem]',
                        description: (
                            <Text align='center' as='div' color='white' size='sm'>
                                <Localize
                                    components={[
                                        <a
                                            className='guide__content-section--link'
                                            key={0}
                                            onClick={() => {
                                                // TODO: Uncomment once live chat is integrated.
                                                // window.LC_API.open_chat_window();
                                            }}
                                        />,
                                    ]}
                                    i18n_default_text='Deriv will never contact you to ask for the release of funds. Be cautious of scammers claiming to be from Deriv Customer Support. Always verify via <0>live chat</0>.'
                                />
                            </Text>
                        ),
                        icon: <ScamSmsIcon />,
                        id: 2,
                        title: (
                            <Text align='center' as='div' color='red' size='md' weight='bold'>
                                <Localize i18n_default_text='Stay safe from impersonators' />
                            </Text>
                        ),
                    },
                ]}
            />
        </div>
    );
};

export default Awareness;
