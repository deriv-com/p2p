import clsx from 'clsx';
import { DeepPartial, TAdvertiserStats } from 'types';
import { OnlineStatusIcon, OnlineStatusLabel, StarRating } from '@/components';
import { getCurrentRoute } from '@/utils';
import { LabelPairedThumbsUpSmRegularIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';
import BlockUserCount from './BlockUserCount';
import './AdvertiserNameStats.scss';

/**
 * This component is to show an advertiser's stats, in UI its commonly used under an advertiser's name
 * Example:
 * Joined 2d | Not rated yet | x x x x x (5 ratings)
 *
 * Use cases are to show this in My Profile and Advertiser page
 */
const AdvertiserNameStats = ({ advertiserStats }: { advertiserStats: DeepPartial<TAdvertiserStats> }) => {
    const { isDesktop } = useDevice();
    const isMyProfile = getCurrentRoute() === 'my-profile';

    const {
        blocked_by_count: blockedByCount,
        daysSinceJoined,
        is_online: isOnline,
        last_online_time: lastOnlineTime,
        rating_average: ratingAverage,
        rating_count: ratingCount,
        recommended_average: recommendedAverage,
    } = advertiserStats || {};

    return (
        <div
            className={clsx('advertiser-name-stats', {
                'gap-2': !isMyProfile && !isDesktop,
            })}
            data-testid='dt_advertiser_name_stats'
        >
            <div>
                {!isMyProfile && (
                    <div className='border-r-[1px] border-solid border-r-[#ededed]'>
                        <OnlineStatusIcon isOnline={!!isOnline} isRelative size='0.8em' />
                        <OnlineStatusLabel
                            isOnline={!!isOnline}
                            lastOnlineTime={lastOnlineTime === null ? undefined : lastOnlineTime}
                        />
                    </div>
                )}
                <Text color='less-prominent' size='sm'>
                    {daysSinceJoined && daysSinceJoined > 0 ? (
                        <Localize i18n_default_text='Joined {{daysSinceJoined}}d' values={{ daysSinceJoined }} />
                    ) : (
                        <Localize i18n_default_text='Joined today' />
                    )}
                </Text>
            </div>
            {!ratingAverage && (
                <div>
                    <Text color='less-prominent' size='sm'>
                        <Localize i18n_default_text='Not rated yet' />
                    </Text>
                </div>
            )}
            {ratingAverage && (
                <>
                    <div>
                        <div className='advertiser-name-stats__rating'>
                            <Text size='sm'>({ratingAverage})</Text>
                            <StarRating allowFraction isReadonly ratingValue={ratingAverage} />
                            <Text color='less-prominent' size='sm'>
                                (<Localize i18n_default_text='{{ratingCount}} ratings' values={{ ratingCount }} />)
                            </Text>
                        </div>
                    </div>
                    <div>
                        <LabelPairedThumbsUpSmRegularIcon />
                        <Text color='less-prominent' size='sm'>
                            {recommendedAverage || 0}%
                        </Text>
                    </div>
                </>
            )}
            {isMyProfile && <BlockUserCount count={blockedByCount} />}
        </div>
    );
};
AdvertiserNameStats.displayName = 'AdvertiserNameStats';

export default AdvertiserNameStats;
