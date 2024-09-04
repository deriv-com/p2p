import { TemporarilyBarredHint, Verification } from '@/components';
import { useIsAdvertiser, useIsAdvertiserBarred, usePoiPoaStatus } from '@/hooks/custom-hooks';
import { MyAdsTable } from './MyAdsTable';

const MyAds = () => {
    const isAdvertiser = useIsAdvertiser();
    const isAdvertiserBarred = useIsAdvertiserBarred();
    const { data } = usePoiPoaStatus();
    const { isPoaVerified, isPoiVerified } = data || {};

    if (!isAdvertiser && (!isPoaVerified || !isPoiVerified)) return <Verification />;

    return (
        <div className='flex flex-col h-full'>
            {isAdvertiserBarred && <TemporarilyBarredHint />}
            <MyAdsTable />
        </div>
    );
};
export default MyAds;
