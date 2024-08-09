import { renderHook } from '@testing-library/react';
import useGrowthbookGetFeatureValue from '../useGrowthbookGetFeatureValue';
import useOAuth2Enabled from '../useOAuth2Enabled';

jest.mock('../useNavigatorOnline');

describe('useOAuth2Enabled', () => {
    it('OAuth 2 enabled', () => {
        (useGrowthbookGetFeatureValue as jest.Mock).mockReturnValue(true);
        const { result } = renderHook(() => useOAuth2Enabled());
        expect(result.current).toBe([true]);
    });

    it('OAuth 2 disabled', () => {
        (useGrowthbookGetFeatureValue as jest.Mock).mockReturnValue(false);
        const { result } = renderHook(() => useOAuth2Enabled());
        expect(result.current).toBe([false]);
    });

    it('OAuth 2 enabled with different data', () => {
        (useGrowthbookGetFeatureValue as jest.Mock).mockReturnValue({ test: '1' });
        const { result } = renderHook(() => useOAuth2Enabled());
        expect(result.current).toBe([{ test: '1' }]);
    });
});
