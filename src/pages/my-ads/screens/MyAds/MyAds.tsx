import { TemporarilyBarredHint, Verification } from '@/components';
import { useIsAdvertiser, useIsAdvertiserBarred, usePoiPoaStatus } from '@/hooks/custom-hooks';
import { MyAdsTable } from './MyAdsTable';

const MyAds = () => {
    const isAdvertiser = useIsAdvertiser();
    const isAdvertiserBarred = useIsAdvertiserBarred();
    const { data } = usePoiPoaStatus();
    const { isPoiPoaVerified } = data || {};

    if (!isAdvertiser && !isPoiPoaVerified)
        return (
            <div className='overflow-y-auto h-[calc(100%-11rem)]'>
                <Verification />;
            </div>
        );

    return (
        <div className='flex flex-col h-full'>
            {isAdvertiserBarred && <TemporarilyBarredHint />}
            <MyAdsTable />
        </div>
    );
};
export default MyAds;
