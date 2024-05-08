import { TemporarilyBarredHint } from '@/components';
import { useIsAdvertiserBarred } from '@/hooks/custom-hooks';
import { BuySellTable } from '../BuySellTable';

const BuySell = () => {
    const isAdvertiserBarred = useIsAdvertiserBarred();

    return (
        <div>
            {isAdvertiserBarred && <TemporarilyBarredHint />}
            <BuySellTable />
        </div>
    );
};

export default BuySell;
