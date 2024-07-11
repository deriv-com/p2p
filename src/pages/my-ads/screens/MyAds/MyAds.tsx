import clsx from 'clsx';
import { TemporarilyBarredHint, Verification } from '@/components';
import { useIsAdvertiserBarred, usePoiPoaStatus } from '@/hooks/custom-hooks';
import { useDevice } from '@deriv-com/ui';
import { MyAdsTable } from './MyAdsTable';

const MyAds = () => {
    const { isDesktop } = useDevice();
    const isAdvertiserBarred = useIsAdvertiserBarred();
    const { data } = usePoiPoaStatus();
    const { isPoaVerified, isPoiVerified } = data || {};

    if (!isPoaVerified || !isPoiVerified) return <Verification />;

    return (
        <div className={clsx('flex flex-col', isDesktop ? 'h-full' : 'h-[calc(100vh-12rem)]')}>
            {isAdvertiserBarred && <TemporarilyBarredHint />}
            <MyAdsTable />
        </div>
    );
};
export default MyAds;
