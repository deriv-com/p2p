import { Dispatch, SetStateAction, useEffect } from 'react';
import { AdvertiserName, AdvertiserNameToggle } from '@/components';
import { useAdvertiserStats } from '@/hooks/custom-hooks';
import { getCurrentRoute } from '@/utils';
import { useDevice } from '@deriv-com/ui';
import { ProfileBalance } from './ProfileBalance';
import { ProfileStats } from './ProfileStats';
import './ProfileContent.scss';

type TProfileContentProps = {
    id?: string;
    setAdvertiserName?: (name: string) => void;
    setShowOverlay?: Dispatch<SetStateAction<boolean>>;
};

const ProfileContent = ({ id, setAdvertiserName, setShowOverlay }: TProfileContentProps) => {
    const { isMobile } = useDevice();
    const { data } = useAdvertiserStats(id);
    const isMyProfile = getCurrentRoute() === 'my-profile';

    useEffect(() => {
        if (data?.name && setAdvertiserName && setShowOverlay) {
            if (data?.is_blocked) {
                setShowOverlay(true);
            }
            setAdvertiserName(data?.name);
        }
    }, [data?.is_blocked, data?.name, setAdvertiserName, setShowOverlay]);

    return (
        <>
            <div className='profile-content'>
                <AdvertiserName advertiserStats={data} onClickBlocked={() => setShowOverlay?.(true)} />
                {isMyProfile ? <ProfileBalance advertiserStats={data} /> : <ProfileStats advertiserStats={data} />}
            </div>
            {isMobile && isMyProfile && <AdvertiserNameToggle advertiserInfo={data} />}
        </>
    );
};

export default ProfileContent;
