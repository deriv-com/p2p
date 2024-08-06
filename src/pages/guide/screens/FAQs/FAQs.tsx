import { useLiveChat } from '@/hooks/custom-hooks';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Accordion, Text, useDevice } from '@deriv-com/ui';
import { URLConstants } from '@deriv-com/utils';

const FAQs = () => {
    const { LiveChatWidget } = useLiveChat();
    const { isDesktop } = useDevice();
    const { localize } = useTranslations();

    return (
        <div>
            <div className='flex justify-between mb-[2.4rem]'>
                <Text size={isDesktop ? 'lg' : 'md'} weight='bold'>
                    <Localize i18n_default_text='FAQs' />
                </Text>
                <Text
                    as='a'
                    className='underline mr-2'
                    color='red'
                    data-testid='dt_learn_more_hyperlink'
                    href={`${URLConstants.derivComProduction}/help-centre/deriv-p2p`}
                    size='sm'
                    weight='bold'
                >
                    <Localize i18n_default_text='Learn more' />
                </Text>
            </div>
            <Accordion defaultOpen title={localize('How to register for Deriv P2P?')} variant='underline'>
                <Text as='div' className='mb-[0.5rem]' lineHeight='xl' size='sm'>
                    <Localize
                        components={[
                            <a
                                className='guide__content-section--link'
                                href={`${URLConstants.derivAppProduction}/account/proof-of-identity`}
                                key={0}
                            />,
                        ]}
                        i18n_default_text='Age-verify your account by submitting  <0>proof of identity</0>.'
                    />
                </Text>
                <Text as='div' lineHeight='xl' size='sm'>
                    <Localize i18n_default_text='Once your submitted document has been approved, go to Cashier > Deriv P2P to register your Deriv P2P account.' />
                </Text>
            </Accordion>
            <Accordion
                title={localize('Why is my Deriv P2P balance different from my Deriv account balance?')}
                variant='underline'
            >
                <Text size='sm'>
                    <Localize i18n_default_text='Your Deriv P2P balance may not include all deposits made to your Deriv account. Deposits via credit and debit cards (including Maestro and Diners Club), ZingPay, Skrill, Neteller, and Direct Banking Nigeria will not be available in Deriv P2P.' />
                </Text>
            </Accordion>
            <Accordion title={localize('How secure is Deriv P2P?')} variant='underline'>
                <Text as='div' className='mb-[0.5rem]' lineHeight='xl' size='sm'>
                    <Localize i18n_default_text='Here are some of the ways we ensure that Deriv P2P is as secure as possible:' />
                </Text>
                <Text as='div' className='mb-[0.5rem]' lineHeight='xl' size='sm' weight='bold'>
                    <Localize i18n_default_text='Everyone is verified' />
                </Text>
                <Text as='div' className='mb-[0.5rem]' lineHeight='xl' size='sm'>
                    <Localize i18n_default_text="We verify everyone's identity before they can start using Deriv P2P. No anonymous transactions are allowed." />
                </Text>
                <Text as='div' className='mb-[0.5rem]' lineHeight='xl' size='sm' weight='bold'>
                    <Localize i18n_default_text='Escrow fund protection' />
                </Text>
                <Text as='div' className='mb-[0.5rem]' lineHeight='xl' size='sm'>
                    <Localize i18n_default_text='The order amount is locked in escrow until both parties confirm that the transaction has been completed from their end.' />
                </Text>
                <Text as='div' className='mb-[0.5rem]' lineHeight='xl' size='sm' weight='bold'>
                    <Localize i18n_default_text='Two-factor authentication' />
                </Text>
                <Text as='div' className='mb-[0.5rem]' lineHeight='xl' size='sm'>
                    <Localize i18n_default_text='Dual-layer verification is applied to every Deriv P2P transaction as an extra layer of security before funds are released.' />
                </Text>
            </Accordion>
            <Accordion title={localize('Can I increase my daily buy or sell limit on Deriv P2P?')} variant='underline'>
                <Text as='div' className='mb-[0.5rem]' lineHeight='xl' size='sm'>
                    <Localize i18n_default_text="Yes, as long as you pass our checks. Initially, you'll start with a 500 USD limit for buy and sell orders." />
                </Text>
                <Text as='div' className='mb-[0.5rem]' lineHeight='xl' size='sm'>
                    <Localize i18n_default_text="Once you've met the required criteria, we'll increase your limits to 5,000 USD for buy orders and 2,000 USD for sell orders." />
                </Text>
                <Text as='div' className='mb-[0.5rem]' lineHeight='xl' size='sm'>
                    <Localize i18n_default_text='If you continue to do well, you can increase your limit to 10,000 USD for buy and sell orders.' />
                </Text>
                <Text as='div' className='mb-[0.5rem]' lineHeight='xl' size='sm'>
                    <Localize
                        components={[<strong key={0} />]}
                        i18n_default_text='<0>Note:</0> Your buy and sell limits on Deriv P2P are set at our discretion.'
                    />
                </Text>
            </Accordion>
            <Accordion
                title={localize("What should I do if I have a dispute with the trader I'm dealing with?")}
                variant='underline'
            >
                <Text as='div' className='mb-[0.5rem]' lineHeight='xl' size='sm'>
                    <Localize
                        components={[
                            <a
                                className='guide__content-section--link'
                                key={0}
                                onClick={() => {
                                    LiveChatWidget.call('maximize');
                                }}
                            />,
                        ]}
                        i18n_default_text="If you encounter any issues with a transaction on Deriv P2P, first try to resolve it with the trader you're dealing with. If they're not willing to help, please let us know via <0>live chat</0>, and we'll help you resolve it."
                    />
                </Text>
                <Text as='div' className='mb-[0.5rem]' lineHeight='xl' size='sm'>
                    <Localize i18n_default_text='To dispute a Deriv P2P transaction, follow these steps:' />
                </Text>
                <ul>
                    <li>
                        <Text as='span' className='mb-[0.5rem]' lineHeight='xl' size='sm'>
                            <Localize i18n_default_text='Once the order has expired, click Complain on the order details screen.' />
                        </Text>
                    </li>
                    <li>
                        <Text as='span' className='mb-[0.5rem]' lineHeight='xl' size='sm'>
                            <Localize i18n_default_text='Complete the form and click Submit.' />
                        </Text>
                    </li>
                </ul>
                <Text as='div' className='mb-[0.5rem]' lineHeight='xl' size='sm'>
                    <Localize i18n_default_text="We'll seek more info on the transaction by reaching out to you and the trader you are dealing with, and we'll try to resolve the issue within 12 hours. We'll keep you informed of the status." />
                </Text>
                <Text as='div' className='mb-[0.5rem]' lineHeight='xl' size='sm'>
                    <Localize
                        components={[
                            <a
                                className='guide__content-section--link'
                                href={`${URLConstants.derivComProduction}/tnc/funds-and-transfers.pdf`}
                                key={0}
                            />,
                        ]}
                        i18n_default_text='For further information, see Section 4 on Deriv P2P in <0>our terms and conditions</0>.'
                    />
                </Text>
            </Accordion>
        </div>
    );
};

export default FAQs;
