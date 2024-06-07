/* eslint-disable camelcase */
import { useEffect, useRef, useState } from 'react';
import { Control, FieldValues, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { TCurrency, THooks, TPaymentMethod } from 'types';
import { BUY_SELL, ORDERS_URL, RATE_TYPE } from '@/constants';
import { api } from '@/hooks';
import { useIsAdvertiser } from '@/hooks/custom-hooks';
import {
    generateEffectiveRate,
    getPaymentMethodObjects,
    removeTrailingZeros,
    roundOffDecimal,
    setDecimalPlaces,
} from '@/utils';
import { useExchangeRates } from '@deriv-com/api-hooks';
import { Localize } from '@deriv-com/translations';
import { InlineMessage, Text, useDevice } from '@deriv-com/ui';
import { LightDivider } from '../LightDivider';
import { BuySellAmount } from './BuySellAmount';
import { BuySellData } from './BuySellData';
import BuySellFormDisplayWrapper from './BuySellFormDisplayWrapper';
import { BuySellPaymentSection } from './BuySellPaymentSection';
import './BuySellForm.scss';

type TPayload = Omit<Parameters<ReturnType<typeof api.order.useCreate>['mutate']>[0], 'payment_method_ids'> & {
    payment_method_ids?: Parameters<THooks.Order.Create>[0]['payment_method_ids'];
};

type TBuySellFormProps = {
    advertId?: string;
    isModalOpen: boolean;
    onRequestClose: () => void;
};

const getAdvertiserMaxLimit = (
    isBuy: boolean,
    advertiserBuyLimit: number,
    advertiserSellLimit: number,
    maxOrderAmountLimitDisplay: string
) => {
    if (isBuy) {
        if (advertiserBuyLimit < Number(maxOrderAmountLimitDisplay)) return roundOffDecimal(advertiserBuyLimit);
    } else if (advertiserSellLimit < Number(maxOrderAmountLimitDisplay)) return roundOffDecimal(advertiserSellLimit);
    return maxOrderAmountLimitDisplay;
};

const BASE_CURRENCY = 'USD';

const BuySellForm = ({ advertId, isModalOpen, onRequestClose }: TBuySellFormProps) => {
    const { data: exchangeRatesData, subscribeRates } = useExchangeRates();
    const { data: advertInfo } = api.advert.useGet({ id: advertId });
    const { data: orderCreatedInfo, error, isError, isSuccess, mutate } = api.order.useCreate();
    const { data: paymentMethods } = api.paymentMethods.useGet();
    const { data: advertiserPaymentMethods, get } = api.advertiserPaymentMethods.useGet();
    const { data } = api.advertiser.useGetInfo() || {};
    const [errorMessage, setErrorMessage] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isHidden, setIsHidden] = useState(false);
    const {
        balance_available = '',
        daily_buy = 0,
        daily_buy_limit = 0,
        daily_sell = 0,
        daily_sell_limit = 0,
    } = data || {};

    const isAdvertiser = useIsAdvertiser();

    const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<number[]>([]);
    const [calculatedRate, setCalculatedRate] = useState('0');
    const [initialAmount, setInitialAmount] = useState('0');

    const exchangeRateRef = useRef<number | undefined>(undefined);

    const {
        account_currency,
        advertiser_details,
        description,
        effective_rate,
        id,
        local_currency = '',
        max_order_amount_limit_display,
        min_order_amount_limit,
        min_order_amount_limit_display,
        order_expiry_period,
        payment_method_names,
        price_display,
        rate,
        rate_type,
        type,
    } = advertInfo || {};

    useEffect(() => {
        if (isAdvertiser) {
            get();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAdvertiser]);

    useEffect(() => {
        if (local_currency) {
            subscribeRates({
                base_currency: BASE_CURRENCY,
                target_currencies: [local_currency],
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [local_currency]);

    useEffect(() => {
        const rate = exchangeRatesData?.exchange_rates?.rates?.[local_currency];
        if (typeof rate === 'number') {
            exchangeRateRef.current = rate;
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [exchangeRatesData]);

    const { displayEffectiveRate, effectiveRate } = generateEffectiveRate({
        exchangeRate: exchangeRateRef.current,
        localCurrency: local_currency as TCurrency,
        marketRate: Number(effective_rate),
        price: Number(price_display),
        rate,
        rateType: rate_type,
    });

    const advertiserPaymentMethodObjects = getPaymentMethodObjects(
        advertiserPaymentMethods as THooks.AdvertiserPaymentMethods.Get
    );

    const paymentMethodObjects = getPaymentMethodObjects(paymentMethods as THooks.PaymentMethods.Get);

    const availablePaymentMethods = payment_method_names?.map(paymentMethod => {
        const isAvailable = advertiserPaymentMethods?.some(method => method.display_name === paymentMethod);
        return {
            ...(isAvailable ? advertiserPaymentMethodObjects[paymentMethod] : paymentMethodObjects[paymentMethod]),
            isAvailable,
        };
    });

    const history = useHistory();
    const { isMobile } = useDevice();
    const isBuy = type === BUY_SELL.BUY;

    const shouldDisableField =
        !isBuy &&
        (parseFloat(balance_available.toString()) === 0 ||
            parseFloat(balance_available.toString()) < (min_order_amount_limit ?? 1));

    const {
        control,
        formState: { isValid },
        getValues,
        handleSubmit,
        setValue,
        trigger,
    } = useForm({
        defaultValues: {
            amount: min_order_amount_limit ?? 1,
            bank_details: '',
            contact_details: '',
        },
        mode: 'all',
    });

    const onSubmit = () => {
        //TODO: error handling after implementation of exchange rate
        const rateValue = rate_type === RATE_TYPE.FIXED ? null : effectiveRate;
        const payload: TPayload = {
            advert_id: id as string,
            amount: Number(getValues('amount')),
        };
        if (rateValue) {
            payload.rate = rateValue;
        }

        if (isBuy && selectedPaymentMethods.length) {
            payload.payment_method_ids =
                selectedPaymentMethods as Parameters<THooks.Order.Create>[0]['payment_method_ids'];
        }

        if (isBuy && !selectedPaymentMethods.length) {
            payload.payment_info = getValues('bank_details');
        }

        if (isBuy) {
            payload.contact_info = getValues('contact_details');
        }

        mutate(payload);
    };

    const onSelectPaymentMethodCard = (paymentMethodId: number) => {
        if (selectedPaymentMethods.includes(paymentMethodId)) {
            setSelectedPaymentMethods(selectedPaymentMethods.filter(method => method !== paymentMethodId));
        } else {
            setSelectedPaymentMethods([...selectedPaymentMethods, paymentMethodId]);
        }
    };

    useEffect(() => {
        if (effectiveRate) {
            setCalculatedRate(removeTrailingZeros(roundOffDecimal(effectiveRate, setDecimalPlaces(effectiveRate, 6))));
            setInitialAmount(removeTrailingZeros((min_order_amount_limit ?? 1 * Number(calculatedRate)).toString()));
        }
    }, [calculatedRate, effectiveRate, min_order_amount_limit]);

    useEffect(() => {
        if (isSuccess && orderCreatedInfo) {
            history.push(`${ORDERS_URL}/${orderCreatedInfo.id}`, { from: 'BuySell' });
            onRequestClose();
        }
    }, [isSuccess, orderCreatedInfo, history, onRequestClose]);

    useEffect(() => {
        if (isError && error?.error.message) {
            setErrorMessage(error?.error.message);
            scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [error?.error.message, isError]);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <BuySellFormDisplayWrapper
                accountCurrency={account_currency as TCurrency}
                isBuy={isBuy}
                isHidden={isHidden}
                isModalOpen={isModalOpen}
                isValid={isValid && ((isBuy && selectedPaymentMethods.length > 0) || !isBuy)}
                onRequestClose={onRequestClose}
                onSubmit={onSubmit}
            >
                {/* TODO: Remove the below banner when implementing real time exchange changes */}
                {rate_type === RATE_TYPE.FLOAT && !shouldDisableField && (
                    <div className='px-[2.4rem] mt-[2.4rem]'>
                        <InlineMessage variant='info'>
                            <Text size={isMobile ? 'xs' : '2xs'}>
                                <Localize i18n_default_text='If the market rate changes from the rate shown here, we won’t be able to process your order.' />
                            </Text>
                        </InlineMessage>
                    </div>
                )}
                {errorMessage && (
                    <div className='px-[2.4rem] mt-[2.4rem]'>
                        <InlineMessage variant='error'>
                            <Text size={isMobile ? 'xs' : '2xs'}>{errorMessage}</Text>
                        </InlineMessage>
                    </div>
                )}
                <BuySellData
                    accountCurrency={account_currency as TCurrency}
                    expiryPeriod={order_expiry_period ?? 3600}
                    instructions={description ?? '-'}
                    isBuy={isBuy}
                    localCurrency={local_currency as TCurrency}
                    name={advertiser_details?.name ?? ''}
                    paymentMethodNames={payment_method_names}
                    paymentMethods={paymentMethods as THooks.PaymentMethods.Get}
                    rate={displayEffectiveRate}
                    ref={scrollRef}
                />
                <LightDivider />
                {isBuy && payment_method_names && payment_method_names?.length > 0 && (
                    <BuySellPaymentSection
                        availablePaymentMethods={availablePaymentMethods as TPaymentMethod[]}
                        onSelectPaymentMethodCard={onSelectPaymentMethodCard}
                        selectedPaymentMethodIds={selectedPaymentMethods}
                        setIsHidden={setIsHidden}
                    />
                )}
                <BuySellAmount
                    accountCurrency={account_currency as TCurrency}
                    amount={initialAmount}
                    calculatedRate={calculatedRate}
                    control={control as unknown as Control<FieldValues>}
                    isBuy={isBuy}
                    isDisabled={shouldDisableField}
                    localCurrency={local_currency as TCurrency}
                    maxLimit={getAdvertiserMaxLimit(
                        isBuy,
                        Number(daily_buy_limit) - Number(daily_buy),
                        Number(daily_sell_limit) - Number(daily_sell),
                        max_order_amount_limit_display ?? '0'
                    )}
                    minLimit={min_order_amount_limit_display ?? '0'}
                    paymentMethodNames={payment_method_names}
                    setValue={setValue as unknown as (name: string, value: string) => void}
                    trigger={trigger as unknown as () => Promise<boolean>}
                />
            </BuySellFormDisplayWrapper>
        </form>
    );
};

export default BuySellForm;
