import { api } from '@/hooks';
import { useAccountList, useAuthData } from '@deriv-com/api-hooks';
import { renderHook } from '@testing-library/react';
import useActiveAccount from '../useActiveAccount';

jest.mock('@deriv-com/api-hooks', () => ({
    useAccountList: jest.fn().mockReturnValue({ data: [] }),
    useAuthData: jest.fn().mockReturnValue({ activeLoginid: '' }),
}));

jest.mock('@/hooks', () => ({
    api: {
        account: {
            useBalance: jest.fn().mockReturnValue({ data: {} }),
        },
    },
}));

const mockAccountList = [
    {
        account_category: 'trading',
        account_type: 'type',
        broker: 'CR',
        created_at: 1718953961,
        currency: 'USD',
        currency_type: 'fiat',
        is_disabled: 0,
        is_virtual: 0,
        landing_company_name: 'name',
        linked_to: [],
        loginid: 'CR00001',
    },
    {
        account_category: 'trading',
        account_type: 'type',
        broker: 'VRTC',
        created_at: 1718953961,
        currency: 'USD',
        currency_type: 'fiat',
        is_disabled: 0,
        is_virtual: 1,
        landing_company_name: 'virtual_name',
        linked_to: [],
        loginid: 'VRTC00001',
    },
];

const mockBalanceData = {
    accounts: {
        CR00001: {
            balance: 10001,
            converted_amount: 10001,
            currency: 'USD',
            demo_account: 0,
            status: 1,
            type: 'deriv',
        },
        VRTC00001: {
            balance: 10000,
            converted_amount: 10000,
            currency: 'USD',
            demo_account: 1,
            status: 1,
            type: 'deriv',
        },
    },
    balance: 10001,
    currency: 'USD',
    loginid: 'CR00001',
    total: {
        deriv: {
            amount: 10001,
            currency: 'USD',
        },
        deriv_demo: {
            amount: 10000,
            currency: 'USD',
        },
        mt5: {
            amount: 0,
            currency: 'USD',
        },
        mt5_demo: {
            amount: 0,
            currency: 'USD',
        },
    },
};
const mockUseAccountList = useAccountList as jest.Mock;
const mockUseAuthData = useAuthData as jest.Mock;
const mockUseBalance = api.account.useBalance as jest.Mock;

describe('useActiveAccount', () => {
    it('should return undefined if no active account was found', () => {
        mockUseAccountList.mockReturnValue({ data: mockAccountList });
        mockUseAuthData.mockReturnValue({ activeLoginid: 'VRTC00002' });
        mockUseBalance.mockReturnValue({ data: mockBalanceData });

        const { result } = renderHook(() => useActiveAccount());

        expect(result.current.data).toBeUndefined();
    });

    it('should return the active account with the correct balance', () => {
        mockUseAccountList.mockReturnValue({ data: mockAccountList });
        mockUseAuthData.mockReturnValue({ activeLoginid: 'CR00001' });
        mockUseBalance.mockReturnValue({ data: mockBalanceData });

        const { result } = renderHook(() => useActiveAccount());

        expect(result.current.data).toEqual({
            account_category: 'trading',
            account_type: 'type',
            balance: 10001,
            broker: 'CR',
            created_at: 1718953961,
            currency: 'USD',
            currency_type: 'fiat',
            is_disabled: 0,
            is_virtual: 0,
            landing_company_name: 'name',
            linked_to: [],
            loginid: 'CR00001',
        });
    });

    it('should return balance as 0 if balance data is not available', () => {
        mockUseAccountList.mockReturnValue({ data: mockAccountList });
        mockUseAuthData.mockReturnValue({ activeLoginid: 'CR00001' });
        mockUseBalance.mockReturnValue({ data: {} });

        const { result } = renderHook(() => useActiveAccount());

        expect(result.current.data).toEqual({
            account_category: 'trading',
            account_type: 'type',
            balance: 0,
            broker: 'CR',
            created_at: 1718953961,
            currency: 'USD',
            currency_type: 'fiat',
            is_disabled: 0,
            is_virtual: 0,
            landing_company_name: 'name',
            linked_to: [],
            loginid: 'CR00001',
        });
    });
});
