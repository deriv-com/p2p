import { useShouldRedirectToLowCodeHub } from '@/hooks';
import { LegacyAccountLimitsIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { Tooltip } from '@deriv-com/ui';

const AccountLimits = () => {
    const { localize } = useTranslations();
    const redirectLink = useShouldRedirectToLowCodeHub('account-limits');

    return (
        <Tooltip as='a' className='app-footer__icon' href={redirectLink} tooltipContent={localize('Account limits')}>
            <LegacyAccountLimitsIcon iconSize='xs' />
        </Tooltip>
    );
};

export default AccountLimits;
