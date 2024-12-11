import { renderHook } from '@testing-library/react';
import useGetPhoneNumberVerification from '../useGetPhoneNumberVerification';
import useIsAdvertiser from '../useIsAdvertiser';
import useIsAdvertiserNotVerified from '../useIsAdvertiserNotVerified';
import usePoiPoaStatus from '../usePoiPoaStatus';

jest.mock('../useGetPhoneNumberVerification');
jest.mock('../useIsAdvertiser');
jest.mock('../usePoiPoaStatus');

const mockUseGetPhoneNumberVerification = useGetPhoneNumberVerification as jest.Mock;
const mockUseIsAdvertiser = useIsAdvertiser as jest.Mock;
const mockUsePoiPoaStatus = usePoiPoaStatus as jest.Mock;

describe('useIsAdvertiserNotVerified', () => {
    it('should return true if user is not an advertiser and POI/POA is not verified', () => {
        mockUseGetPhoneNumberVerification.mockReturnValue({ shouldShowVerification: false });
        mockUseIsAdvertiser.mockReturnValue(false);
        mockUsePoiPoaStatus.mockReturnValue({ data: { isPoiPoaVerified: false } });

        const { result } = renderHook(() => useIsAdvertiserNotVerified());

        expect(result.current).toBe(true);
    });

    it('should return true if user is not an advertiser and should show verification', () => {
        mockUseGetPhoneNumberVerification.mockReturnValue({ shouldShowVerification: true });
        mockUseIsAdvertiser.mockReturnValue(false);
        mockUsePoiPoaStatus.mockReturnValue({ data: { isPoiPoaVerified: true } });

        const { result } = renderHook(() => useIsAdvertiserNotVerified());

        expect(result.current).toBe(true);
    });

    it('should return false if user is an advertiser', () => {
        mockUseGetPhoneNumberVerification.mockReturnValue({ shouldShowVerification: true });
        mockUseIsAdvertiser.mockReturnValue(true);
        mockUsePoiPoaStatus.mockReturnValue({ data: { isPoiPoaVerified: false } });

        const { result } = renderHook(() => useIsAdvertiserNotVerified());

        expect(result.current).toBe(false);
    });

    it('should return false if user is not an advertiser but POI/POA is verified and should not show verification', () => {
        mockUseGetPhoneNumberVerification.mockReturnValue({ shouldShowVerification: false });
        mockUseIsAdvertiser.mockReturnValue(false);
        mockUsePoiPoaStatus.mockReturnValue({ data: { isPoiPoaVerified: true } });

        const { result } = renderHook(() => useIsAdvertiserNotVerified());

        expect(result.current).toBe(false);
    });
});
