import { useMemo, useState } from 'react';
import { DeepPartial, TAdvertiserStats } from 'types';
import { AvailableP2PBalanceModal } from '@/components/Modals';
import { api } from '@/hooks';
import { numberToCurrencyText } from '@/utils';
import { LabelPairedCircleInfoMdRegularIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';
import { ProfileDailyLimit } from '../ProfileDailyLimit';
import './ProfileBalance.scss';

const ProfileBalance = ({ advertiserStats }: { advertiserStats: DeepPartial<TAdvertiserStats> }) => {
    const { data: activeAccount } = api.account.useActiveAccount();
    const { isMobile } = useDevice();
    const [shouldShowAvailableBalanceModal, setShouldShowAvailableBalanceModal] = useState(false);

    const currency = activeAccount?.currency || 'USD';
    const dailyLimits = useMemo(
        () => [
            {
                available: `${numberToCurrencyText(advertiserStats?.dailyAvailableBuyLimit || 0)} ${currency}`,
                dailyLimit: `${advertiserStats?.daily_buy_limit || numberToCurrencyText(0)} ${currency}`,
                type: 'Buy',
            },
            {
                available: `${numberToCurrencyText(advertiserStats?.dailyAvailableSellLimit || 0)} ${currency}`,
                dailyLimit: `${advertiserStats?.daily_sell_limit || numberToCurrencyText(0)} ${currency}`,
                type: 'Sell',
            },
        ],
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
                        <Text color='less-prominent' size={isMobile ? 'xs' : 'sm'}>
                            <Localize i18n_default_text='Available Deriv P2P Balance' />
                        </Text>
                        <LabelPairedCircleInfoMdRegularIcon
                            className='cursor-pointer fill-gray-400'
                            data-testid='dt_available_balance_icon'
                            onClick={() => setShouldShowAvailableBalanceModal(true)}
                        />
                    </div>
                    <Text size={isMobile ? '2xl' : 'xl'} weight='bold'>
                        {numberToCurrencyText(advertiserStats?.balance_available || 0)} USD
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
                                        <Text className='profile-balance__label' size={labelSize} weight='bold'>
                                            {dailyLimit}
                                        </Text>
                                    </div>
                                    <div data-testid={`dt_profile_balance_available_${type.toLowerCase()}_limit`}>
                                        <Text color='less-prominent' size={labelSize}>
                                            <Localize i18n_default_text='Available' />
                                        </Text>
                                        <Text className='profile-balance__label' size={labelSize} weight='bold'>
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
