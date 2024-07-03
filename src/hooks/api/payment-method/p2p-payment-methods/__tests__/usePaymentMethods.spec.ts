import { useP2pPaymentMethods } from '@deriv-com/api-hooks';
import { renderHook } from '@testing-library/react';
import usePaymentMethods from '../usePaymentMethods';

jest.mock('@deriv-com/api-hooks', () => ({
    useP2pPaymentMethods: jest.fn().mockReturnValue({ data: undefined }),
}));

const mockPaymentMethods = {
    alipay: {
        display_name: 'Alipay',
        fields: {
            account: {
                display_name: 'Alipay ID',
                required: 1,
                type: 'text',
            },
            instructions: {
                display_name: 'Instructions',
                required: 0,
                type: 'memo',
            },
        },
        type: 'ewallet',
    },
    paypal: {
        display_name: 'PayPal',
        fields: {
            account: {
                display_name: 'Email or phone number',
                required: 1,
                type: 'text',
            },
            instructions: {
                display_name: 'Instructions',
                required: 0,
                type: 'memo',
            },
        },
        type: 'ewallet',
    },
};

const mockUseP2pPaymentMethods = useP2pPaymentMethods as jest.Mock;

describe('usePaymentMethods', () => {
    it('should return undefined if data is undefined', () => {
        const { result } = renderHook(() => usePaymentMethods());
        expect(result.current.data).toBeUndefined();
    });

    it('should return the modified payment methods if data is available', () => {
        mockUseP2pPaymentMethods.mockReturnValueOnce({
            data: mockPaymentMethods,
        });

        const { result } = renderHook(() => usePaymentMethods());
        expect(result.current.data).toEqual([
            {
                display_name: 'Alipay',
                fields: {
                    account: {
                        display_name: 'Alipay ID',
                        required: 1,
                        type: 'text',
                    },
                    instructions: {
                        display_name: 'Instructions',
                        required: 0,
                        type: 'memo',
                    },
                },
                id: 'alipay',
                type: 'ewallet',
            },
            {
                display_name: 'PayPal',
                fields: {
                    account: {
                        display_name: 'Email or phone number',
                        required: 1,
                        type: 'text',
                    },
                    instructions: {
                        display_name: 'Instructions',
                        required: 0,
                        type: 'memo',
                    },
                },
                id: 'paypal',
                type: 'ewallet',
            },
        ]);
    });
});
