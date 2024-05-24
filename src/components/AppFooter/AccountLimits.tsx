import { LegacyAccountLimitsIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { TooltipMenuIcon } from '@deriv-com/ui';

const AccountLimits = () => {
    const { localize } = useTranslations();

    return (
        <TooltipMenuIcon
            as='a'
            className='app-footer__icon'
            href='https://app.deriv.com/account/account-limits'
            tooltipContent={localize('Account limits')}
        >
            <LegacyAccountLimitsIcon iconSize='xs' />
        </TooltipMenuIcon>
    );
};

export default AccountLimits;
