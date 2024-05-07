import { useMemo, useState } from 'react';
import { DeepPartial, TAdvertiserStats } from 'types';
import { AvailableP2PBalanceModal } from '@/components/Modals';
import { api } from '@/hooks';
import { numberToCurrencyText } from '@/utils';
import { LabelPairedCircleInfoMdRegularIcon } from '@deriv/quill-icons';
import { Text, useDevice } from '@deriv-com/ui';
import { ProfileDailyLimit } from '../ProfileDailyLimit';
import './ProfileBalance.scss';

const ProfileBalance = ({ advertiserStats }: { advertiserStats: DeepPartial<TAdvertiserStats> }) => {
    const { data: activeAccount } = api.account.useActiveAccount();
    const { isDesktop } = useDevice();
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
                            Available Deriv P2P Balance
                        </Text>
                        <LabelPairedCircleInfoMdRegularIcon
                            className='cursor-pointer fill-gray-400'
                            data-testid='dt_available_balance_icon'
                            onClick={() => setShouldShowAvailableBalanceModal(true)}
                        />
                    </div>
                    <Text size={isDesktop ? 'xl' : '2xl'} weight='bold'>
                        {numberToCurrencyText(advertiserStats?.balance_available || 0)} USD
                    </Text>
                </div>
                <div className='flex flex-col gap-[1.6rem]'>
                    <div className='profile-balance__items'>
                        {dailyLimits.map(({ available, dailyLimit, type }) => (
                            <div className='profile-balance__item' key={type}>
                                <Text>{type}</Text>
                                <div className='profile-balance__item-limits'>
                                    <div data-testid={`dt_profile_balance_daily_${type.toLowerCase()}_limit`}>
                                        <Text color='less-prominent'>Daily limit</Text>
                                        <Text
                                            className='profile-balance__label'
                                            size={isDesktop ? 'sm' : 'md'}
                                            weight='bold'
                                        >
                                            {dailyLimit}
                                        </Text>
                                    </div>
                                    <div data-testid={`dt_profile_balance_available_${type.toLowerCase()}_limit`}>
                                        <Text color='less-prominent'>Available</Text>
                                        <Text
                                            className='profile-balance__label'
                                            size={isDesktop ? 'sm' : 'md'}
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
