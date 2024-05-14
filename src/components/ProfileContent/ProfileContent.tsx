import { AdvertiserName, AdvertiserNameToggle } from '@/components';
import { useAdvertiserStats } from '@/hooks/custom-hooks';
import { getCurrentRoute } from '@/utils';
import { useDevice } from '@deriv-com/ui';
import { ProfileBalance } from './ProfileBalance';
import { ProfileStats } from './ProfileStats';
import './ProfileContent.scss';

type TProfileContentProps = {
    id?: string;
    onClickBlocked?: () => void;
};

const ProfileContent = ({ id, onClickBlocked }: TProfileContentProps) => {
    const { isMobile } = useDevice();
    const { data } = useAdvertiserStats(id);
    const isMyProfile = getCurrentRoute() === 'my-profile';

    return (
        <>
            <div className='profile-content'>
                <AdvertiserName advertiserStats={data} onClickBlocked={onClickBlocked} />
                {isMyProfile ? <ProfileBalance advertiserStats={data} /> : <ProfileStats advertiserStats={data} />}
            </div>
            {isMobile && isMyProfile && <AdvertiserNameToggle advertiserInfo={data} />}
        </>
    );
};

export default ProfileContent;
