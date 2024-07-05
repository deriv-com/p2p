import { ChangeEvent, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { TCurrency } from 'types';
import { LightDivider } from '@/components';
import { VALID_SYMBOLS_PATTERN } from '@/constants';
import { floatingPointValidator, getTextFieldError, restrictDecimalPlace } from '@/utils';
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
                        {`Enter ${isBuy ? 'sell' : 'buy'} amount`}
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
                                        label={`${isBuy ? 'Sell' : 'Buy'} amount`}
                                        message={
                                            error ? error?.message : `Limit: ${minLimit}-${maxLimit} ${accountCurrency}`
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
                                message: `Maximum is ${maxLimit}${accountCurrency}`,
                                value: maxLimit,
                            },
                            min: {
                                message: `Minimum is ${minLimit}${accountCurrency}`,
                                value: minLimit,
                            },
                            required: 'Enter a valid amount',
                        }}
                    />
                </div>
                {!isDesktop && <LightDivider />}
                {isDesktop && (
                    <div className='buy-sell-amount__value'>
                        <Text color='less-prominent' size={labelSize}>{`You'll ${isBuy ? 'receive' : 'send'}`}</Text>
                        <Text size='sm' weight='bold'>
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
                                                        : 'Bank name, account number, beneficiary name'
                                                }
                                                isInvalid={!!error}
                                                label='Your bank details'
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
                                        message: getTextFieldError('Bank details'),
                                        value: VALID_SYMBOLS_PATTERN,
                                    },
                                    required: 'Bank details is required',
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
                                    label='Your contact details'
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
                                message: getTextFieldError('Contact details'),
                                value: VALID_SYMBOLS_PATTERN,
                            },
                            required: 'Contact details is required',
                        }}
                    />
                </div>
            )}
            {!isDesktop && (
                <>
                    <LightDivider />
                    <div className='buy-sell-amount__value'>
                        <Text color='less-prominent' size={labelSize}>{`You'll ${isBuy ? 'receive' : 'send'}`}</Text>
                        <Text size='md' weight='bold'>
                            {buySellAmount} {localCurrency}
                        </Text>
                    </div>
                </>
            )}
        </div>
    );
};

export default BuySellAmount;
