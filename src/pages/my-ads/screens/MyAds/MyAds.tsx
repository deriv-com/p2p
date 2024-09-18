import { OutsideBusinessHoursHint, TemporarilyBarredHint, Verification } from '@/components';
import { useGetBusinessHours, useIsAdvertiserBarred, usePoiPoaStatus } from '@/hooks/custom-hooks';
import { MyAdsTable } from './MyAdsTable';

const MyAds = () => {
    const isAdvertiserBarred = useIsAdvertiserBarred();
    const { isScheduleAvailable } = useGetBusinessHours();
    const { data } = usePoiPoaStatus();
    const { isPoaVerified, isPoiVerified } = data || {};

    if (!isPoaVerified || !isPoiVerified)
        return (
            <div className='overflow-y-auto h-[calc(100%-11rem)]'>
                <Verification />;
            </div>
        );

    return (
        <div className='flex flex-col h-full'>
            {isAdvertiserBarred && <TemporarilyBarredHint />}
            {!isScheduleAvailable && !isAdvertiserBarred && <OutsideBusinessHoursHint />}
            <MyAdsTable />
        </div>
    );
};
export default MyAds;
