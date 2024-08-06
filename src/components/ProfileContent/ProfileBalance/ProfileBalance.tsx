import { useMemo, useState } from 'react';
import { DeepPartial, TAdvertiserStats } from 'types';
import { AvailableP2PBalanceModal } from '@/components/Modals';
import { api } from '@/hooks';
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
    const [shouldShowAvailableBalanceModal, setShouldShowAvailableBalanceModal] = useState(false);

    const currency = activeAccount?.currency || 'USD';
    const dailyLimits = useMemo(
        () => [
            {
                available: `${FormatUtils.formatMoney(advertiserStats?.dailyAvailableBuyLimit || 0)} ${currency}`,
                dailyLimit: `${advertiserStats?.daily_buy_limit || FormatUtils.formatMoney(0)} ${currency}`,
                type: localize('Buy'),
            },
            {
                available: `${FormatUtils.formatMoney(advertiserStats?.dailyAvailableSellLimit || 0)} ${currency}`,
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

    const labelSize = isMobile ? 'md' : 'sm';

    return (
        <>
            <AvailableP2PBalanceModal
                isModalOpen={shouldShowAvailableBalanceModal}
                onRequestClose={() => setShouldShowAvailableBalanceModal(false)}
            />
            <div className='profile-balance'>
                <div className='profile-balance__amount' data-testid='dt_available_balance_amount'>
                    <div>
                        <Text color='less-prominent' size={isDesktop ? 'sm' : 'xs'}>
                            <Localize i18n_default_text='Available Deriv P2P Balance' />
                        </Text>
                        <LabelPairedCircleInfoMdRegularIcon
                            className='cursor-pointer fill-gray-400'
                            data-testid='dt_available_balance_icon'
                            onClick={() => setShouldShowAvailableBalanceModal(true)}
                        />
                    </div>
                    <Text data-testid='dt_available_balance_amount_value' size={isMobile ? '2xl' : 'xl'} weight='bold'>
                        {FormatUtils.formatMoney(advertiserStats?.balance_available || 0)} USD
                    </Text>
                </div>
                <div className='flex flex-col gap-[1.6rem]'>
                    <div className='profile-balance__items'>
                        {dailyLimits.map(({ available, dailyLimit, type }) => (
                            <div className='profile-balance__item' key={type}>
                                <Text size={labelSize}>{type}</Text>
                                <div className='profile-balance__item-limits'>
                                    <div data-testid={`dt_profile_balance_daily_${type.toLowerCase()}_limit`}>
                                        <Text color='less-prominent' size={labelSize}>
                                            <Localize i18n_default_text='Daily limit' />
                                        </Text>
                                        <Text
                                            className='profile-balance__label'
                                            data-testid={`dt_profile_balance_daily_${type.toLowerCase()}_value`}
                                            size={labelSize}
                                            weight='bold'
                                        >
                                            {dailyLimit}
                                        </Text>
                                    </div>
                                    <div data-testid={`dt_profile_balance_available_${type.toLowerCase()}_limit`}>
                                        <Text color='less-prominent' size={labelSize}>
                                            <Localize i18n_default_text='Available' />
                                        </Text>
                                        <Text
                                            className='profile-balance__label'
                                            data-testid={`dt_profile_balance_available_${type.toLowerCase()}_value`}
                                            size={labelSize}
                                            weight='bold'
                                        >
                                            {available}
                                        </Text>
                                    </div>
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
        </>
    );
};

export default ProfileBalance;
