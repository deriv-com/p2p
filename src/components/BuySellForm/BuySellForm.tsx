import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { Control, FieldValues, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { TCurrency, THooks, TPaymentMethod } from 'types';
import { ErrorModal, LoadingModal, RateFluctuationModal } from '@/components/Modals';
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
import { Localize, useTranslations } from '@deriv-com/translations';
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
        if (advertiserSellLimit < Number(maxOrderAmountLimitDisplay)) return roundOffDecimal(advertiserSellLimit);
    } else if (advertiserBuyLimit < Number(maxOrderAmountLimitDisplay)) return roundOffDecimal(advertiserBuyLimit);
    return maxOrderAmountLimitDisplay;
};

const BuySellForm = ({ advertId, isModalOpen, onRequestClose }: TBuySellFormProps) => {
    const { localize } = useTranslations();
    const { hideModal, isModalOpenFor, showModal } = useModalManager();
    const { data: advertInfo, isLoading, subscribe, unsubscribe } = api.advert.useSubscribe();
    const { data: orderCreatedInfo, error, isError, isSuccess, mutate, reset } = api.order.useCreate();
    const { data: paymentMethods } = api.paymentMethods.useGet();
    const { data: advertiserPaymentMethods, get } = api.advertiserPaymentMethods.useGet();
    const { data } = api.advertiser.useGetInfo() || {};
    const { data: balanceData } = api.account.useBalance();
    const [errorMessage, setErrorMessage] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isHidden, setIsHidden] = useState(false);
    const {
        balance_available: balanceAvailable = '',
        contact_info: contactInfo = '',
        daily_buy: dailyBuy = 0,
        daily_buy_limit: dailyBuyLimit = 0,
        daily_sell: dailySell = 0,
        daily_sell_limit: dailySellLimit = 0,
    } = data || {};

    const isAdvertiser = useIsAdvertiser();
    const invalidate = useInvalidateQuery();

    const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<number[]>([]);
    const [calculatedRate, setCalculatedRate] = useState('0');
    const [buySellAmount, setBuySellAmount] = useState('0');
    const [showLowBalanceError, setShowLowBalanceError] = useState(false);

    const {
        account_currency: accountCurrency = '',
        advertiser_details: advertiserDetails,
        description,
        effective_rate: adEffectiveRate,
        id,
        local_currency: localCurrency = '',
        max_order_amount_limit_display: maxOrderAmountLimitDisplay,
        min_order_amount_limit: minOrderAmountLimit,
        min_order_amount_limit_display: minOrderAmountLimitDisplay,
        order_expiry_period: orderExpiryPeriod,
        payment_method_names: paymentMethodNames,
        price_display: priceDisplay,
        rate,
        rate_type: rateType,
        type,
    } = advertInfo || {};

    const { exchangeRate } = api.exchangeRates.useGet(localCurrency);

    const [hasCounterpartyRateChanged, setHasCounterpartyRateChanged] = useState(false);
    const [hasRateChanged, setHasRateChanged] = useState(false);
    const [inputValue, setInputValue] = useState(minOrderAmountLimitDisplay ?? '0');
    const finalEffectiveRateRef = useRef<number | undefined>(undefined);
    const counterpartyRateRef = useRef<number | undefined>(undefined);

    useEffect(() => {
        if (isAdvertiser || advertiserPaymentMethods === undefined) {
            get();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAdvertiser, advertiserPaymentMethods]);

    const { displayEffectiveRate, effectiveRate } = generateEffectiveRate({
        exchangeRate,
        localCurrency: localCurrency as TCurrency,
        marketRate: Number(adEffectiveRate),
        price: Number(priceDisplay),
        rate,
        rateType,
    });

    const advertiserPaymentMethodObjects = getPaymentMethodObjects(
        advertiserPaymentMethods as THooks.AdvertiserPaymentMethods.Get
    );

    const paymentMethodObjects = getPaymentMethodObjects(paymentMethods as THooks.PaymentMethods.Get);

    const availablePaymentMethods = paymentMethodNames?.map(paymentMethod => {
        const isAvailable = advertiserPaymentMethods?.some(method => method.display_name === paymentMethod);
        return {
            ...(isAvailable ? advertiserPaymentMethodObjects[paymentMethod] : paymentMethodObjects[paymentMethod]),
            isAvailable,
        };
    });

    const filteredAdvertiserPaymentMethods = advertiserPaymentMethods?.filter(method =>
        paymentMethodNames?.includes(method.display_name || '')
    );

    const history = useHistory();
    const { isDesktop } = useDevice();
    const isBuy = type === BUY_SELL.BUY;
    const hasSelectedPaymentMethods =
        (!paymentMethodNames && selectedPaymentMethods.length < 1) || selectedPaymentMethods.length > 0;

    const shouldDisableField =
        (isBuy &&
            (parseFloat(balanceAvailable.toString()) === 0 ||
                parseFloat(balanceAvailable.toString()) < (minOrderAmountLimit ?? 1))) ||
        showLowBalanceError;

    const {
        control,
        formState: { isValid },
        getValues,
        handleSubmit,
        setValue,
        trigger,
    } = useForm({
        defaultValues: {
            amount: minOrderAmountLimit ?? 1,
            bank_details: '',
            contact_details: contactInfo,
        },
        mode: 'all',
    });

    const onSubmit = () => {
        if (hasRateChanged && !isModalOpenFor('RateFluctuationModal')) {
            setIsHidden(true);
            showModal('RateFluctuationModal', { shouldStackModals: false });
            return;
        }
        const rateValue = rateType === RATE_TYPE.FIXED ? null : finalEffectiveRateRef.current;
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

    const getErrorModalTitle = () => {
        if (error?.code === ERROR_CODES.CLIENT_SCHEDULE_AVAILABILITY) return localize('Outside business hours');
        else if (error?.code === ERROR_CODES.ADVERTISER_SCHEDULE_AVAILABILITY) return localize('Ad not available');
        return localize('Order unsuccessful');
    };

    const getErrorButtonText = () => {
        if (
            error?.code === ERROR_CODES.CLIENT_SCHEDULE_AVAILABILITY ||
            error?.code === ERROR_CODES.ADVERTISER_SCHEDULE_AVAILABILITY
        )
            return undefined;

        if (hasCounterpartyRateChanged) return localize('Try again');

        return localize('Create new order');
    };

    useEffect(() => {
        if (advertId) subscribe({ id: advertId });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [advertId]);

    useEffect(() => {
        if (effectiveRate) {
            setCalculatedRate(removeTrailingZeros(roundOffDecimal(effectiveRate, setDecimalPlaces(effectiveRate, 6))));
        }
    }, [calculatedRate, effectiveRate, minOrderAmountLimit]);

    useEffect(() => {
        if (isSuccess && orderCreatedInfo) {
            history.push(`${ORDERS_URL}/${orderCreatedInfo.id}`, { from: 'BuySell' });
            onCloseBuySellForm();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess, orderCreatedInfo, history]);

    useEffect(() => {
        if (isError && error?.message) {
            if (
                error.code === ERROR_CODES.ORDER_CREATE_FAIL_RATE_SLIPPAGE ||
                error.code === ERROR_CODES.CLIENT_SCHEDULE_AVAILABILITY ||
                error.code === ERROR_CODES.ADVERTISER_SCHEDULE_AVAILABILITY
            ) {
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

    useEffect(() => {
        const isLowBalance =
            balanceData.balance !== undefined &&
            minOrderAmountLimit !== undefined &&
            isBuy &&
            (balanceData.balance === 0 || balanceData.balance < minOrderAmountLimit);

        setShowLowBalanceError(isLowBalance);
    }, [balanceData.balance, isBuy, minOrderAmountLimit]);

    if (isLoading) return <LoadingModal isModalOpen />;

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <BuySellFormDisplayWrapper
                accountCurrency={accountCurrency as TCurrency}
                isBuy={isBuy}
                isHidden={isHidden}
                isModalOpen={isModalOpen}
                isValid={
                    isValid &&
                    (!isBuy ||
                        hasSelectedPaymentMethods ||
                        (isBuy && hasSelectedPaymentMethods && !showLowBalanceError))
                }
                onRequestClose={onCloseBuySellForm}
                onSubmit={onSubmit}
            >
                {(errorMessage || showLowBalanceError) && (
                    <div className='px-[1.6rem] lg:px-[2.4rem] mt-[1.6rem] lg:mt-[2.4rem]'>
                        <InlineMessage variant='error'>
                            <Text size={!isDesktop ? 'xs' : '2xs'}>
                                {showLowBalanceError ? (
                                    <Localize i18n_default_text="Your Deriv P2P balance isn't enough. Please increase your balance before trying again." />
                                ) : (
                                    errorMessage
                                )}
                            </Text>
                        </InlineMessage>
                    </div>
                )}
                <BuySellData
                    accountCurrency={accountCurrency as TCurrency}
                    expiryPeriod={orderExpiryPeriod ?? 3600}
                    instructions={description ?? '-'}
                    isBuy={isBuy}
                    localCurrency={localCurrency as TCurrency}
                    name={advertiserDetails?.name ?? ''}
                    paymentMethodNames={paymentMethodNames}
                    paymentMethods={paymentMethods as THooks.PaymentMethods.Get}
                    rate={displayEffectiveRate}
                    rateType={rateType}
                    ref={scrollRef}
                />
                <LightDivider />
                {isBuy && paymentMethodNames && paymentMethodNames?.length > 0 && (
                    <BuySellPaymentSection
                        advertiserPaymentMethods={filteredAdvertiserPaymentMethods as TPaymentMethod[]}
                        availablePaymentMethods={availablePaymentMethods as TPaymentMethod[]}
                        isDisabled={shouldDisableField}
                        onSelectPaymentMethodCard={onSelectPaymentMethodCard}
                        selectedPaymentMethodIds={selectedPaymentMethods}
                        setIsHidden={setIsHidden}
                    />
                )}
                <BuySellAmount
                    accountCurrency={accountCurrency as TCurrency}
                    buySellAmount={buySellAmount}
                    calculatedRate={calculatedRate}
                    control={control as unknown as Control<FieldValues>}
                    inputValue={inputValue}
                    isBuy={isBuy}
                    isDisabled={shouldDisableField}
                    localCurrency={localCurrency as TCurrency}
                    maxLimit={getAdvertiserMaxLimit(
                        isBuy,
                        Number(dailyBuyLimit) - Number(dailyBuy),
                        Number(dailySellLimit) - Number(dailySell),
                        maxOrderAmountLimitDisplay ?? '0'
                    )}
                    minLimit={minOrderAmountLimitDisplay ?? '0'}
                    paymentMethodNames={paymentMethodNames}
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
                        currency: accountCurrency ?? '',
                        inputAmount: FormatUtils.formatMoney(Number(inputValue), {
                            currency: localCurrency as TCurrency,
                        }),
                        localCurrency,
                        receivedAmount: buySellAmount,
                    }}
                />
            )}
            {isModalOpenFor('ErrorModal') && (
                <ErrorModal
                    bodyClassName={clsx({ 'py-0 lg:py-4': !hasCounterpartyRateChanged })}
                    buttonText={getErrorButtonText()}
                    buttonTextSize={!isDesktop ? 'md' : 'sm'}
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
                        } else if (
                            error?.code === ERROR_CODES.CLIENT_SCHEDULE_AVAILABILITY ||
                            error?.code === ERROR_CODES.ADVERTISER_SCHEDULE_AVAILABILITY
                        ) {
                            hideModal({ shouldHideAllModals: true });
                            reset();
                        } else {
                            hideModal({ shouldHidePreviousModals: true });
                            reset();
                        }
                        setHasRateChanged(false);
                        setIsHidden(false);
                    }}
                    showTitle={!hasCounterpartyRateChanged}
                    textSize='sm'
                    title={getErrorModalTitle()}
                />
            )}
        </form>
    );
};

export default BuySellForm;
