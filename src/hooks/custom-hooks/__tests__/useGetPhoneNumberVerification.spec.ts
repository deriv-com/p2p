import { renderHook } from '@testing-library/react';
import useGetPhoneNumberVerification from '../useGetPhoneNumberVerification';

const mockSettings = {
    phone: '1234567890',
    phone_number_verification: {
        verified: 0,
    },
};

jest.mock('@deriv-com/api-hooks', () => ({
    useGetSettings: jest.fn(() => ({ data: mockSettings })),
}));

describe('useGetPhoneNumberVerification', () => {
    it('should return the phone number and false if the phone number is not verified', () => {
        const { result } = renderHook(() => useGetPhoneNumberVerification());

        expect(result.current.isPhoneNumberVerified).toBe(false);
        expect(result.current.phoneNumber).toBe('1234567890');
    });

    it('should return the phone number and true if the phone number is verified', () => {
        mockSettings.phone_number_verification.verified = 1;
        const { result } = renderHook(() => useGetPhoneNumberVerification());

        expect(result.current.isPhoneNumberVerified).toBe(true);
        expect(result.current.phoneNumber).toBe('1234567890');
    });
});
