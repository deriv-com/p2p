import { useGetAccountStatus } from '@deriv-com/api-hooks';
import { renderHook } from '@testing-library/react';
import { api } from '../..';
import useIsP2PBlocked from '../useIsP2PBlocked';

jest.mock('@deriv-com/api-hooks', () => ({
    useGetAccountStatus: jest.fn(() => ({ data: undefined })),
}));

jest.mock('../..', () => ({
    api: {
        account: {
            useActiveAccount: jest.fn(() => ({ data: undefined })),
        },
    },
}));

const mockUseGetAccountStatus = useGetAccountStatus as jest.Mock;
const mockUseActiveAccount = api.account.useActiveAccount as jest.Mock;

describe('useIsP2PBlocked', () => {
    it('should return isP2PBlocked as undefined and status as empty string when accountStatus is not defined', () => {
        const { result } = renderHook(() => useIsP2PBlocked());
        expect(result.current).toStrictEqual({ isP2PBlocked: false, status: 'p2pBlocked' });
    });

    it('should return isP2PBlocked as false and status as empty string if user can use p2p', () => {
        mockUseGetAccountStatus.mockImplementation(() => ({ data: { p2p_status: 'none', status: [] } }));
        mockUseActiveAccount.mockImplementation(() => ({ data: { currency: 'USD', is_virtual: 0 } }));

        const { result } = renderHook(() => useIsP2PBlocked());
        expect(result.current).toStrictEqual({ isP2PBlocked: false, status: 'p2pBlocked' });
    });

    it('should return isP2PBlocked as true and status as p2pBlocked if p2p_status is perm banned', () => {
        mockUseGetAccountStatus.mockImplementation(() => ({ data: { p2p_status: 'perm_ban', status: [] } }));
        mockUseActiveAccount.mockImplementation(() => ({ data: { currency: 'USD', is_virtual: 0 } }));

        const { result } = renderHook(() => useIsP2PBlocked());
        expect(result.current).toStrictEqual({ isP2PBlocked: true, status: 'p2pBlocked' });
    });

    it('should return isP2PBlocked as true and status as cashierLocked if status has cashier_locked', () => {
        mockUseGetAccountStatus.mockImplementation(() => ({
            data: { p2p_status: 'none', status: ['cashier_locked'] },
        }));
        mockUseActiveAccount.mockImplementation(() => ({ data: { currency: 'USD', is_virtual: 0 } }));

        const { result } = renderHook(() => useIsP2PBlocked());
        expect(result.current).toStrictEqual({ isP2PBlocked: true, status: 'cashierLocked' });
    });

    it('should return isP2PBlocked as true and status as systemMaintenance if cashier_validation has system_maintenance', () => {
        mockUseGetAccountStatus.mockImplementation(() => ({
            data: { cashier_validation: ['system_maintenance'], p2p_status: 'none', status: [] },
        }));
        mockUseActiveAccount.mockImplementation(() => ({ data: { currency: 'USD', is_virtual: 0 } }));

        const { result } = renderHook(() => useIsP2PBlocked());
        expect(result.current).toStrictEqual({ isP2PBlocked: true, status: 'systemMaintenance' });
    });

    it('should return isP2PBlocked as true and status as crypto if currency_type is crypto', () => {
        mockUseGetAccountStatus.mockImplementation(() => ({ data: { p2p_status: 'none', status: [] } }));
        mockUseActiveAccount.mockImplementation(() => ({ data: { currency_type: 'crypto', is_virtual: 0 } }));

        const { result } = renderHook(() => useIsP2PBlocked());
        expect(result.current).toStrictEqual({ isP2PBlocked: true, status: 'crypto' });
    });

    it('should return isP2PBlocked as true and status as demo if account is virtual', () => {
        mockUseGetAccountStatus.mockImplementation(() => ({ data: { p2p_status: 'none', status: [] } }));
        mockUseActiveAccount.mockImplementation(() => ({ data: { currency: 'USD', is_virtual: 1 } }));

        const { result } = renderHook(() => useIsP2PBlocked());
        expect(result.current).toStrictEqual({ isP2PBlocked: true, status: 'demo' });
    });

    it('should return isP2PBlocked as true and status as nonUSD if currency is not USD', () => {
        mockUseGetAccountStatus.mockImplementation(() => ({ data: { p2p_status: 'none', status: [] } }));
        mockUseActiveAccount.mockImplementation(() => ({ data: { currency: 'EUR', is_virtual: 0 } }));

        const { result } = renderHook(() => useIsP2PBlocked());
        expect(result.current).toStrictEqual({ isP2PBlocked: true, status: 'nonUSD' });
    });
});
