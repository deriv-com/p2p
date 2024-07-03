/* eslint-disable camelcase */
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { Control, FieldValues, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { TCurrency, THooks, TPaymentMethod } from 'types';
import { ErrorModal, RateFluctuationModal } from '@/components/Modals';
import { BUY_SELL, ERROR_CODES, ORDERS_URL, RATE_TYPE } from '@/constants';
import { api } from '@/hooks';
import useInvalidateQuery from '@/hooks/api/useInvalidateQuery';
import { useIsAdvertiser, useModalManager } from '@/hooks/custom-hooks';
import {
    generateEffectiveRate,
    getPaymentMethodObjects,
    removeTrailingZeros,
    roundOffDecimal,
    setDecimalPlaces,
} from '@/utils';
import { useTranslations } from '@deriv-com/translations';
import { InlineMessage, Text, useDevice } from '@deriv-com/ui';
import { FormatUtils } from '@deriv-com/utils';
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

const BuySellForm = ({ advertId, isModalOpen, onRequestClose }: TBuySellFormProps) => {
    const { localize } = useTranslations();
    const { hideModal, isModalOpenFor, showModal } = useModalManager();
    const { data: advertInfo, subscribe, unsubscribe } = api.advert.useSubscribe();
    const { data: orderCreatedInfo, error, isError, isSuccess, mutate, reset } = api.order.useCreate();
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
    const invalidate = useInvalidateQuery();

    const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<number[]>([]);
    const [calculatedRate, setCalculatedRate] = useState('0');
    const [buySellAmount, setBuySellAmount] = useState('0');

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

    const { exchangeRate } = api.exchangeRates.useGet(local_currency);

    const [hasCounterpartyRateChanged, setHasCounterpartyRateChanged] = useState(false);
    const [hasRateChanged, setHasRateChanged] = useState(false);
    const [inputValue, setInputValue] = useState(min_order_amount_limit_display ?? '0');
    const finalEffectiveRateRef = useRef<number | undefined>(undefined);
    const counterpartyRateRef = useRef<number | undefined>(undefined);

    useEffect(() => {
        if (isAdvertiser) {
            get();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAdvertiser]);

    const { displayEffectiveRate, effectiveRate } = generateEffectiveRate({
        exchangeRate,
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
        if (hasRateChanged && !isModalOpenFor('RateFluctuationModal')) {
            setIsHidden(true);
            showModal('RateFluctuationModal', { shouldStackModals: false });
            return;
        }
        const rateValue = rate_type === RATE_TYPE.FIXED ? null : finalEffectiveRateRef.current;
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

    const onCloseBuySellForm = () => {
        onRequestClose();
        unsubscribe();
        invalidate('p2p_advert_list');
    };

    useEffect(() => {
        if (advertId) subscribe({ id: advertId });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [advertId]);

    useEffect(() => {
        if (effectiveRate) {
            setCalculatedRate(removeTrailingZeros(roundOffDecimal(effectiveRate, setDecimalPlaces(effectiveRate, 6))));
        }
    }, [calculatedRate, effectiveRate, min_order_amount_limit]);

    useEffect(() => {
        if (isSuccess && orderCreatedInfo) {
            history.push(`${ORDERS_URL}/${orderCreatedInfo.id}`, { from: 'BuySell' });
            onCloseBuySellForm();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess, orderCreatedInfo, history]);

    useEffect(() => {
        if (isError && error?.message) {
            if (error.code === ERROR_CODES.ORDER_CREATE_FAIL_RATE_SLIPPAGE) {
                setIsHidden(true);
                showModal('ErrorModal', { shouldStackModals: false });
            } else {
                if (isModalOpenFor('RateFluctuationModal')) {
                    hideModal();
                    setIsHidden(false);
                }
                setErrorMessage(error?.message);
                scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }
        }
    }, [error?.code, error?.message, hideModal, isError, isModalOpenFor, showModal]);

    // This handles the case when counterparty changes the rate before the user confirms the order
    useEffect(() => {
        if (rate && !counterpartyRateRef.current) counterpartyRateRef.current = rate;

        if (
            counterpartyRateRef.current &&
            counterpartyRateRef.current !== rate &&
            !isModalOpenFor('RateFluctuationModal')
        ) {
            setIsHidden(true);
            setHasCounterpartyRateChanged(true);
            showModal('ErrorModal');
        }
    }, [isModalOpenFor, rate, showModal]);

    useEffect(() => {
        if (effectiveRate !== finalEffectiveRateRef.current && finalEffectiveRateRef.current) setHasRateChanged(true);
    }, [effectiveRate]);

    // This makes sure the final effective rate in the p2p_order_create payload is not updated when the rate fluctuation modal is open
    useEffect(() => {
        if (!isModalOpenFor('RateFluctuationModal')) finalEffectiveRateRef.current = effectiveRate;
    }, [effectiveRate, hasRateChanged, isModalOpenFor]);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <BuySellFormDisplayWrapper
                accountCurrency={account_currency as TCurrency}
                isBuy={isBuy}
                isHidden={isHidden}
                isModalOpen={isModalOpen}
                isValid={isValid && ((isBuy && selectedPaymentMethods.length > 0) || !isBuy)}
                onRequestClose={onCloseBuySellForm}
                onSubmit={onSubmit}
            >
                {errorMessage && (
                    <div className='px-[1.6rem] lg:px-[2.4rem] mt-[1.6rem] lg:mt-[2.4rem]'>
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
                    rateType={rate_type}
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
                    buySellAmount={buySellAmount}
                    calculatedRate={calculatedRate}
                    control={control as unknown as Control<FieldValues>}
                    inputValue={inputValue}
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
                    setBuySellAmount={setBuySellAmount}
                    setInputValue={setInputValue}
                    setValue={setValue as unknown as (name: string, value: string) => void}
                    trigger={trigger as unknown as () => Promise<boolean>}
                />
            </BuySellFormDisplayWrapper>
            {isModalOpenFor('RateFluctuationModal') && (
                <RateFluctuationModal
                    isModalOpen
                    onContinue={handleSubmit(onSubmit)}
                    onRequestClose={() => {
                        hideModal();
                        setIsHidden(false);
                        setHasRateChanged(false);
                    }}
                    values={{
                        currency: account_currency ?? '',
                        inputAmount: FormatUtils.formatMoney(Number(inputValue), {
                            currency: local_currency as TCurrency,
                        }),
                        localCurrency: local_currency,
                        receivedAmount: buySellAmount,
                    }}
                />
            )}
            {isModalOpenFor('ErrorModal') && (
                <ErrorModal
                    bodyClassName={clsx({ 'py-0 lg:py-4': !hasCounterpartyRateChanged })}
                    buttonText={hasCounterpartyRateChanged ? localize('Try again') : localize('Create new order')}
                    buttonTextSize={isMobile ? 'md' : 'sm'}
                    hideCloseIcon
                    isModalOpen
                    message={
                        hasCounterpartyRateChanged
                            ? localize('The advertiser changed the rate before you confirmed the order.')
                            : error?.message
                    }
                    onRequestClose={() => {
                        if (hasCounterpartyRateChanged) {
                            hideModal();
                            setHasCounterpartyRateChanged(false);
                            counterpartyRateRef.current = undefined;
                        } else {
                            hideModal({ shouldHidePreviousModals: true });
                            reset();
                        }
                        setHasRateChanged(false);
                        setIsHidden(false);
                    }}
                    showTitle={!hasCounterpartyRateChanged}
                    textSize='sm'
                    title={localize('Order unsuccessful')}
                />
            )}
        </form>
    );
};

export default BuySellForm;
