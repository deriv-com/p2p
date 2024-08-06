import { forwardRef } from 'react';
import clsx from 'clsx';
import { THooks } from 'types';
import { PaymentMethodWithIcon } from '@/components';
import { RATE_TYPE } from '@/constants';
import { formatTime } from '@/utils';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Text, Tooltip, useDevice } from '@deriv-com/ui';
import './BuySellData.scss';

type TBuySellDataProps = {
    accountCurrency: string;
    expiryPeriod: number;
    instructions?: string;
    isBuy: boolean;
    localCurrency: string;
    name: string;
    paymentMethodNames?: string[];
    paymentMethods: THooks.PaymentMethods.Get;
    rate: string;
    rateType?: string;
};

type TType = THooks.AdvertiserPaymentMethods.Get[number]['type'];
const BuySellData = forwardRef<HTMLDivElement, TBuySellDataProps>(
    (
        {
            accountCurrency,
            expiryPeriod,
            instructions = '',
            isBuy,
            localCurrency,
            name,
            paymentMethodNames,
            paymentMethods,
            rate,
            rateType,
        },
        ref
    ) => {
        const { localize } = useTranslations();
        const { isDesktop } = useDevice();
        const labelSize = isDesktop ? 'xs' : 'sm';
        const valueSize = isDesktop ? 'sm' : 'md';
        const paymentMethodTypes = paymentMethods?.reduce((acc: Record<string, string>, curr) => {
            if (curr.display_name && curr.type) {
                acc[curr.display_name] = curr.type;
            }
            return acc;
        }, {});
        const isFloating = rateType === RATE_TYPE.FLOAT;

        return (
            <div className='p-[1.6rem] lg:px-[2.4rem]' ref={ref}>
                <div className='buy-sell-data__details'>
                    <div className='flex flex-col w-full'>
                        <Text color='less-prominent' size={labelSize}>
                            {isBuy ? localize('Buyer') : localize('Seller')}
                        </Text>
                        <Text data-testid={`dt_${isBuy ? 'buyer' : 'seller'}_nickname`} size={valueSize}>
                            {name}
                        </Text>
                    </div>
                    <div className='flex flex-col w-full'>
                        <div className={clsx({ 'lg:hover:mb-[2.2rem]': isFloating })}>
                            <div
                                className={clsx('flex items-center gap-2', {
                                    'lg:hover:absolute': isFloating,
                                })}
                            >
                                <Text color='less-prominent' size={labelSize}>
                                    <Localize
                                        i18n_default_text='Rate (1 {{accountCurrency}})'
                                        values={{ accountCurrency }}
                                    />
                                </Text>
                                {isFloating && (
                                    <Tooltip
                                        className='w-72 mb-[-0.8rem] text-center'
                                        message={
                                            <Text size={labelSize}>
                                                <Localize i18n_default_text='Floating exchange rate shifts with market fluctuations.' />
                                            </Text>
                                        }
                                    >
                                        <Text
                                            as='div'
                                            className='buy-sell-data__details__floating-badge'
                                            size={labelSize}
                                        >
                                            <Localize i18n_default_text='Floating' />
                                        </Text>
                                    </Tooltip>
                                )}
                            </div>
                        </div>
                        <Text data-testid={`dt_${localCurrency}_rate`.toLowerCase()} size={valueSize}>
                            {rate} {localCurrency}
                        </Text>
                    </div>
                </div>
                {paymentMethodNames?.length && (
                    <div className='flex flex-col mb-[1.6rem]'>
                        <Text className='mb-[0.8rem]' color='less-prominent' size={labelSize}>
                            <Localize i18n_default_text='Payment methods' />
                        </Text>
                        {paymentMethodNames.map(method => (
                            <PaymentMethodWithIcon
                                className='mb-[0.8rem]'
                                key={method}
                                name={method}
                                type={paymentMethodTypes?.[method] as TType}
                            />
                        ))}
                    </div>
                )}
                <div className='flex flex-col mb-[1.6rem]'>
                    <Text color='less-prominent' size={labelSize}>
                        {isBuy ? (
                            <Localize i18n_default_text="Buyer's instructions" />
                        ) : (
                            <Localize i18n_default_text="Seller's instructions" />
                        )}
                    </Text>
                    <Text data-testid={`dt_${isBuy ? 'buyer' : 'seller'}_instruction`} size={valueSize}>
                        {instructions}
                    </Text>
                </div>
                <div className='flex flex-col mb-[1.6rem]'>
                    <Text color='less-prominent' size={labelSize}>
                        <Localize i18n_default_text='Orders must be completed in' />
                    </Text>
                    <Text data-testid='dt_order_completion_time' size={valueSize}>
                        {formatTime(expiryPeriod, localize)}
                    </Text>
                </div>
            </div>
        );
    }
);

BuySellData.displayName = 'BuySellData';

export default BuySellData;
