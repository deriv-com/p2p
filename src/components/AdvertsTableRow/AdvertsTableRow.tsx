import { Fragment, memo, MouseEvent, useEffect, useState } from 'react';
import clsx from 'clsx';
import { useHistory, useLocation } from 'react-router-dom';
import { TAdvertsTableRowRenderer, TCurrency } from 'types';
import { Badge, BuySellForm, PaymentMethodLabel, StarRating, UserAvatar } from '@/components';
import { ErrorModal, NicknameModal } from '@/components/Modals';
import { ADVERTISER_URL, BUY_SELL } from '@/constants';
import { api } from '@/hooks';
import { useIsAdvertiser, useIsAdvertiserBarred, useModalManager, usePoiPoaStatus } from '@/hooks/custom-hooks';
import { useAdvertiserInfoState } from '@/providers/AdvertiserInfoStateProvider';
import { generateEffectiveRate, getCurrentRoute, getEligibilityErrorMessage } from '@/utils';
import { LabelPairedChevronRightMdBoldIcon, StandaloneUserCheckFillIcon } from '@deriv/quill-icons';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Button, Text, Tooltip, useDevice } from '@deriv-com/ui';
import './AdvertsTableRow.scss';

const AdvertsTableRow = memo((props: TAdvertsTableRowRenderer) => {
    const [selectedAdvertId, setSelectedAdvertId] = useState<string | undefined>(undefined);
    const { hideModal, isModalOpenFor, showModal } = useModalManager();
    const { isDesktop, isTablet } = useDevice();
    const history = useHistory();
    const location = useLocation();
    const isBuySellPage = getCurrentRoute() === 'buy-sell';
    const isAdvertiserBarred = useIsAdvertiserBarred();
    const isAdvertiser = useIsAdvertiser();
    const { data } = api.advertiser.useGetInfo() || {};
    const { data: poiPoaData } = usePoiPoaStatus();
    const { isPoaVerified, isPoiVerified } = poiPoaData || {};
    const { localize } = useTranslations();
    const { hasCreatedAdvertiser } = useAdvertiserInfoState();

    const {
        account_currency: accountCurrency,
        advertiser_details: advertiserDetails,
        counterparty_type: counterpartyType,
        effective_rate: effectiveRate,
        eligibility_status: eligibilityStatus = [],
        id: advertId,
        is_eligible: isEligible,
        local_currency: localCurrency = '',
        max_order_amount_limit_display: maxOrderAmountLimitDisplay,
        min_order_amount_limit_display: minOrderAmountLimitDisplay,
        payment_method_names: paymentMethodNames,
        price_display: priceDisplay,
        rate,
        rate_type: rateType,
    } = props;

    const { exchangeRate } = api.exchangeRates.useGet(localCurrency);

    const Container = isDesktop ? Fragment : 'div';

    const {
        completed_orders_count: completedOrdersCount,
        id,
        is_favourite: isFollowing,
        is_online: isOnline,
        name,
        rating_average: ratingAverage,
        rating_count: ratingCount,
    } = advertiserDetails || {};

    const { displayEffectiveRate } = generateEffectiveRate({
        exchangeRate,
        localCurrency: localCurrency as TCurrency,
        marketRate: Number(effectiveRate),
        price: Number(priceDisplay),
        rate,
        rateType,
    });
    const hasRating = !!ratingAverage && !!ratingCount;
    const isBuyAdvert = counterpartyType === BUY_SELL.BUY;
    const isMyAdvert = data?.id === id;
    const ratingAverageDecimal = ratingAverage ? Number(ratingAverage).toFixed(1) : null;
    const textColor = isDesktop ? 'general' : 'less-prominent';
    const size = isDesktop ? 'sm' : 'md';
    const buttonTextSize = () => {
        if (isDesktop) return 'xs';
        else if (isTablet) return 'sm';
        return 'md';
    };

    const redirectToAdvertiser = () => {
        isAdvertiserBarred ? undefined : history.push(`${ADVERTISER_URL}/${id}?currency=${localCurrency}`);
    };

    useEffect(() => {
        // If the user has become an advertiser, open the BuySellForm modal specifically for the selected advert.
        if (hasCreatedAdvertiser && !isModalOpenFor('BuySellForm') && selectedAdvertId === advertId) {
            showModal('BuySellForm');
            setSelectedAdvertId(undefined);
        }
    }, [advertId, hasCreatedAdvertiser, isModalOpenFor, selectedAdvertId, showModal]);

    return (
        <div
            className={clsx('adverts-table-row', {
                'adverts-table-row--advertiser': !isBuySellPage,
            })}
        >
            <Container>
                {isBuySellPage && (
                    <div
                        className={clsx('flex gap-4 items-center mb-[1.6rem] lg:mb-0 relative', {
                            'cursor-pointer': !isAdvertiserBarred,
                        })}
                        onClick={redirectToAdvertiser}
                    >
                        <UserAvatar
                            isOnline={isOnline}
                            nickname={name || ''}
                            showOnlineStatus
                            size={isDesktop ? 24 : 32}
                            textSize={isDesktop ? 'xs' : 'sm'}
                        />
                        <div className='flex flex-col'>
                            <div
                                className={clsx('flex flex-row items-center gap-2', {
                                    'mb-[-0.5rem]': hasRating,
                                })}
                            >
                                <Text size={size} weight={isDesktop ? 400 : 'bold'}>
                                    {name}
                                </Text>
                                {!!completedOrdersCount && completedOrdersCount >= 100 && (
                                    <Badge tradeCount={completedOrdersCount} />
                                )}
                                {isFollowing && (
                                    <Tooltip
                                        as='button'
                                        onClick={(event: MouseEvent<HTMLButtonElement>) => event.stopPropagation()}
                                        tooltipContent={localize('Following')}
                                    >
                                        <div className='bg-[#333] p-[0.2rem] rounded-lg flex'>
                                            <StandaloneUserCheckFillIcon fill='#FFF' iconSize='xs' />
                                        </div>
                                    </Tooltip>
                                )}
                            </div>
                            <div className='flex items-center'>
                                {hasRating ? (
                                    <>
                                        <Text className='lg:mr-0' color='less-prominent' size='xs'>
                                            {ratingAverageDecimal}
                                        </Text>
                                        <StarRating
                                            allowFraction
                                            isReadonly
                                            ratingValue={Number(ratingAverageDecimal)}
                                            starsScale={isDesktop ? 0.9 : 0.7}
                                        />
                                        <Text
                                            className='adverts-table-row__rating-count'
                                            color='less-prominent'
                                            size='xs'
                                        >
                                            ({ratingCount})
                                        </Text>
                                    </>
                                ) : (
                                    <Text color='less-prominent' size='xs'>
                                        <Localize i18n_default_text='Not rated yet' />
                                    </Text>
                                )}
                            </div>
                        </div>

                        {!isDesktop && isBuySellPage && (
                            <LabelPairedChevronRightMdBoldIcon
                                className='absolute right-0 top-0'
                                onClick={redirectToAdvertiser}
                            />
                        )}
                    </div>
                )}
                <Container {...(!isDesktop && { className: 'flex justify-between' })}>
                    <Container
                        {...(!isDesktop && { className: clsx('flex flex-col', { 'mt-3 ml-14': isBuySellPage }) })}
                    >
                        {!isDesktop && (
                            <Text
                                color={isBuySellPage ? 'general' : 'less-prominent'}
                                size={isBuySellPage ? 'xs' : 'sm'}
                            >
                                <Localize i18n_default_text='Rate (1 USD)' />
                            </Text>
                        )}
                        <Container {...(!isDesktop && { className: 'flex flex-col-reverse mb-7' })}>
                            <Text color={textColor} size='sm'>
                                {!isDesktop && localize('Limits:')} {minOrderAmountLimitDisplay}-
                                {maxOrderAmountLimitDisplay} {accountCurrency}
                            </Text>
                            <Text className='text-wrap w-[90%]' color='success' size={size} weight='bold'>
                                {displayEffectiveRate} {localCurrency}
                            </Text>
                        </Container>
                        <div className='flex flex-wrap gap-2'>
                            {paymentMethodNames ? (
                                paymentMethodNames.map((method: string, idx: number) => (
                                    <PaymentMethodLabel
                                        color='general'
                                        key={idx}
                                        paymentMethodName={method}
                                        size={isDesktop ? 'sm' : 'xs'}
                                    />
                                ))
                            ) : (
                                <PaymentMethodLabel color='general' paymentMethodName='-' />
                            )}
                        </div>
                    </Container>
                    {!isMyAdvert && (
                        <div
                            className={clsx('flex relative', {
                                'flex-col h-full justify-center items-end': isBuySellPage,
                                'flex-row justify-end': !isBuySellPage,
                            })}
                        >
                            {isEligible === 0 ? (
                                <Button
                                    className='border px-[1.6rem]'
                                    color='black'
                                    onClick={() => showModal('ErrorModal')}
                                    size={size}
                                    textSize={buttonTextSize()}
                                    variant='outlined'
                                >
                                    <Localize i18n_default_text='Unavailable' />
                                </Button>
                            ) : (
                                <Button
                                    className='lg:min-w-[7.5rem]'
                                    disabled={isAdvertiserBarred}
                                    onClick={() => {
                                        if (!isAdvertiser && (!isPoaVerified || !isPoiVerified)) {
                                            const searchParams = new URLSearchParams(location.search);
                                            searchParams.set('poi_poa_verified', 'false');
                                            history.replace({
                                                pathname: location.pathname,
                                                search: searchParams.toString(),
                                            });
                                        } else {
                                            setSelectedAdvertId(advertId);
                                            showModal(isAdvertiser ? 'BuySellForm' : 'NicknameModal');
                                        }
                                    }}
                                    size={size}
                                    textSize={buttonTextSize()}
                                >
                                    {isBuyAdvert ? localize('Buy') : localize('Sell')} {accountCurrency}
                                </Button>
                            )}
                        </div>
                    )}
                </Container>
            </Container>
            {isModalOpenFor('BuySellForm') && (
                <BuySellForm
                    advertId={advertId}
                    isModalOpen={!!isModalOpenFor('BuySellForm')}
                    onRequestClose={hideModal}
                />
            )}
            {isModalOpenFor('NicknameModal') && <NicknameModal isModalOpen onRequestClose={hideModal} />}
            {isModalOpenFor('ErrorModal') && (
                <ErrorModal
                    isModalOpen
                    message={getEligibilityErrorMessage(eligibilityStatus, localize)}
                    onRequestClose={hideModal}
                    showTitle={false}
                />
            )}
        </div>
    );
});

AdvertsTableRow.displayName = 'AdvertsTableRow';
export default AdvertsTableRow;
