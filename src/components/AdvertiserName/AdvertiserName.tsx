import { DeepPartial, TAdvertiserStats } from 'types';
import { UserAvatar } from '@/components';
import { getCurrentRoute } from '@/utils';
import { useGetSettings } from '@deriv-com/api-hooks';
import { Text, useDevice } from '@deriv-com/ui';
import AdvertiserNameBadges from './AdvertiserNameBadges';
import AdvertiserNameStats from './AdvertiserNameStats';
import AdvertiserNameToggle from './AdvertiserNameToggle';
import BlockDropdown from './BlockDropdown';
import './AdvertiserName.scss';

type TAdvertiserNameProps = {
    advertiserStats: DeepPartial<TAdvertiserStats>;
    isSameUser?: boolean;
    onClickBlocked?: () => void;
};

const AdvertiserName = ({ advertiserStats, isSameUser, onClickBlocked }: TAdvertiserNameProps) => {
    const { data } = useGetSettings();
    const { isDesktop } = useDevice();
    const isMyProfile = getCurrentRoute() === 'my-profile';

    const name = advertiserStats?.name || data?.email;
    const isDropdownVisible = isDesktop && !isMyProfile && !advertiserStats?.is_blocked && !isSameUser;

    return (
        <div className='advertiser-name' data-testid='dt_advertiser_name'>
            <UserAvatar nickname={name ?? ''} size={isDesktop ? 64 : 42} textSize='lg' />
            <div className='advertiser-name__details'>
                <div className='flex items-center gap-3' data-testid='dt_advertiser_name_nickname'>
                    <Text size='md' weight='bold'>
                        {name}
                    </Text>
                    {advertiserStats?.first_name && advertiserStats.last_name && (
                        <Text color='less-prominent' size='sm'>
                            ({advertiserStats?.fullName})
                        </Text>
                    )}
                </div>
                <AdvertiserNameStats advertiserStats={advertiserStats} />
                <AdvertiserNameBadges advertiserStats={advertiserStats} />
            </div>
            {isDesktop && isMyProfile && <AdvertiserNameToggle advertiserInfo={advertiserStats} />}
            {isDropdownVisible && <BlockDropdown id={advertiserStats?.id} onClickBlocked={onClickBlocked} />}
        </div>
    );
};
AdvertiserName.displayName = 'AdvertiserName';

export default AdvertiserName;
