import { Fragment, memo, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { useHistory, useLocation } from 'react-router-dom';
import { TAdvertsTableRowRenderer, TCurrency } from 'types';
import { Badge, BuySellForm, PaymentMethodLabel, StarRating, UserAvatar } from '@/components';
import { ErrorModal, NicknameModal } from '@/components/Modals';
import { ADVERTISER_URL, BUY_SELL } from '@/constants';
import { api } from '@/hooks';
import { useIsAdvertiser, useIsAdvertiserBarred, useModalManager, usePoiPoaStatus } from '@/hooks/custom-hooks';
import { generateEffectiveRate, getCurrentRoute, getEligibilityErrorMessage } from '@/utils';
import { LabelPairedChevronRightMdRegularIcon } from '@deriv/quill-icons';
import { useExchangeRates } from '@deriv-com/api-hooks';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Button, Text, useDevice } from '@deriv-com/ui';
import './AdvertsTableRow.scss';

const BASE_CURRENCY = 'USD';

const AdvertsTableRow = memo((props: TAdvertsTableRowRenderer) => {
    const { hideModal, isModalOpenFor, showModal } = useModalManager();
    const { data: exchangeRateData, subscribeRates } = useExchangeRates();
    const { isMobile } = useDevice();
    const history = useHistory();
    const location = useLocation();
    const isBuySellPage = getCurrentRoute() === 'buy-sell';
    const isAdvertiserBarred = useIsAdvertiserBarred();
    const isAdvertiser = useIsAdvertiser();
    const { data } = api.advertiser.useGetInfo() || {};
    const { data: poiPoaData } = usePoiPoaStatus();
    const { isPoaVerified, isPoiVerified } = poiPoaData || {};
    const { localize } = useTranslations();

    const exchangeRateRef = useRef<number | undefined>(undefined);

    const {
        account_currency,
        advertiser_details,
        counterparty_type,
        effective_rate,
        eligibility_status: eligibilityStatus = [],
        id: advertId,
        is_eligible: isEligible,
        local_currency = '',
        max_order_amount_limit_display,
        min_order_amount_limit_display,
        payment_method_names,
        price_display,
        rate,
        rate_type,
    } = props;

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
        const rate = exchangeRateData?.exchange_rates?.rates?.[local_currency];
        if (typeof rate === 'number') {
            exchangeRateRef.current = rate;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [exchangeRateData]);

    const Container = isMobile ? 'div' : Fragment;

    const { completed_orders_count, id, is_online, name, rating_average, rating_count } = advertiser_details || {};

    const { displayEffectiveRate } = generateEffectiveRate({
        exchangeRate: exchangeRateRef.current,
        localCurrency: local_currency as TCurrency,
        marketRate: Number(effective_rate),
        price: Number(price_display),
        rate,
        rateType: rate_type,
    });
    const hasRating = !!rating_average && !!rating_count;
    const isBuyAdvert = counterparty_type === BUY_SELL.BUY;
    const isMyAdvert = data?.id === id;
    const ratingAverageDecimal = rating_average ? Number(rating_average).toFixed(1) : null;
    const textColor = isMobile ? 'less-prominent' : 'general';

    return (
        <div
            className={clsx('adverts-table-row', {
                'adverts-table-row--advertiser': !isBuySellPage,
            })}
        >
            <Container>
                {isBuySellPage && (
                    <div
                        className={clsx('flex gap-4 items-center', {
                            'cursor-pointer': !isAdvertiserBarred,
                        })}
                        onClick={() =>
                            isAdvertiserBarred
                                ? undefined
                                : history.push(`${ADVERTISER_URL}/${id}?currency=${local_currency}`)
                        }
                    >
                        <UserAvatar
                            isOnline={is_online}
                            nickname={name || ''}
                            showOnlineStatus
                            size={isMobile ? 32 : 24}
                            textSize={isMobile ? 'sm' : 'xs'}
                        />
                        <div className='flex flex-col'>
                            <div
                                className={clsx('flex flex-row items-center gap-2', {
                                    'mb-[-0.5rem]': hasRating,
                                })}
                            >
                                <Text size={isMobile ? 'md' : 'sm'} weight={isMobile ? 'bold' : 400}>
                                    {name}
                                </Text>
                                <Badge tradeCount={completed_orders_count} />
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
                                            starsScale={isMobile ? 0.7 : 0.9}
                                        />
                                        <Text className='lg:ml-[-0.5rem] ml-[-2.5rem]' color='less-prominent' size='xs'>
                                            ({rating_count})
                                        </Text>
                                    </>
                                ) : (
                                    <Text color='less-prominent' size='xs'>
                                        <Localize i18n_default_text='Not rated yet' />
                                    </Text>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                <Container {...(isMobile && { className: clsx('flex flex-col', { 'mt-3 ml-14': isBuySellPage }) })}>
                    {isMobile && (
                        <Text color={isBuySellPage ? 'general' : 'less-prominent'} size={isBuySellPage ? 'xs' : 'sm'}>
                            <Localize i18n_default_text='Rate (1 USD)' />
                        </Text>
                    )}
                    <Container {...(isMobile && { className: 'flex flex-col-reverse mb-7' })}>
                        <Text color={textColor} size='sm'>
                            {isMobile && 'Limits:'} {min_order_amount_limit_display}-{max_order_amount_limit_display}{' '}
                            {account_currency}
                        </Text>
                        <Text className='text-wrap w-[90%]' color='success' size={isMobile ? 'md' : 'sm'} weight='bold'>
                            {displayEffectiveRate} {local_currency}
                        </Text>
                    </Container>
                    <div className='flex flex-wrap gap-2'>
                        {payment_method_names ? (
                            payment_method_names.map((method: string, idx: number) => (
                                <PaymentMethodLabel
                                    color={textColor}
                                    key={idx}
                                    paymentMethodName={method}
                                    size={isMobile ? 'sm' : 'xs'}
                                />
                            ))
                        ) : (
                            <PaymentMethodLabel color={textColor} paymentMethodName='-' />
                        )}
                    </div>
                </Container>
            </Container>
            {!isMyAdvert && (
                <div
                    className={clsx('flex relative', {
                        'flex-col h-full justify-center items-end': isBuySellPage,
                        'flex-row justify-end': !isBuySellPage,
                    })}
                >
                    {isMobile && isBuySellPage && (
                        <LabelPairedChevronRightMdRegularIcon className='absolute top-0 right-0' />
                    )}
                    {isEligible === 0 ? (
                        <Button
                            className='border px-[1.6rem]'
                            color='black'
                            onClick={() => showModal('ErrorModal')}
                            size={isMobile ? 'md' : 'sm'}
                            textSize={isMobile ? 'md' : 'xs'}
                            variant='outlined'
                        >
                            <Localize i18n_default_text='Unavailable' />
                        </Button>
                    ) : (
                        <Button
                            className='lg:w-[7.5rem]'
                            disabled={isAdvertiserBarred}
                            onClick={() => {
                                if (!isPoaVerified || !isPoiVerified) {
                                    const searchParams = new URLSearchParams(location.search);
                                    searchParams.set('poi_poa_verified', 'false');
                                    history.replace({ pathname: location.pathname, search: searchParams.toString() });
                                } else {
                                    showModal(isAdvertiser ? 'BuySellForm' : 'NicknameModal');
                                }
                            }}
                            size={isMobile ? 'md' : 'sm'}
                            textSize={isMobile ? 'md' : 'xs'}
                        >
                            {isBuyAdvert ? 'Buy' : 'Sell'} {account_currency}
                        </Button>
                    )}
                </div>
            )}
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
