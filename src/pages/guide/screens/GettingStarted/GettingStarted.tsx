import Chat from '@/utils/chat';
import {
    DerivDarkFindAdIcon,
    DerivDarkPayUserIcon,
    DerivDarkReceivedFundIcon,
    DerivDarkReceivePaymentIcon,
    DerivDarkReleaseFundIcon,
} from '@deriv/quill-icons';
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
                                icon: <DerivDarkFindAdIcon height='97' width='97' />,
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
                                icon: <DerivDarkPayUserIcon height='97' width='97' />,
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
                                                        Chat.open();
                                                    }}
                                                />,
                                            ]}
                                            i18n_default_text='Once the seller confirms receiving your payment, the order is complete. You’ll receive your funds in your Deriv account. If the order expires but the seller fails to release the funds, contact us via <0>live chat</0>.'
                                        />
                                    </Text>
                                ),
                                icon: <DerivDarkReceivedFundIcon height='97' width='97' />,
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
                            icon: <DerivDarkFindAdIcon height='97' width='97' />,
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
                            icon: <DerivDarkReceivePaymentIcon height='97' width='97' />,
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
                            icon: <DerivDarkReleaseFundIcon height='97' width='97' />,
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
