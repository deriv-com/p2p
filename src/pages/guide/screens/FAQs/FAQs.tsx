import { useRef } from 'react';
import { useShouldRedirectToLowCodeHub } from '@/hooks';
import { Chat } from '@/utils';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Accordion, Text, useDevice } from '@deriv-com/ui';
import { URLConstants } from '@deriv-com/utils';
import './FAQs.scss';

type TFAQsProps = {
    guideContentRef: React.RefObject<HTMLDivElement>;
};

const FAQs = ({ guideContentRef }: TFAQsProps) => {
    const { isDesktop } = useDevice();
    const { localize } = useTranslations();
    const accordionRefs = useRef<HTMLDivElement[]>([]);
    const redirectLink = useShouldRedirectToLowCodeHub('proof-of-identity');

    const handleScrollToAccordion = (index: number) => {
        const offsetByValue = isDesktop ? 0 : 100;
        if (accordionRefs.current[index] && guideContentRef.current) {
            guideContentRef.current?.scrollTo({
                behavior: 'smooth',
                top: accordionRefs.current[index].offsetTop - offsetByValue,
            });
        }
    };

    return (
        <div className='faqs'>
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
            <Accordion
                defaultOpen
                onScrollToAccordion={() => handleScrollToAccordion(0)}
                ref={(el: HTMLDivElement | null) => {
                    if (el) accordionRefs.current[0] = el;
                }}
                title={localize('How to register for Deriv P2P?')}
                variant='underline'
            >
                <ul>
                    <Text as='li' lineHeight='xl' size='sm'>
                        <Localize
                            components={[<a className='guide__content-section--link' href={redirectLink} key={0} />]}
                            i18n_default_text='Verify your age by submitting your <0>proof of identity</0> (for example, passport, driving licence, or ID card).'
                        />
                    </Text>
                    <Text as='li' lineHeight='xl' size='sm'>
                        <Localize i18n_default_text='Verify your address by submitting your proof of address (for example, utility bill or bank statement).' />
                    </Text>
                    <Text as='li' lineHeight='xl' size='sm'>
                        <Localize i18n_default_text='Verify your phone number.' />
                    </Text>
                    <Text as='li' lineHeight='xl' size='sm'>
                        <Localize i18n_default_text='Set a nickname for your Deriv P2P profile.' />
                    </Text>
                </ul>
                <Text as='div' lineHeight='xl' size='sm'>
                    <Localize i18n_default_text='Once your documents are approved, go to Cashier > Deriv P2P to register your Deriv P2P account.' />
                </Text>
            </Accordion>
            <Accordion
                onScrollToAccordion={() => handleScrollToAccordion(1)}
                ref={(el: HTMLDivElement | null) => {
                    if (el) accordionRefs.current[1] = el;
                }}
                title={localize('Why is my Deriv P2P balance different from my Deriv account balance?')}
                variant='underline'
            >
                <Text size='sm'>
                    <Localize
                        components={[
                            <a
                                className='guide__content-section--link'
                                href={`${URLConstants.derivComProduction}/payment-methods`}
                                key={0}
                            />,
                        ]}
                        i18n_default_text='Your Deriv P2P balance is different from your Deriv account balance because it only includes deposits made through <0>supported payment methods</0>. Methods such as credit cards, Maestro, Diners Club, ZingPay, Skrill, Neteller, Ozow, and UPI QR are not supported and are therefore not included in your P2P balance.'
                    />
                </Text>
            </Accordion>
            <Accordion
                onScrollToAccordion={() => handleScrollToAccordion(2)}
                ref={(el: HTMLDivElement | null) => {
                    if (el) accordionRefs.current[2] = el;
                }}
                title={localize('How secure is Deriv P2P?')}
                variant='underline'
            >
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
            <Accordion
                onScrollToAccordion={() => handleScrollToAccordion(3)}
                ref={(el: HTMLDivElement | null) => {
                    if (el) accordionRefs.current[3] = el;
                }}
                title={localize('Can I increase my daily buy or sell limit on Deriv P2P?')}
                variant='underline'
            >
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
                onScrollToAccordion={() => handleScrollToAccordion(4)}
                ref={(el: HTMLDivElement | null) => {
                    if (el) accordionRefs.current[4] = el;
                }}
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
                                    Chat.open();
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
