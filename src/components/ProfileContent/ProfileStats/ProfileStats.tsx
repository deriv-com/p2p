import { useMemo } from 'react';
import clsx from 'clsx';
import { TAdvertiserStats } from 'types';
import { useTranslations } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';
import './ProfileStats.scss';

const ProfileStats = ({ advertiserStats }: { advertiserStats: Partial<TAdvertiserStats> }) => {
    const { isDesktop } = useDevice();
    const { localize } = useTranslations();

    const advertiserStatsList = useMemo(() => {
        if (!advertiserStats) return [];

        const {
            averagePayTime,
            averageReleaseTime,
            buyCompletionRate,
            buyOrdersCount,
            sellCompletionRate,
            sellOrdersCount,
            tradePartners,
            tradeVolume,
        } = advertiserStats;

        return [
            {
                text: localize('Buy completion 30d'),
                value: buyCompletionRate && buyCompletionRate > 0 ? `${buyCompletionRate}% (${buyOrdersCount})` : '-',
            },
            {
                text: localize('Sell completion 30d'),
                value:
                    sellCompletionRate && sellCompletionRate > 0 ? `${sellCompletionRate}% (${sellOrdersCount})` : '-',
            },
            { text: localize('Trade volume 30d'), value: `${tradeVolume ? tradeVolume.toFixed(2) : '0.00'} USD` },
            {
                text: localize('Avg pay time 30d'),
                value: averagePayTime !== -1 ? `${averagePayTime} ${localize('min')}` : '-',
            },
            {
                text: localize('Avg release time 30d'),
                value: averageReleaseTime !== -1 ? `${averageReleaseTime} ${localize('min')}` : '-',
            },
            { text: localize('Trade partners'), value: tradePartners },
        ];
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [advertiserStats]);

    return (
        <div className='profile-stats'>
            <div className='profile-stats__item'>
                {advertiserStatsList.slice(0, 3).map(stat => (
                    <div
                        className={clsx('flex flex-col lg:gap-1 profile-stats__item-stat', {
                            'border-r-[1px] border-solid border-r-[#ededed]': !isDesktop,
                        })}
                        key={stat.value + stat.text}
                    >
                        <Text color='less-prominent' size='sm'>
                            {stat.text}
                        </Text>
                        <Text size='xl' weight='bold'>
                            {stat.value}
                        </Text>
                    </div>
                ))}
            </div>
            <div className='profile-stats__item'>
                {advertiserStatsList.slice(-3).map(stat => (
                    <div
                        className={clsx('flex flex-col lg:gap-1 profile-stats__item-stat', {
                            'border-none': !isDesktop,
                        })}
                        key={stat.value + stat.text}
                    >
                        <Text color='less-prominent' size='sm'>
                            {stat.text}
                        </Text>
                        <Text size='xl' weight='bold'>
                            {stat.value}
                        </Text>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProfileStats;
