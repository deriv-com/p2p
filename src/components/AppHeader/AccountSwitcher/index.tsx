import { api } from '@/hooks';
import { CurrencyUsdIcon } from '@deriv/quill-icons';
import { AccountSwitcher as UIAccountSwitcher } from '@deriv-com/ui';
import { FormatUtils } from '@deriv-com/utils';

export const AccountSwitcher = () => {
    const { data } = api.account.useActiveAccount();
    const activeAccount = {
        balance: FormatUtils.formatMoney(data?.balance ?? 0),
        currency: data?.currency || 'USD',
        currencyLabel: data?.currency || 'US Dollar',
        icon: <CurrencyUsdIcon iconSize='sm' />,
        isActive: true,
        isVirtual: Boolean(data?.is_virtual),
        loginid: data?.loginid || '',
    };
    return data && <UIAccountSwitcher activeAccount={activeAccount} buttonClassName='mr-4' isDisabled />;
};
