//TODO: Replace these with Quill icons once ready
import { ReactComponent as FindAdIcon } from '@/assets/find-ad.svg';
import { ReactComponent as PayUserIcon } from '@/assets/pay-user.svg';
import { ReactComponent as ReceivePaymentIcon } from '@/assets/receive-payment.svg';
import { ReactComponent as ReceivedFundIcon } from '@/assets/received-fund.svg';
import { ReactComponent as ReleaseFundIcon } from '@/assets/release-fund.svg';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Tab, Tabs, Text } from '@deriv-com/ui';
import { Carousel } from '../../components';

const GettingStarted = () => {
    const { localize } = useTranslations();

    return (
        <Tabs>
            <Tab title={localize('Buy')}>
                <div className='guide__content-section--tab'>
                    <Carousel
                        items={[
                            {
                                description: (
                                    <Text size='sm'>
                                        <Localize i18n_default_text='Browse buy ads for the best rates, or create your own to set your preferred rates. Once your order is confirmed, the timer starts, and Deriv securely holds the seller’s funds in escrow.' />
                                    </Text>
                                ),
                                icon: <FindAdIcon />,
                                id: 0,
                                title: (
                                    <Text className='ml-2' size='md' weight='bold'>
                                        <Localize i18n_default_text='1. Find or create a buy ad' />
                                    </Text>
                                ),
                            },
                            {
                                description: (
                                    <Text size='sm'>
                                        <Localize i18n_default_text='Pay the seller within the time limit using your chosen payment method. Then, click “I’ve paid” and upload your proof of payment.' />
                                    </Text>
                                ),
                                icon: <PayUserIcon />,
                                id: 1,
                                title: (
                                    <Text className='ml-2' size='md' weight='bold'>
                                        <Localize i18n_default_text='2. Pay the seller' />
                                    </Text>
                                ),
                            },
                            {
                                description: (
                                    <Text size='sm'>
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
                                            i18n_default_text='Once the seller confirms receiving your payment, the order is complete. You’ll receive your funds in your Deriv account. If the order expires but the seller fails to release the funds, contact us via <0>live chat</0>.'
                                        />
                                    </Text>
                                ),
                                icon: <ReceivedFundIcon />,
                                id: 2,
                                title: (
                                    <Text className='ml-2' size='md' weight='bold'>
                                        <Localize i18n_default_text='3. Receive your funds' />
                                    </Text>
                                ),
                            },
                        ]}
                    />
                </div>
            </Tab>
            <Tab title={localize('Sell')}>
                <Carousel
                    items={[
                        {
                            description: (
                                <Text size='sm'>
                                    <Localize i18n_default_text='Browse sell ads for the best rates, or create your own to set your preferred rates. Once your order is confirmed, the timer starts, and Deriv securely holds your funds in escrow.' />
                                </Text>
                            ),
                            icon: <FindAdIcon />,
                            id: 0,
                            title: (
                                <Text className='ml-2' size='md' weight='bold'>
                                    <Localize i18n_default_text='1. Find or create a sell ad' />
                                </Text>
                            ),
                        },
                        {
                            description: (
                                <Text size='sm'>
                                    <Localize i18n_default_text='After the buyer makes the payment, check your chosen payment method’s account to ensure you received the full payment.' />
                                </Text>
                            ),
                            icon: <ReceivePaymentIcon />,
                            id: 1,
                            title: (
                                <Text className='ml-2' size='md' weight='bold'>
                                    <Localize i18n_default_text='2. Confirm payment received' />
                                </Text>
                            ),
                        },
                        {
                            description: (
                                <Text size='sm'>
                                    <Localize i18n_default_text='Once you’ve verified the full payment, click “I’ve received payment” and confirm via the verification link sent to your email. The funds will be released to the buyer, and the order will be complete.' />
                                </Text>
                            ),
                            icon: <ReleaseFundIcon />,
                            id: 2,
                            title: (
                                <Text className='ml-2' size='md' weight='bold'>
                                    <Localize i18n_default_text='3. Release your funds' />
                                </Text>
                            ),
                        },
                    ]}
                />
            </Tab>
        </Tabs>
    );
};

export default GettingStarted;
