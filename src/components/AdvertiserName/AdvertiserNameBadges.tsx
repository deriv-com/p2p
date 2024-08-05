import { DeepPartial, TAdvertiserStats } from 'types';
import { Badge } from '@/components';
import { useTranslations } from '@deriv-com/translations';
import './AdvertiserNameBadges.scss';

/**
 * This component is used to show an advertiser's badge, for instance:
 * +100 Trades, ID verified, Address not verified, etc
 *
 * Use cases are usually in My Profile page and Advertiser page used under the advertiser's name
 */
const AdvertiserNameBadges = ({ advertiserStats }: { advertiserStats: DeepPartial<TAdvertiserStats> }) => {
    const { isAddressVerified, isIdentityVerified, totalOrders } = advertiserStats || {};
    const { localize } = useTranslations();
    const getStatus = (isVerified?: boolean) => (isVerified ? localize('verified') : localize('not verified'));
    const getVariant = (isVerified?: boolean) => (isVerified ? localize('success') : localize('general'));

    return (
        <div className='advertiser-name-badges' data-testid='dt_advertiser_name_badges'>
            {(totalOrders || 0) >= 100 && <Badge label='100+' status={localize('trades')} variant='warning' />}
            <Badge
                label={localize('ID')}
                status={getStatus(isIdentityVerified)}
                variant={getVariant(isIdentityVerified)}
            />
            <Badge
                label={localize('Address')}
                status={getStatus(isAddressVerified)}
                variant={getVariant(isAddressVerified)}
            />
        </div>
    );
};
AdvertiserNameBadges.displayName = 'AdvertiserNameBadges';

export default AdvertiserNameBadges;
