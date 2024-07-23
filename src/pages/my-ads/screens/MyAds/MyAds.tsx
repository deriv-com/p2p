import { TemporarilyBarredHint, Verification } from '@/components';
import { useIsAdvertiserBarred, usePoiPoaStatus } from '@/hooks/custom-hooks';
import { MyAdsTable } from './MyAdsTable';

const MyAds = () => {
    const isAdvertiserBarred = useIsAdvertiserBarred();
    const { data } = usePoiPoaStatus();
    const { isPoaVerified, isPoiVerified } = data || {};

    if (!isPoaVerified || !isPoiVerified) return <Verification />;

    return (
        <div className='flex flex-col'>
            {isAdvertiserBarred && <TemporarilyBarredHint />}
            <MyAdsTable />
        </div>
    );
};
export default MyAds;
