import { memo, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { NonUndefinedValues, TCurrency, TExchangeRate } from 'types';
import { PaymentMethodLabel, PopoverDropdown } from '@/components';
import { AD_ACTION, ADVERT_TYPE, RATE_TYPE } from '@/constants';
import { useFloatingRate } from '@/hooks/custom-hooks';
import { generateEffectiveRate, shouldShowTooltipIcon } from '@/utils';
import { useExchangeRates } from '@deriv-com/api-hooks';
import { Text, useDevice } from '@deriv-com/ui';
import { FormatUtils } from '@deriv-com/utils';
import { AdStatus, AdType, AlertComponent, ProgressIndicator } from '../../../components';
import { TMyAdsTableRowRendererProps } from '../MyAdsTable/MyAdsTable';
import './MyAdsTableRow.scss';

const BASE_CURRENCY = 'USD';

const getList = (isActive = false) => [
    { label: 'Edit', value: 'edit' },
    { label: 'Copy', value: 'copy' },
    { label: 'Share', value: 'share' },
    { label: `${isActive ? 'Deactivate' : 'Activate'}`, value: `${isActive ? 'deactivate' : 'activate'}` },
    { label: 'Delete', value: 'delete' },
];

type TProps = {
    currentRateType: ReturnType<typeof useFloatingRate>['rateType'];
    onClickIcon: (value: string) => void;
    showModal: (value: string) => void;
};

type TMyAdsTableProps = Omit<TMyAdsTableRowRendererProps, 'balanceAvailable' | 'dailyBuyLimit' | 'dailySellLimit'> &
    TProps;

const MyAdsTableRow = ({ currentRateType, showModal, ...rest }: NonUndefinedValues<TMyAdsTableProps>) => {
    const { isMobile } = useDevice();
    const { subscribeRates } = useExchangeRates();

    const {
        account_currency: accountCurrency = '',
        amount = 0,
        amount_display: amountDisplay,
        effective_rate: effectiveRate,
        id,
        is_active: isActive,
        isBarred,
        isListed,
        local_currency: localCurrency,
        max_order_amount_display: maxOrderAmountDisplay,
        min_order_amount_display: minOrderAmountDisplay,
        onClickIcon,
        payment_method_names: paymentMethodNames,
        price_display: priceDisplay,
        rate_display: rateDisplay = '',
        rate_type: rateType,
        remaining_amount: remainingAmount = 0,
        remaining_amount_display: remainingAmountDisplay,
        type,
        visibility_status: visibilityStatus = [],
    } = rest;

    const isFloatingRate = rateType === RATE_TYPE.FLOAT;

    const exchangeRateRef = useRef<TExchangeRate | null>(null);

    useEffect(() => {
        if (localCurrency) {
            exchangeRateRef.current = subscribeRates({
                base_currency: BASE_CURRENCY,
                target_currencies: [localCurrency],
            });
        }
    }, [localCurrency]);

    const [showAlertIcon, setShowAlertIcon] = useState(false);
    const isAdvertListed = isListed && !isBarred;
    const adPauseColor = isAdvertListed ? 'general' : 'less-prominent';
    const amountDealt = amount - remainingAmount;

    const isRowDisabled = !isActive || isBarred || !isListed;
    const isAdActive = !!isActive && !isBarred;

    const exchangeRate = exchangeRateRef.current?.rates?.[localCurrency ?? ''];
    const enableActionPoint = currentRateType !== rateType;

    useEffect(() => {
        setShowAlertIcon(enableActionPoint || shouldShowTooltipIcon(visibilityStatus) || !isListed);
    }, [enableActionPoint, isListed, shouldShowTooltipIcon]);

    const { displayEffectiveRate } = generateEffectiveRate({
        exchangeRate,
        localCurrency: localCurrency as TCurrency,
        marketRate: Number(effectiveRate),
        price: Number(priceDisplay),
        rate: Number(rateDisplay),
        rateType,
    });

    const advertType = type === 'buy' ? ADVERT_TYPE.BUY : ADVERT_TYPE.SELL;

    const handleClick = (action: string) => {
        if (action === AD_ACTION.EDIT || action === AD_ACTION.COPY) {
            if (enableActionPoint && rateType !== currentRateType) {
                showModal('AdRateSwitchModal');
                return;
            }
        }
        onClickIcon(action);
    };

    if (isMobile) {
        return (
            <div
                className={clsx('my-ads-table-row__line', {
                    'my-ads-table-row__line-disabled': isRowDisabled,
                })}
            >
                <Text color='less-prominent' size='sm'>
                    {`Ad ID ${id} `}
                </Text>
                <div className='my-ads-table-row__line__type-and-status'>
                    <Text color={adPauseColor} size='lg' weight='bold'>
                        {advertType} {accountCurrency}
                    </Text>
                    <div className='my-ads-table-row__line__type-and-status__wrapper'>
                        <AdStatus isActive={isAdActive} />
                        {showAlertIcon && <AlertComponent onClick={() => showModal('AdErrorTooltipModal')} />}
                        <PopoverDropdown
                            dropdownList={getList(isAdActive)}
                            onClick={handleClick}
                            tooltipMessage='Manage ad'
                        />
                    </div>
                </div>
                <div className='my-ads-table-row__line-details'>
                    <Text color='success' size='sm'>
                        {`${FormatUtils.formatMoney(amountDealt, { currency: accountCurrency as TCurrency })}`}{' '}
                        {accountCurrency}
                        &nbsp;
                        {advertType === 'Buy' ? 'Bought' : 'Sold'}
                    </Text>
                    <Text color='less-prominent' size='sm'>
                        {amountDisplay} {accountCurrency}
                    </Text>
                </div>
                <ProgressIndicator
                    className={'my-ads-table-row__available-progress'}
                    total={amount}
                    value={amountDealt}
                />
                <div className='my-ads-table-row__line-details'>
                    <Text color='less-prominent' size='sm'>
                        Limits
                    </Text>
                    <Text color='less-prominent' size='sm'>
                        {`Rate (1 ${accountCurrency})`}
                    </Text>
                </div>
                <div className='my-ads-table-row__line-details'>
                    <Text color={adPauseColor} size='sm'>
                        {minOrderAmountDisplay} - {maxOrderAmountDisplay} {accountCurrency}
                    </Text>
                    <Text color='success' weight='bold'>
                        <div className='display-layout'>
                            {displayEffectiveRate} {localCurrency}
                            {isFloatingRate && <AdType adPauseColor={adPauseColor} floatRate={rateDisplay} />}
                        </div>
                    </Text>
                </div>
                <div className='gap-2 my-ads-table-row__line-methods'>
                    {paymentMethodNames?.map(paymentMethod => (
                        <PaymentMethodLabel
                            color={adPauseColor}
                            key={paymentMethod}
                            paymentMethodName={paymentMethod}
                            size='xs'
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div
            className={clsx('my-ads-table-row__line', {
                'my-ads-table-row__line-disabled': isRowDisabled,
            })}
        >
            <Text size='sm'>
                {advertType} {id}
            </Text>
            <Text size='sm'>
                {minOrderAmountDisplay} - {maxOrderAmountDisplay} {accountCurrency}
            </Text>
            <Text className='my-ads-table-row__rate' size='sm'>
                {displayEffectiveRate} {localCurrency}
                {isFloatingRate && <AdType adPauseColor={adPauseColor} floatRate={rateDisplay} />}
            </Text>
            <Text className='my-ads-table-row__available' size='sm'>
                <ProgressIndicator
                    className={'my-ads-table-row__available-progress'}
                    total={amount}
                    value={remainingAmount}
                />
                {remainingAmountDisplay}/{amountDisplay} {accountCurrency}
            </Text>
            <div className='flex flex-wrap gap-2'>
                {paymentMethodNames?.map(paymentMethod => (
                    <PaymentMethodLabel
                        color={adPauseColor}
                        key={paymentMethod}
                        paymentMethodName={paymentMethod}
                        size='xs'
                    />
                ))}
            </div>
            <div className='my-ads-table-row__actions'>
                <AdStatus isActive={isAdActive} />
                <PopoverDropdown dropdownList={getList(isAdActive)} onClick={handleClick} tooltipMessage='Manage ad' />
                {showAlertIcon && <AlertComponent onClick={() => showModal('AdErrorTooltipModal')} />}
            </div>
        </div>
    );
};

export default memo(MyAdsTableRow);
