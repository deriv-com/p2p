import clsx from 'clsx';
import { TemporarilyBarredHint, Verification } from '@/components';
import { useIsAdvertiserBarred, usePoiPoaStatus } from '@/hooks/custom-hooks';
import { useDevice } from '@deriv-com/ui';
import { MyAdsTable } from './MyAdsTable';

const MyAds = () => {
    const { isMobile } = useDevice();
    const isAdvertiserBarred = useIsAdvertiserBarred();
    const { data } = usePoiPoaStatus();
    const { isPoaVerified, isPoiVerified } = data || {};

    if (!isPoaVerified || !isPoiVerified) return <Verification />;

    return (
        <div className={clsx('flex flex-col', isMobile ? 'h-[calc(100vh-8rem)]' : 'h-full')}>
            {isAdvertiserBarred && <TemporarilyBarredHint />}
            <MyAdsTable />
        </div>
    );
};
export default MyAds;
