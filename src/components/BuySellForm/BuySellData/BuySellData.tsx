import { forwardRef } from 'react';
import { THooks } from 'types';
import { PaymentMethodWithIcon } from '@/components';
import { formatTime } from '@/utils';
import { Localize } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';
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
        },
        ref
    ) => {
        const { isMobile } = useDevice();
        const labelSize = isMobile ? 'sm' : 'xs';
        const valueSize = isMobile ? 'md' : 'sm';
        const paymentMethodTypes = paymentMethods?.reduce((acc: Record<string, string>, curr) => {
            if (curr.display_name && curr.type) {
                acc[curr.display_name] = curr.type;
            }
            return acc;
        }, {});

        return (
            <div className='p-[1.6rem] lg:px-[2.4rem]' ref={ref}>
                <div className='buy-sell-data__details'>
                    <div className='flex flex-col w-full'>
                        <Text color='less-prominent' size={labelSize}>
                            {isBuy ? 'Buyer' : 'Seller'}
                        </Text>
                        <Text size={valueSize}>{name}</Text>
                    </div>
                    <div className='flex flex-col w-full'>
                        <Text color='less-prominent' size={labelSize}>{`Rate (1 ${accountCurrency})`}</Text>
                        <Text size={valueSize}>
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
                    <Text size={valueSize}>{instructions}</Text>
                </div>
                <div className='flex flex-col mb-[1.6rem]'>
                    <Text color='less-prominent' size={labelSize}>
                        <Localize i18n_default_text='Orders must be completed in' />
                    </Text>
                    <Text size={valueSize}>{formatTime(expiryPeriod)}</Text>
                </div>
            </div>
        );
    }
);

BuySellData.displayName = 'BuySellData';

export default BuySellData;
