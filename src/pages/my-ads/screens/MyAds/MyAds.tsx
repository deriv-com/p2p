import { OutsideBusinessHoursHint, PNVBanner, TemporarilyBarredHint, Verification } from '@/components';
import {
    useGetBusinessHours,
    useGetPhoneNumberVerification,
    useIsAdvertiserBarred,
    useIsAdvertiserNotVerified,
} from '@/hooks/custom-hooks';
import { MyAdsTable } from './MyAdsTable';

const MyAds = () => {
    const isAdvertiserBarred = useIsAdvertiserBarred();
    const { isScheduleAvailable } = useGetBusinessHours();
    const isAdvertiserNotVerified = useIsAdvertiserNotVerified();
    const { isPhoneNumberVerified } = useGetPhoneNumberVerification();

    if (isAdvertiserNotVerified)
        return (
            <div className='overflow-y-auto h-[calc(100%-11rem)]'>
                <Verification />;
            </div>
        );

    return (
        <div className='flex flex-col h-full'>
            {isAdvertiserBarred && <TemporarilyBarredHint />}
            {!isScheduleAvailable && !isAdvertiserBarred && <OutsideBusinessHoursHint />}
            {!isPhoneNumberVerified && <PNVBanner />}
            <MyAdsTable />
        </div>
    );
};
export default MyAds;
