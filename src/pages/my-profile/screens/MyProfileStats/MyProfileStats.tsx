import { useState } from 'react';
import { api } from '@/hooks';
import { useAdvertiserStats } from '@/hooks/custom-hooks';
import { useTranslations } from '@deriv-com/translations';
import { Loader } from '@deriv-com/ui';
import { FormatUtils } from '@deriv-com/utils';
import MyProfileStatsItem from './MyProfileStatsItem';
import './MyProfileStats.scss';

type TMyProfileStatsProps = {
    advertiserId?: string;
};

const MyProfileStats = ({ advertiserId }: TMyProfileStatsProps) => {
    const { localize } = useTranslations();
    const [shouldShowTradeVolumeLifetime, setShouldShowTradeVolumeLifetime] = useState(false);
    const [shouldShowTotalOrdersLifetime, setShouldShowTotalOrdersLifetime] = useState(false);
    const { data, isLoading } = useAdvertiserStats(advertiserId);
    const { data: activeAccount } = api.account.useActiveAccount();

    if (isLoading || !data) return <Loader className='relative mt-16' />;

    const {
        averagePayTime,
        averageReleaseTime,
        buyCompletionRate,
        buyOrdersCount,
        sellCompletionRate,
        sellOrdersCount,
        totalOrders,
        totalOrdersLifetime,
        tradePartners,
        tradeVolume,
        tradeVolumeLifetime,
    } = data;

    const getTimeValueText = (minutes: number) => `${minutes === 1 ? '< ' : ''}${minutes} min`;

    return (
        <div className='my-profile-stats' data-testid='dt_profile_stats'>
            <MyProfileStatsItem
                label={localize('Buy completion')}
                testId='dt_profile_stats_buy_completion'
                value={buyCompletionRate ? `${buyCompletionRate}% (${buyOrdersCount})` : '-'}
            />
            <MyProfileStatsItem
                label={localize('Sell completion')}
                testId='dt_profile_stats_sell_completion'
                value={sellCompletionRate ? `${sellCompletionRate}% (${sellOrdersCount})` : '-'}
            />
            <MyProfileStatsItem
                label={localize('Avg pay time')}
                testId='dt_profile_stats_avg_pay_time'
                value={averagePayTime !== -1 ? getTimeValueText(averagePayTime) : '-'}
            />
            <MyProfileStatsItem
                label={localize('Avg release time')}
                testId='dt_profile_stats_avg_release_time'
                value={averageReleaseTime !== -1 ? getTimeValueText(averageReleaseTime) : '-'}
            />
            <MyProfileStatsItem
                currency={activeAccount?.currency || 'USD'}
                label={localize('Trade volume')}
                onClickLifetime={hasClickedLifetime => setShouldShowTradeVolumeLifetime(hasClickedLifetime)}
                shouldShowLifetime
                testId='dt_profile_stats_trade_volume'
                value={
                    shouldShowTradeVolumeLifetime
                        ? FormatUtils.formatMoney(tradeVolumeLifetime)
                        : FormatUtils.formatMoney(tradeVolume)
                }
            />
            <MyProfileStatsItem
                label={localize('Total orders')}
                onClickLifetime={hasClickedLifetime => setShouldShowTotalOrdersLifetime(hasClickedLifetime)}
                shouldShowLifetime
                testId='dt_profile_stats_total_orders'
                value={shouldShowTotalOrdersLifetime ? totalOrdersLifetime.toString() : totalOrders.toString()}
            />
            <MyProfileStatsItem
                label={localize('Trade partners')}
                shouldShowDuration={false}
                testId='dt_profile_stats_trade_partners'
                value={tradePartners.toString()}
            />
        </div>
    );
};

export default MyProfileStats;
