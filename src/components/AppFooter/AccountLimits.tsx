import { ACCOUNT_LIMITS } from '@/constants';
import { LegacyAccountLimitsIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { TooltipMenuIcon } from '../TooltipMenuIcon';

const AccountLimits = () => {
    const { localize } = useTranslations();

    return (
        <TooltipMenuIcon
            as='a'
            className='app-footer__icon'
            href={ACCOUNT_LIMITS}
            tooltipContent={localize('Account limits')}
        >
            <LegacyAccountLimitsIcon iconSize='xs' />
        </TooltipMenuIcon>
    );
};

export default AccountLimits;
