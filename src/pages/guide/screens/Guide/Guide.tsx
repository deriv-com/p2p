import { useHistory } from 'react-router-dom';
//TODO: Replace these with Quill icons once ready
import { ReactComponent as FindAdIcon } from '@/assets/find-ad.svg';
import { ReactComponent as PayUserIcon } from '@/assets/pay-user.svg';
import { ReactComponent as ReceivePaymentIcon } from '@/assets/receive-payment.svg';
import { ReactComponent as ReceivedFundIcon } from '@/assets/received-fund.svg';
import { ReactComponent as ReleaseFundIcon } from '@/assets/release-fund.svg';
import { ReactComponent as ScamAdvancePaymentIcon } from '@/assets/scam-advance-payment.svg';
import { ReactComponent as ScamPotIcon } from '@/assets/scam-pot.svg';
import { ReactComponent as ScamSmsIcon } from '@/assets/scam-sms.svg';
import { PageReturn } from '@/components';
import { BUY_SELL_URL } from '@/constants';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Accordion, Tab, Tabs, Text, useDevice } from '@deriv-com/ui';
import { URLConstants } from '@deriv-com/utils';
import { GuideCard } from '../../components';
import './Guide.scss';

const Guide = () => {
    const history = useHistory();
    const { localize } = useTranslations();
    const { isDesktop } = useDevice();

    return (
        <div className='guide'>
            <PageReturn
                className='lg:mt-0'
                hasBorder={!isDesktop}
                onClick={() => history.push(BUY_SELL_URL)}
                pageTitle={localize('P2P Guide')}
                size={isDesktop ? 'md' : 'lg'}
                weight='bold'
            />
            <div className='guide__content'>
                <Text as='div' size={isDesktop ? 'lg' : 'md'} weight='bold'>
                    <Localize i18n_default_text='Get started with P2P' />
                </Text>
                <div className='guide__content-section'>
                    <Tabs>
                        <Tab title={localize('Buy')}>
                            <div className='guide__content-section--tab flex'>
                                <GuideCard
                                    description={
                                        <Text size='sm'>
                                            <Localize i18n_default_text='Browse buy ads for the best rates, or create your own to set your preferred rates. Once your order is confirmed, the timer starts, and Deriv securely holds the seller’s funds in escrow.' />
                                        </Text>
                                    }
                                    icon={<FindAdIcon />}
                                    title={
                                        <Text size='md' weight='bold'>
                                            <Localize i18n_default_text='1. Find or create a buy ad' />
                                        </Text>
                                    }
                                />
                                <GuideCard
                                    description={
                                        <Text size='sm'>
                                            <Localize i18n_default_text='Pay the seller within the time limit using your chosen payment method. Then, click “I’ve paid” and upload your proof of payment.' />
                                        </Text>
                                    }
                                    icon={<PayUserIcon />}
                                    title={
                                        <Text size='md' weight='bold'>
                                            <Localize i18n_default_text='2. Pay the seller' />
                                        </Text>
                                    }
                                />
                                <GuideCard
                                    description={
                                        <Text size='sm'>
                                            <Localize i18n_default_text='Once the seller confirms receiving your payment, the order is complete. You’ll receive your funds in your Deriv account. If the order expires but the seller fails to release the funds, contact us via live chat.' />
                                        </Text>
                                    }
                                    icon={<ReceivedFundIcon />}
                                    title={
                                        <Text size='md' weight='bold'>
                                            <Localize i18n_default_text='3. Receive your funds' />
                                        </Text>
                                    }
                                />
                            </div>
                        </Tab>
                        <Tab title={localize('Sell')}>
                            <div className='flex'>
                                <GuideCard
                                    description={
                                        <Text size='sm'>
                                            <Localize i18n_default_text='Browse sell ads for the best rates, or create your own to set your preferred rates. Once your order is confirmed, the timer starts, and Deriv securely holds your funds in escrow.' />
                                        </Text>
                                    }
                                    icon={<FindAdIcon />}
                                    title={
                                        <Text size='md' weight='bold'>
                                            <Localize i18n_default_text='1. Find or create a sell ad' />
                                        </Text>
                                    }
                                />
                                <GuideCard
                                    description={
                                        <Text size='sm'>
                                            <Localize i18n_default_text='After the buyer makes the payment, check your chosen payment method’s account to ensure you received the full payment.' />
                                        </Text>
                                    }
                                    icon={<ReceivePaymentIcon />}
                                    title={
                                        <Text size='md' weight='bold'>
                                            <Localize i18n_default_text='2. Confirm payment received' />
                                        </Text>
                                    }
                                />
                                <GuideCard
                                    description={
                                        <Text size='sm'>
                                            <Localize i18n_default_text='Once you’ve verified the full payment, click “I’ve received payment” and confirm via the verification link sent to your email. The funds will be released to the buyer, and the order will be complete.' />
                                        </Text>
                                    }
                                    icon={<ReleaseFundIcon />}
                                    title={
                                        <Text size='md' weight='bold'>
                                            <Localize i18n_default_text='3. Release your funds' />
                                        </Text>
                                    }
                                />
                            </div>
                        </Tab>
                    </Tabs>
                </div>
                <div className='guide__content-section'>
                    <Text as='div' size={isDesktop ? 'lg' : 'md'} weight='bold'>
                        <Localize i18n_default_text='P2P awareness and precautions' />
                    </Text>
                    <div className='flex'>
                        <GuideCard
                            className='flex flex-col items-center'
                            description={
                                <Text align='center' as='div' color='white' size='sm'>
                                    <Localize i18n_default_text='Release funds only after confirming the payment has been received in your account. Scammers often disappear after receiving upfront payments.' />
                                </Text>
                            }
                            icon={<ScamAdvancePaymentIcon />}
                            title={
                                <Text align='center' as='div' color='red' size='md' weight='bold'>
                                    <Localize i18n_default_text="Don't pay upfront" />
                                </Text>
                            }
                        />
                        <GuideCard
                            className='flex flex-col items-center'
                            description={
                                <Text align='center' as='div' color='white' size='sm'>
                                    <Localize i18n_default_text='Always log in to your payment account to verify you’ve received the correct amount. Scammers may provide fake or altered payment receipt(s).' />
                                </Text>
                            }
                            icon={<ScamPotIcon />}
                            title={
                                <Text align='center' as='div' color='red' size='md' weight='bold'>
                                    <Localize i18n_default_text="Confirm you've received payment" />
                                </Text>
                            }
                        />
                        <GuideCard
                            className='flex flex-col items-center'
                            description={
                                <Text align='center' as='div' color='white' size='sm'>
                                    <Localize i18n_default_text='Deriv will never contact you to ask for the release of funds. Be cautious of scammers claiming to be from Deriv Customer Support. Always verify via live chat.' />
                                </Text>
                            }
                            icon={<ScamSmsIcon />}
                            title={
                                <Text align='center' as='div' color='red' size='md' weight='bold'>
                                    <Localize i18n_default_text='Stay safe from impersonators' />
                                </Text>
                            }
                        />
                    </div>
                </div>
                <div className='guide__content-section'>
                    <Text as='div' size={isDesktop ? 'lg' : 'md'} weight='bold'>
                        <Localize i18n_default_text='Videos' />
                    </Text>
                    <div className='flex'>
                        <GuideCard
                            description={
                                <div>
                                    <Text size='sm'>
                                        <Localize i18n_default_text='Find out how to get money in and out of your Deriv account easily with Deriv P2P.' />
                                    </Text>
                                </div>
                            }
                            media={
                                <iframe
                                    allowFullScreen
                                    src='https://player.vimeo.com/video/715973569?color&autopause=0&disablePictureInPicture=0&loop=0&muted=0&title=0&portrait=0&byline=0#t='
                                />
                            }
                            title={
                                <Text size='md' weight='bold'>
                                    <Localize i18n_default_text='Introducing Deriv P2P' />
                                </Text>
                            }
                        />
                        <GuideCard
                            description={
                                <div>
                                    <Text size='sm'>
                                        <Localize i18n_default_text='Find out how to create ads, and how to transfer funds in and out of your Deriv account via P2P payments.' />
                                    </Text>
                                </div>
                            }
                            icon={null}
                            title={
                                <Text size='md' weight='bold'>
                                    <Localize i18n_default_text='How to use the Deriv P2P app' />
                                </Text>
                            }
                        />
                    </div>
                </div>
                <div className='guide__content-section'>
                    <Text as='div' size={isDesktop ? 'lg' : 'md'} weight='bold'>
                        <Localize i18n_default_text='Blog' />
                    </Text>
                    <GuideCard
                        description={
                            <div>
                                <Text size='sm'>
                                    <Localize i18n_default_text='Protecting your funds and identity is as crucial as ever. Fraudsters are resourceful in finding ways to exploit your information. Read on to learn how to protect yourself when making peer-to-peer payments.' />
                                </Text>
                            </div>
                        }
                        icon={null}
                        title={
                            <Text size='md' weight='bold'>
                                <Localize i18n_default_text='How to protect yourself on P2P platforms' />
                            </Text>
                        }
                    />
                </div>
                <div className='guide__content-section'>
                    <Text size={isDesktop ? 'lg' : 'md'} weight='bold'>
                        <Localize i18n_default_text='FAQs' />
                    </Text>
                    <Accordion title='How to register for Deriv P2P?' variant='underline'>
                        <Text as='div' className='mb-[0.5rem]' lineHeight='xl' size='sm'>
                            <Localize
                                components={[
                                    <a href={`${URLConstants.derivAppProduction}/account/proof-of-identity`} key={0} />,
                                ]}
                                i18n_default_text='Age-verify your account by submitting  <0>proof of identity</0>.'
                            />
                        </Text>
                        <Text as='div' lineHeight='xl' size='sm'>
                            <Localize i18n_default_text='Once your submitted document has been approved, go to Cashier > Deriv P2P to register your Deriv P2P account.' />
                        </Text>
                    </Accordion>
                    <Accordion
                        title='Why is my Deriv P2P balance different from my Deriv account balance?'
                        variant='underline'
                    >
                        <Text size='sm'>
                            <Localize i18n_default_text='Your Deriv P2P balance may not include all deposits made to your Deriv account. Deposits via credit and debit cards (including Maestro and Diners Club), ZingPay, Skrill, Neteller, and Direct Banking Nigeria will not be available in Deriv P2P.' />
                        </Text>
                    </Accordion>
                    <Accordion title='How secure is Deriv P2P?' variant='underline'>
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
                    <Accordion title='Can I increase my daily buy or sell limit on Deriv P2P?' variant='underline'>
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
                        title="What should I do if I have a dispute with the trader I'm dealing with?"
                        variant='underline'
                    >
                        <Text as='div' className='mb-[0.5rem]' lineHeight='xl' size='sm'>
                            <Localize i18n_default_text="If you encounter any issues with a transaction on Deriv P2P, first try to resolve it with the trader you're dealing with. If they're not willing to help, please let us know via live chat, and we'll help you resolve it." />
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
                            <Localize i18n_default_text='For further information, see Section 4 on Deriv P2P in our terms and conditions.' />
                        </Text>
                    </Accordion>
                </div>
            </div>
        </div>
    );
};

export default Guide;
