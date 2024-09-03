import { OutsideBusinessHoursHint, TemporarilyBarredHint, Verification } from '@/components';
import { useGetBusinessHours, useIsAdvertiserBarred, usePoiPoaStatus } from '@/hooks/custom-hooks';
import { MyAdsTable } from './MyAdsTable';

const MyAds = () => {
    const isAdvertiserBarred = useIsAdvertiserBarred();
    const { isScheduleAvailable } = useGetBusinessHours();
    const { data } = usePoiPoaStatus();
    const { isPoaVerified, isPoiVerified } = data || {};

    if (!isPoaVerified || !isPoiVerified) return <Verification />;

    return (
        <div className='flex flex-col h-full'>
            {isAdvertiserBarred && <TemporarilyBarredHint />}
            {!isScheduleAvailable && !isAdvertiserBarred && <OutsideBusinessHoursHint />}
            <MyAdsTable />
        </div>
    );
};
export default MyAds;
