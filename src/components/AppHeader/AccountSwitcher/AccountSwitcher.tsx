import { lazy } from 'react';
import { useActiveAccount } from '@/hooks/api/account';
import { AccountSwitcher as UIAccountSwitcher } from '@deriv-com/ui';
import { FormatUtils } from '@deriv-com/utils';

type TActiveAccount = NonNullable<ReturnType<typeof useActiveAccount>['data']>;
type TAccountSwitcherProps = {
    account: TActiveAccount;
};

const CurrencyIcon = lazy(() => import('../CurrencyIcon').then(module => ({ default: module.CurrencyIcon })));

const AccountSwitcher = ({ account }: TAccountSwitcherProps) => {
    const activeAccount = {
        balance: FormatUtils.formatMoney(account?.balance ?? 0),
        currency: account?.currency || 'USD',
        currencyLabel: account?.currency || 'US Dollar',
        icon: <CurrencyIcon currency={account?.currency} isVirtual={Boolean(account?.is_virtual)} />,
        isActive: true,
        isVirtual: Boolean(account?.is_virtual),
        loginid: account?.loginid || '',
    };
    return account && <UIAccountSwitcher activeAccount={activeAccount} isDisabled />;
};

export default AccountSwitcher;
