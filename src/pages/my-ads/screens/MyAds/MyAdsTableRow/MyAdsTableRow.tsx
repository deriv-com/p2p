import { memo, useEffect, useState } from 'react';
import clsx from 'clsx';
import { TCurrency, TLocalize } from 'types';
import { PaymentMethodLabel, PopoverDropdown } from '@/components';
import { AD_ACTION, ADVERT_TYPE, RATE_TYPE } from '@/constants';
import { api } from '@/hooks';
import { useFloatingRate } from '@/hooks/custom-hooks';
import { generateEffectiveRate, shouldShowTooltipIcon } from '@/utils';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';
import { FormatUtils } from '@deriv-com/utils';
import { AdStatus, AdType, AlertComponent, ProgressIndicator } from '../../../components';
import { TMyAdsTableRowRendererProps } from '../MyAdsTable/MyAdsTable';
import './MyAdsTableRow.scss';

const getList = (localize: TLocalize, isActive = false) => [
    { label: localize('Edit'), value: 'edit' },
    { label: localize('Copy'), value: 'copy' },
    { label: localize('Share'), value: 'share' },
    {
        label: `${isActive ? localize('Deactivate') : localize('Activate')}`,
        value: `${isActive ? 'deactivate' : 'activate'}`,
    },
    { label: localize('Delete'), value: 'delete' },
];

type TProps = {
    currentRateType: ReturnType<typeof useFloatingRate>['rateType'];
    onClickIcon: (value: string) => void;
    showModal: (value: string) => void;
};

type TMyAdsTableProps = Omit<
    TMyAdsTableRowRendererProps,
    'advertiserPaymentMethods' | 'balanceAvailable' | 'dailyBuyLimit' | 'dailySellLimit'
> &
    TProps;

const MyAdsTableRow = ({ currentRateType, showModal, ...rest }: TMyAdsTableProps) => {
    const { localize } = useTranslations();
    const { isDesktop } = useDevice();

    const {
        account_currency: accountCurrency = '',
        amount = 0,
        amount_display: amountDisplay,
        effective_rate: effectiveRate,
        id,
        is_active: isActive,
        isBarred,
        isListed,
        local_currency: localCurrency = '',
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

    const { exchangeRate } = api.exchangeRates.useGet(localCurrency);

    const isFloatingRate = rateType === RATE_TYPE.FLOAT;

    const [showAlertIcon, setShowAlertIcon] = useState(false);
    const isAdvertListed = isListed && !isBarred;
    const adPauseColor = isAdvertListed ? 'general' : 'less-prominent';
    const amountDealt = amount - remainingAmount;

    const isRowDisabled = !isActive || isBarred || !isListed;
    const isAdActive = !!isActive && !isBarred;

    const enableActionPoint = currentRateType !== rateType;

    useEffect(() => {
        setShowAlertIcon(enableActionPoint || shouldShowTooltipIcon(visibilityStatus) || !isAdvertListed);
    }, [enableActionPoint, isAdvertListed, visibilityStatus]);

    const { displayEffectiveRate } = generateEffectiveRate({
        exchangeRate,
        localCurrency: localCurrency as TCurrency,
        marketRate: Number(effectiveRate),
        price: Number(priceDisplay),
        rate: Number(rateDisplay),
        rateType,
    });

    const advertType = type === 'buy' ? localize(ADVERT_TYPE.BUY) : localize(ADVERT_TYPE.SELL);

    const handleClick = (action: string) => {
        if (action === AD_ACTION.EDIT || action === AD_ACTION.COPY) {
            if (enableActionPoint && rateType !== currentRateType) {
                showModal('AdRateSwitchModal');
                return;
            }
        }
        onClickIcon(action);
    };

    if (!isDesktop) {
        return (
            <div
                className={clsx('my-ads-table-row__line', {
                    'my-ads-table-row__line-disabled': isRowDisabled,
                })}
                data-testid='dt_my_ads_table_row_line'
            >
                <Text color='less-prominent' data-testid='dt_ad_id' size='sm'>
                    <Localize i18n_default_text='Ad ID {{id}}' values={{ id }} />
                </Text>
                <div className='my-ads-table-row__line__type-and-status'>
                    <Text color={adPauseColor} data-testid='dt_ad_type' size='lg' weight='bold'>
                        {advertType} {accountCurrency}
                    </Text>
                    <div className='my-ads-table-row__line__type-and-status__wrapper' data-testid='dt_ad_status'>
                        <AdStatus isActive={isAdActive} />
                        {showAlertIcon && <AlertComponent onClick={() => showModal('AdErrorTooltipModal')} />}
                        <PopoverDropdown
                            dropdownList={getList(localize, isAdActive)}
                            onClick={handleClick}
                            tooltipMessage={localize('Manage ad')}
                        />
                    </div>
                </div>
                <div className='my-ads-table-row__line-details'>
                    <Text color='success' data-testid='dt_amount_transactioned' size='sm'>
                        {`${FormatUtils.formatMoney(amountDealt, { currency: accountCurrency as TCurrency })}`}{' '}
                        {accountCurrency}
                        &nbsp;
                        {advertType === 'Buy' ? localize('Bought') : localize('Sold')}
                    </Text>
                    <Text color='less-prominent' data-testid='dt_available_amount_displayed' size='sm'>
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
                        <Localize i18n_default_text='Limits' />
                    </Text>
                    <Text color='less-prominent' size='sm'>
                        <Localize i18n_default_text='Rate (1 {{accountCurrency}})' values={{ accountCurrency }} />
                    </Text>
                </div>
                <div className='my-ads-table-row__line-details'>
                    <Text color={adPauseColor} data-testid='dt_min_max_limit' size='sm'>
                        {minOrderAmountDisplay} - {maxOrderAmountDisplay} {accountCurrency}
                    </Text>
                    <Text color='success' weight='bold'>
                        <div className='display-layout' data-testid='dt_rate_value'>
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
                    <PaymentMethodLabel color={adPauseColor} key={paymentMethod} paymentMethodName={paymentMethod} />
                ))}
            </div>
            <div className='my-ads-table-row__actions'>
                <AdStatus isActive={isAdActive} />
                <PopoverDropdown
                    dropdownList={getList(localize, isAdActive)}
                    onClick={handleClick}
                    tooltipMessage={localize('Manage ad')}
                />
                {showAlertIcon && <AlertComponent onClick={() => showModal('AdErrorTooltipModal')} />}
            </div>
        </div>
    );
};

export default memo(MyAdsTableRow);
