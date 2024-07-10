import { useMemo } from 'react';
import { getBlockedType } from '@/utils';
import { useGetAccountStatus } from '@deriv-com/api-hooks';
import { api } from '..';

// TODO: add other blocked statuses when implementing high risk scenarios
/**
 * A custom hook that returns the P2P blocked status and the status type.
 * @returns {object} { isP2PBlocked: boolean, status: string }
 */
const useIsP2PBlocked = () => {
    const { data: accountStatus } = useGetAccountStatus();
    const { data: activeAccountData } = api.account.useActiveAccount();

    const isAccountBlocked = useMemo(() => {
        if (!accountStatus) return false;

        const isPermBan = accountStatus.p2p_status === 'perm_ban';
        const isSystemMaintenance = accountStatus?.cashier_validation?.includes('system_maintenance');
        const isCashierLocked = accountStatus.status.includes('cashier_locked');

        return isPermBan || isSystemMaintenance || isCashierLocked;
    }, [accountStatus]);

    const accountBlockStatus = useMemo(() => {
        if (!accountStatus) return '';

        if (accountStatus?.cashier_validation?.includes('system_maintenance')) return 'systemMaintenance';
        if (accountStatus.status.includes('cashier_locked')) return 'cashierLocked';
        if (accountStatus.p2p_status === 'perm_ban') return 'p2pBlocked';

        return '';
    }, [accountStatus]);

    const isP2PNotSupported = useMemo(() => {
        if (!activeAccountData) return false;

        return activeAccountData.is_virtual || activeAccountData.currency !== 'USD';
    }, [activeAccountData]);

    const blockedType = useMemo(
        () => (activeAccountData ? getBlockedType(activeAccountData) : ''),
        [activeAccountData]
    );

    const isP2PBlocked = Boolean(isAccountBlocked || isP2PNotSupported);
    const status = isAccountBlocked ? accountBlockStatus : blockedType;

    return { isP2PBlocked, status: status || '' };
};

export default useIsP2PBlocked;
