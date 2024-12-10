import { DeepPartial, TAdvertiserStats } from 'types';
import { Badge } from '@/components';
import { useGetPhoneNumberVerification } from '@/hooks';
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
    const { isPhoneNumberVerificationEnabled, isPhoneNumberVerified } = useGetPhoneNumberVerification();
    const { localize } = useTranslations();
    const getStatus = (isVerified?: boolean) => (isVerified ? localize('verified') : localize('not verified'));
    const getVariant = (isVerified?: boolean) => (isVerified ? 'success' : 'general');

    return (
        <div className='advertiser-name-badges' data-testid='dt_advertiser_name_badges'>
            {(totalOrders || 0) >= 100 && <Badge status={localize('trades')} tradeCount={totalOrders} />}
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
            {isPhoneNumberVerificationEnabled && (
                <Badge
                    label={localize('Mobile')}
                    status={getStatus(isPhoneNumberVerified)}
                    variant={getVariant(isPhoneNumberVerified)}
                />
            )}
        </div>
    );
};
AdvertiserNameBadges.displayName = 'AdvertiserNameBadges';

export default AdvertiserNameBadges;
