import { ChangeEvent, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { TCurrency } from 'types';
import { LightDivider } from '@/components';
import { VALID_SYMBOLS_PATTERN } from '@/constants';
import { floatingPointValidator, getTextFieldError, restrictDecimalPlace } from '@/utils';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Input, Text, TextArea, useDevice } from '@deriv-com/ui';
import { FormatUtils } from '@deriv-com/utils';
import './BuySellAmount.scss';

type TBuySellAmountProps = {
    accountCurrency: string;
    buySellAmount: string;
    calculatedRate: string;
    control: ReturnType<typeof useForm>['control'];
    inputValue: string;
    isBuy: boolean;
    isDisabled: boolean;
    localCurrency: TCurrency;
    maxLimit: string;
    minLimit: string;
    paymentMethodNames?: string[];
    setBuySellAmount: (value: string) => void;
    setInputValue: (value: string) => void;
    setValue: ReturnType<typeof useForm>['setValue'];
    trigger: ReturnType<typeof useForm>['trigger'];
};
const BuySellAmount = ({
    accountCurrency,
    buySellAmount,
    calculatedRate,
    control,
    inputValue,
    isBuy,
    isDisabled,
    localCurrency,
    maxLimit,
    minLimit,
    paymentMethodNames,
    setBuySellAmount,
    setInputValue,
    setValue,
    trigger,
}: TBuySellAmountProps) => {
    const { isDesktop } = useDevice();
    const labelSize = isDesktop ? 'xs' : 'sm';
    const { localize } = useTranslations();

    useEffect(() => {
        setBuySellAmount(
            FormatUtils.formatMoney(Number(inputValue) * Number(calculatedRate), {
                currency: localCurrency,
            })
        );
    }, [calculatedRate, inputValue, localCurrency, setBuySellAmount]);

    // This is needed as minLimit can be passed as the default 0 on first time render
    // causing the amount to be 0
    useEffect(() => {
        setInputValue(minLimit);
        setValue('amount', minLimit);
        trigger('amount');
    }, [minLimit, setInputValue, setValue, trigger]);

    return (
        <div className='flex flex-col gap-[2rem] py-[1.6rem]'>
            <div className='flex w-full'>
                <div className='flex flex-col gap-[2rem] w-full'>
                    <Text className='px-[1.6rem] lg:px-[2.4rem]' color='less-prominent' size='sm'>
                        <Localize
                            i18n_default_text='Enter {{buySell}} amount'
                            values={{ buySell: isBuy ? localize('sell') : localize('buy') }}
                        />
                    </Text>
                    <Controller
                        control={control}
                        name='amount'
                        render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => {
                            const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
                                setInputValue(event.target.value);
                                onChange(event);
                            };
                            return (
                                <div className='px-[1.6rem] lg:px-[2.4rem] pr-6 '>
                                    <Input
                                        className='mb-[0.2rem]'
                                        data-lpignore='true'
                                        disabled={isDisabled}
                                        error={!!error?.message}
                                        isFullWidth
                                        label={`${isBuy ? localize('Sell') : localize('Buy')} ${localize('amount')}`}
                                        message={
                                            error
                                                ? error?.message
                                                : `${localize('Limit')}: ${minLimit}-${maxLimit} ${accountCurrency}`
                                        }
                                        min={0}
                                        name='amount'
                                        onBlur={onBlur}
                                        onChange={event => restrictDecimalPlace(event, handleChange)}
                                        onKeyDown={event => {
                                            if (!floatingPointValidator(event.key)) {
                                                event.preventDefault();
                                            }
                                        }}
                                        rightPlaceholder={
                                            <Text color='less-prominent' size='sm'>
                                                {accountCurrency}
                                            </Text>
                                        }
                                        step='any'
                                        type='number'
                                        value={value}
                                    />
                                </div>
                            );
                        }}
                        rules={{
                            max: {
                                message: `${localize('Maximum is')} ${maxLimit}${accountCurrency}`,
                                value: maxLimit,
                            },
                            min: {
                                message: `${localize('Minimum is')} ${minLimit}${accountCurrency}`,
                                value: minLimit,
                            },
                            required: localize('Enter a valid amount'),
                        }}
                    />
                </div>
                {!isDesktop && <LightDivider />}
                {isDesktop && (
                    <div className='buy-sell-amount__value'>
                        <Text color='less-prominent' size={labelSize}>
                            <Localize
                                i18n_default_text='You’ll {{receiveSend}}'
                                values={{ receiveSend: isBuy ? localize('receive') : localize('send') }}
                            />
                        </Text>
                        <Text data-testid='dt_buy_sell_amount_value' size='sm' weight='bold'>
                            {buySellAmount}&nbsp;{localCurrency}
                        </Text>
                    </div>
                )}
            </div>
            {isBuy && (
                <div className='flex flex-col gap-[1.6rem]'>
                    {!paymentMethodNames?.length && (
                        <>
                            <LightDivider />
                            <Controller
                                control={control}
                                name='bank_details'
                                render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => {
                                    return (
                                        <div className='px-[1.6rem] lg:px-[2.4rem] pt-[1.8rem]'>
                                            <TextArea
                                                hint={
                                                    error
                                                        ? error.message
                                                        : localize('Bank name, account number, beneficiary name')
                                                }
                                                isInvalid={!!error}
                                                label={localize('Your bank details')}
                                                maxLength={300}
                                                onBlur={onBlur}
                                                onChange={onChange}
                                                shouldShowCounter
                                                textSize='sm'
                                                value={value}
                                            />
                                        </div>
                                    );
                                }}
                                rules={{
                                    pattern: {
                                        message: getTextFieldError(localize('Bank details')),
                                        value: VALID_SYMBOLS_PATTERN,
                                    },
                                    required: localize('Bank details is required'),
                                }}
                            />
                        </>
                    )}
                    <LightDivider />
                    <Controller
                        control={control}
                        name='contact_details'
                        render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                            <div className='px-[1.6rem] lg:px-[2.4rem]'>
                                <TextArea
                                    hint={error ? error.message : ''}
                                    isInvalid={!!error}
                                    label={localize('Your contact details')}
                                    maxLength={300}
                                    onBlur={onBlur}
                                    onChange={onChange}
                                    shouldShowCounter
                                    textSize='sm'
                                    value={value}
                                />
                            </div>
                        )}
                        rules={{
                            pattern: {
                                message: getTextFieldError(localize('Contact details')),
                                value: VALID_SYMBOLS_PATTERN,
                            },
                            required: localize('Contact details is required'),
                        }}
                    />
                </div>
            )}
            {!isDesktop && (
                <>
                    <LightDivider />
                    <div className='buy-sell-amount__value'>
                        <Text color='less-prominent' size={labelSize}>{`You'll ${isBuy ? 'receive' : 'send'}`}</Text>
                        <Text data-testid='dt_buy_sell_amount_value' size='md' weight='bold'>
                            {buySellAmount} {localCurrency}
                        </Text>
                    </div>
                </>
            )}
        </div>
    );
};

export default BuySellAmount;
