import { renderHook } from '@testing-library/react';
import useGetPhoneNumberVerification from '../useGetPhoneNumberVerification';

const mockSettings = {
    phone: '1234567890',
    phone_number_verification: {
        verified: 0,
    },
};

const mockP2PSettings = {
    pnv_required: 0,
};

jest.mock('@deriv-com/api-hooks', () => ({
    useGetSettings: jest.fn(() => ({ data: mockSettings })),
}));

jest.mock('../../api', () => ({
    settings: {
        useSettings: jest.fn(() => ({ data: mockP2PSettings })),
    },
}));

describe('useGetPhoneNumberVerification', () => {
    it('should return isPhoneNumberVerificationEnabled false, the phone number and false if the phone number is not verified', () => {
        const { result } = renderHook(() => useGetPhoneNumberVerification());

        expect(result.current.isPhoneNumberVerificationEnabled).toBe(false);
        expect(result.current.isPhoneNumberVerified).toBe(false);
        expect(result.current.phoneNumber).toBe('1234567890');
    });

    it('should return isPhoneNumberVerificationEnabled true, the phone number and true if the phone number is verified and pnv_required is true', () => {
        mockSettings.phone_number_verification.verified = 1;
        mockP2PSettings.pnv_required = 1;
        const { result } = renderHook(() => useGetPhoneNumberVerification());

        expect(result.current.isPhoneNumberVerificationEnabled).toBe(true);
        expect(result.current.isPhoneNumberVerified).toBe(true);
        expect(result.current.phoneNumber).toBe('1234567890');
    });
});
