import clsx from 'clsx';
import { useHistory, useLocation } from 'react-router-dom';
import { PageReturn, TemporarilyBarredHint, Verification } from '@/components';
import { BUY_SELL_URL } from '@/constants';
import { useIsAdvertiserBarred } from '@/hooks/custom-hooks';
import { useTranslations } from '@deriv-com/translations';
import { BuySellTable } from '../BuySellTable';
import './BuySell.scss';

const BuySell = () => {
    const { localize } = useTranslations();
    const isAdvertiserBarred = useIsAdvertiserBarred();
    const history = useHistory();
    const location = useLocation();
    const poiPoaVerified = new URLSearchParams(location.search).get('poi_poa_verified');

    if (poiPoaVerified === 'false') {
        return (
            <>
                <PageReturn
                    onClick={() => history.replace({ pathname: BUY_SELL_URL, search: '' })}
                    pageTitle={localize('Verification')}
                    weight='bold'
                />
                <Verification />
            </>
        );
    }

    return (
        <div className={clsx('buy-sell', { 'buy-sell--barred': isAdvertiserBarred })}>
            {isAdvertiserBarred && <TemporarilyBarredHint />}
            <BuySellTable />
        </div>
    );
};

export default BuySell;
