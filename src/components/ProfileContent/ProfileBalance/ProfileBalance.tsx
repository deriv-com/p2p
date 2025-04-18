import { useMemo } from 'react';
import { DeepPartial, TAdvertiserStats } from 'types';
import { AvailableP2PBalanceModal, RemainingBuySellLimitModal } from '@/components/Modals';
import { api, useModalManager } from '@/hooks';
import { LabelPairedCircleInfoMdRegularIcon } from '@deriv/quill-icons';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';
import { FormatUtils } from '@deriv-com/utils';
import { ProfileDailyLimit } from '../ProfileDailyLimit';
import './ProfileBalance.scss';

const ProfileBalance = ({ advertiserStats }: { advertiserStats: DeepPartial<TAdvertiserStats> }) => {
    const { data: activeAccount } = api.account.useActiveAccount();
    const { isDesktop, isMobile } = useDevice();
    const { localize } = useTranslations();
    const { hideModal, isModalOpenFor, showModal } = useModalManager();

    const currency = activeAccount?.currency || 'USD';
    const dailyLimits = useMemo(
        () => [
            {
                available: `${FormatUtils.formatMoney(advertiserStats?.dailyAvailableBuyLimit || 0)}`,
                dailyLimit: `${advertiserStats?.daily_buy_limit || FormatUtils.formatMoney(0)} ${currency}`,
                type: localize('Buy'),
            },
            {
                available: `${FormatUtils.formatMoney(advertiserStats?.dailyAvailableSellLimit || 0)}`,
                dailyLimit: `${advertiserStats?.daily_sell_limit || FormatUtils.formatMoney(0)} ${currency}`,
                type: localize('Sell'),
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [
            advertiserStats?.dailyAvailableBuyLimit,
            advertiserStats?.dailyAvailableSellLimit,
            advertiserStats?.daily_buy_limit,
            advertiserStats?.daily_sell_limit,
            currency,
        ]
    );

    const labelSize = isMobile ? 'xl' : 'md';

    return (
        <>
            <div className='profile-balance'>
                <div className='profile-balance__amount' data-testid='dt_available_balance_amount'>
                    <div>
                        <Text color='less-prominent' size={isDesktop ? 'sm' : 'xs'}>
                            <Localize i18n_default_text='Available Deriv P2P Balance' />
                        </Text>
                        <LabelPairedCircleInfoMdRegularIcon
                            className='cursor-pointer fill-gray-400'
                            data-testid='dt_available_balance_icon'
                            onClick={() => showModal('AvailableP2PBalanceModal')}
                        />
                    </div>
                    <Text data-testid='dt_available_balance_amount_value' size={isMobile ? '2xl' : 'xl'} weight='bold'>
                        {FormatUtils.formatMoney(advertiserStats?.balance_available || 0)} USD
                    </Text>
                </div>
                <div className='profile-balance__container'>
                    <div className='flex items-center gap-[0.4rem]'>
                        <Text color='less-prominent' size={isMobile ? 'xs' : 'sm'}>
                            <Localize i18n_default_text='Daily limit' />
                        </Text>
                        <LabelPairedCircleInfoMdRegularIcon
                            className='cursor-pointer fill-gray-400'
                            data-testid='dt_profile_balance_daily_limit_icon'
                            onClick={() => showModal('RemainingBuySellLimitModal')}
                        />
                    </div>
                    <div className='profile-balance__items'>
                        {dailyLimits.map(({ available, dailyLimit, type }) => (
                            <div className='profile-balance__item' key={type}>
                                <Text size={isMobile ? 'lg' : 'md'}>{type}</Text>
                                <div className='profile-balance__item-limits'>
                                    <Text
                                        className='profile-balance__label'
                                        data-testid={`dt_profile_balance_available_${type.toLowerCase()}_value`}
                                        size={labelSize}
                                    >
                                        {available}&nbsp;
                                    </Text>
                                    <Text
                                        className='profile-balance__label'
                                        data-testid={`dt_profile_balance_daily_${type.toLowerCase()}_value`}
                                        size={labelSize}
                                        weight='bold'
                                    >
                                        /&nbsp;{dailyLimit}
                                    </Text>
                                </div>
                            </div>
                        ))}
                    </div>
                    {advertiserStats?.isEligibleForLimitUpgrade && (
                        <div className='w-fit'>
                            <ProfileDailyLimit />
                        </div>
                    )}
                </div>
            </div>
            {isModalOpenFor('AvailableP2PBalanceModal') && (
                <AvailableP2PBalanceModal isModalOpen onRequestClose={hideModal} />
            )}
            {isModalOpenFor('RemainingBuySellLimitModal') && (
                <RemainingBuySellLimitModal isModalOpen onRequestClose={hideModal} />
            )}
        </>
    );
};

export default ProfileBalance;
