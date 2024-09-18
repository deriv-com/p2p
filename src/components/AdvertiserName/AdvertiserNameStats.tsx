import clsx from 'clsx';
import { DeepPartial, TAdvertiserStats, TLocalize } from 'types';
import { OnlineStatusIcon, OnlineStatusLabel, StarRating } from '@/components';
import { useModalManager } from '@/hooks';
import { getCurrentRoute } from '@/utils';
import { LabelPairedThumbsUpSmRegularIcon } from '@deriv/quill-icons';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Text, Tooltip, useDevice } from '@deriv-com/ui';
import { BlockUserCountModal } from '../Modals';
import BlockUserCount from './BlockUserCount';
import { BusinessHoursTooltip } from './BusinessHoursTooltip';
import './AdvertiserNameStats.scss';

const getMessage = (localize: TLocalize, count = 0) => {
    if (count > 1) {
        return localize('Recommended by {{count}} traders', {
            count,
        });
    } else if (count === 1) {
        return localize('Recommended by 1 trader');
    }
    return localize('No one has recommended this trader yet');
};
/**
 * This component is to show an advertiser's stats, in UI its commonly used under an advertiser's name
 * Example:
 * Joined 2d | Not rated yet | x x x x x (5 ratings)
 *
 * Use cases are to show this in My Profile and Advertiser page
 */
const AdvertiserNameStats = ({ advertiserStats }: { advertiserStats: DeepPartial<TAdvertiserStats> }) => {
    const { localize } = useTranslations();
    const { isDesktop, isMobile } = useDevice();
    const isMyProfile = getCurrentRoute() === 'my-profile';
    const { hideModal, isModalOpenFor, showModal } = useModalManager();

    const {
        blocked_by_count: blockedByCount,
        daysSinceJoined,
        is_online: isOnline,
        last_online_time: lastOnlineTime,
        rating_average: ratingAverage,
        rating_count: ratingCount,
        recommended_average: recommendedAverage,
        recommended_count: recommendedCount = 0,
    } = advertiserStats || {};

    const textSize = isMobile ? 'xs' : 'sm';

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
                <Text color='less-prominent' size={textSize}>
                    {daysSinceJoined && daysSinceJoined > 0 ? (
                        <Localize i18n_default_text='Joined {{daysSinceJoined}}d' values={{ daysSinceJoined }} />
                    ) : (
                        <Localize i18n_default_text='Joined today' />
                    )}
                </Text>
            </div>
            <div>
                {!ratingAverage && (
                    <div>
                        <Text color='less-prominent' size={textSize}>
                            <Localize i18n_default_text='Not rated yet' />
                        </Text>
                    </div>
                )}
                {ratingAverage && (
                    <>
                        <div className='advertiser-name-stats__rating'>
                            <Text size={textSize}>{ratingAverage.toFixed(1)}</Text>
                            <StarRating allowFraction isReadonly ratingValue={ratingAverage} />
                            <Text color='less-prominent' size={textSize}>
                                {ratingCount && ratingCount > 1 ? (
                                    <Localize i18n_default_text='{{ratingCount}} ratings' values={{ ratingCount }} />
                                ) : (
                                    <Localize i18n_default_text='1 rating' />
                                )}
                            </Text>
                        </div>
                        <div>
                            <Tooltip
                                as='button'
                                className='advertiser-name-stats__tooltip'
                                hideTooltip={!isDesktop}
                                onClick={() => {
                                    isDesktop ? undefined : showModal('BlockUserCountModal');
                                }}
                                tooltipContent={getMessage(localize, recommendedCount ?? 0)}
                            >
                                <LabelPairedThumbsUpSmRegularIcon fill='#4bb4b3' />
                                <Text color='less-prominent' size='sm'>
                                    {recommendedAverage || 0}%
                                </Text>
                            </Tooltip>
                        </div>
                    </>
                )}
            </div>
            <div>
                {isMyProfile && <BlockUserCount count={blockedByCount} />}
                {isMyProfile && <BusinessHoursTooltip />}
            </div>
            {!!isModalOpenFor('BlockUserCountModal') && (
                <BlockUserCountModal
                    isModalOpen
                    message={getMessage(localize, recommendedCount ?? 0)}
                    onRequestClose={hideModal}
                />
            )}
        </div>
    );
};
AdvertiserNameStats.displayName = 'AdvertiserNameStats';

export default AdvertiserNameStats;
