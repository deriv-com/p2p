import clsx from 'clsx';
import { TemporarilyBarredHint } from '@/components';
import { useIsAdvertiserBarred } from '@/hooks/custom-hooks';
import { useDevice } from '@deriv-com/ui';
import { MyAdsTable } from './MyAdsTable';

const MyAds = () => {
    const { isMobile } = useDevice();
    const isAdvertiserBarred = useIsAdvertiserBarred();

    return (
        <div className={clsx('flex flex-col', isMobile ? 'h-[calc(100vh-12rem)]' : 'h-full')}>
            {isAdvertiserBarred && <TemporarilyBarredHint />}
            <MyAdsTable />
        </div>
    );
};
export default MyAds;
