import { useP2PAdvertiserPaymentMethods } from '@deriv-com/api-hooks';
import { renderHook } from '@testing-library/react';
import useAdvertiserPaymentMethods from '../useAdvertiserPaymentMethods';

jest.mock('@deriv-com/api-hooks', () => ({
    useP2PAdvertiserPaymentMethods: jest.fn().mockReturnValue({ data: undefined }),
}));

const mockAdvertiserPaymentMethods = {
    '350': {
        display_name: 'Alipay',
        fields: {
            account: {
                display_name: 'Alipay ID',
                required: 1,
                type: 'text',
                value: '234',
            },
            instructions: {
                display_name: 'Instructions',
                required: 0,
                type: 'memo',
                value: '32t2',
            },
        },
        is_enabled: 1,
        method: 'alipay',
        type: 'ewallet',
        used_by_adverts: null,
        used_by_orders: null,
    },
};

const mockUseP2PAdvertiserPaymentMethods = useP2PAdvertiserPaymentMethods as jest.Mock;

describe('useAdvertiserPaymentMethods', () => {
    it('should return undefined if data is undefined', () => {
        const { result } = renderHook(() => useAdvertiserPaymentMethods());
        expect(result.current.data).toBeUndefined();
    });

    it('should return the modified payment methods if data is available', () => {
        mockUseP2PAdvertiserPaymentMethods.mockReturnValue({ data: mockAdvertiserPaymentMethods });
        const { result } = renderHook(() => useAdvertiserPaymentMethods());
        expect(result.current.data).toEqual([
            {
                display_name: 'Alipay',
                fields: {
                    account: {
                        display_name: 'Alipay ID',
                        required: 1,
                        type: 'text',
                        value: '234',
                    },
                    instructions: {
                        display_name: 'Instructions',
                        required: 0,
                        type: 'memo',
                        value: '32t2',
                    },
                },
                id: '350',
                is_enabled: 1,
                method: 'alipay',
                type: 'ewallet',
                used_by_adverts: null,
                used_by_orders: null,
            },
        ]);
    });
});
