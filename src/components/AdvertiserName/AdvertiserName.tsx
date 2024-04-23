import { DeepPartial, TAdvertiserStats } from 'types';
import { UserAvatar } from '@/components';
import { getCurrentRoute } from '@/utils';
import { LabelPairedEllipsisVerticalLgRegularIcon } from '@deriv/quill-icons';
import { useGetSettings } from '@deriv-com/api-hooks';
import { Text, useDevice } from '@deriv-com/ui';
import AdvertiserNameBadges from './AdvertiserNameBadges';
import AdvertiserNameStats from './AdvertiserNameStats';
import AdvertiserNameToggle from './AdvertiserNameToggle';
import './AdvertiserName.scss';

const AdvertiserName = ({ advertiserStats }: { advertiserStats: DeepPartial<TAdvertiserStats> }) => {
    const { data } = useGetSettings();
    const { isDesktop } = useDevice();
    const isMyProfile = getCurrentRoute() === 'my-profile';

    const name = advertiserStats?.name || data?.email;

    return (
        <div className='advertiser-name' data-testid='dt_advertiser_name'>
            <UserAvatar nickname={name!} size={isDesktop ? 64 : 42} textSize='lg' />
            <div className='advertiser-name__details'>
                <div className='flex items-center gap-3'>
                    <Text size='md' weight='bold'>
                        {name}
                    </Text>
                    {(advertiserStats?.should_show_name || !isMyProfile) && (
                        <Text color='less-prominent' size='sm'>
                            ({advertiserStats?.fullName})
                        </Text>
                    )}
                </div>
                <AdvertiserNameStats advertiserStats={advertiserStats} />
                <AdvertiserNameBadges advertiserStats={advertiserStats} />
            </div>
            {isDesktop && isMyProfile && <AdvertiserNameToggle advertiserInfo={advertiserStats} />}
            {isDesktop && !isMyProfile && <LabelPairedEllipsisVerticalLgRegularIcon className='cursor-pointer' />}
        </div>
    );
};
AdvertiserName.displayName = 'AdvertiserName';

export default AdvertiserName;
