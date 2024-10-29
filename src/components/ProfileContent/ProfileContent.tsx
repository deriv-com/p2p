import { useEffect } from 'react';
import { TAdvertiserStats } from 'types';
import { AdvertiserName, AdvertiserNameToggle } from '@/components';
import { getCurrentRoute } from '@/utils';
import { useDevice } from '@deriv-com/ui';
import { ProfileBalance } from './ProfileBalance';
import { ProfileStats } from './ProfileStats';
import './ProfileContent.scss';

type TProfileContentProps = {
    data: TAdvertiserStats;
    isSameUser?: boolean;
    setAdvertiserName?: (name: string) => void;
};

const ProfileContent = ({ data, isSameUser, setAdvertiserName }: TProfileContentProps) => {
    const { isDesktop } = useDevice();
    const isMyProfile = getCurrentRoute() === 'my-profile';

    useEffect(() => {
        if (data?.name && setAdvertiserName) {
            setAdvertiserName(data?.name);
        }
    }, [data?.is_blocked, data?.name, setAdvertiserName]);

    return (
        <>
            <div className='profile-content'>
                <AdvertiserName advertiserStats={data} isSameUser={isSameUser} />
                {isMyProfile ? <ProfileBalance advertiserStats={data} /> : <ProfileStats advertiserStats={data} />}
            </div>
            {!isDesktop && isMyProfile && <AdvertiserNameToggle advertiserInfo={data} />}
        </>
    );
};

export default ProfileContent;
