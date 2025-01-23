import clsx from 'clsx';
import { useHistory, useLocation } from 'react-router-dom';
import { OutsideBusinessHoursHint, PageReturn, PNVBanner, TemporarilyBarredHint, Verification } from '@/components';
import { BUY_SELL_URL } from '@/constants';
import {
    useGetBusinessHours,
    useGetPhoneNumberVerification,
    useIsAdvertiser,
    useIsAdvertiserBarred,
} from '@/hooks/custom-hooks';
import { useTranslations } from '@deriv-com/translations';
import { Loader } from '@deriv-com/ui';
import { BuySellTable } from '../BuySellTable';
import './BuySell.scss';

const BuySell = () => {
    const { localize } = useTranslations();
    const isAdvertiser = useIsAdvertiser();
    const { isGetSettingsLoading, isPhoneNumberVerified } = useGetPhoneNumberVerification();
    const { isScheduleAvailable } = useGetBusinessHours();
    const isAdvertiserBarred = useIsAdvertiserBarred();
    const history = useHistory();
    const location = useLocation();
    const verified = new URLSearchParams(location.search).get('verified');

    if (isGetSettingsLoading) {
        return <Loader />;
    }

    if (verified === 'false') {
        return (
            <div className='buy-sell--not-verified'>
                <PageReturn
                    onClick={() => history.replace({ pathname: BUY_SELL_URL, search: '' })}
                    pageTitle={localize('Verification')}
                    weight='bold'
                />
                <Verification />
            </div>
        );
    }

    return (
        <div
            className={clsx('buy-sell relative', {
                'buy-sell--barred': isAdvertiserBarred,
                'buy-sell--outside-hours': !isScheduleAvailable && !isAdvertiserBarred,
            })}
        >
            {isAdvertiserBarred && <TemporarilyBarredHint />}
            {!isScheduleAvailable && !isAdvertiserBarred && <OutsideBusinessHoursHint />}
            {isAdvertiser && !isPhoneNumberVerified && <PNVBanner />}
            <BuySellTable />
        </div>
    );
};

export default BuySell;
