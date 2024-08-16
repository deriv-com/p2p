import { renderHook } from '@testing-library/react';
import useGrowthbookGetFeatureValue from '../useGrowthbookGetFeatureValue';
import useOAuth2Enabled from '../useOAuth2Enabled';

jest.mock('@/constants', () => ({
    getServerInfo: jest.fn(() => ({
        appId: '111', // emulate local appId
    })),
}));

jest.mock('../useGrowthbookGetFeatureValue');

describe('useOAuth2Enabled', () => {
    it('OAuth 2 enabled', () => {
        const emulateAppIdAvailable = [
            {},
            {
                enabled_for: ['111'],
            },
        ];
        (useGrowthbookGetFeatureValue as jest.Mock).mockReturnValue([emulateAppIdAvailable, true]);
        const { result } = renderHook(() => useOAuth2Enabled());

        expect(result.current).toStrictEqual([true]);
    });

    it('OAuth 2 disabled', () => {
        const emulateAppIdAvailable = [
            {},
            {
                enabled_for: ['112'],
            },
        ];
        (useGrowthbookGetFeatureValue as jest.Mock).mockReturnValue([emulateAppIdAvailable, true]);
        const { result } = renderHook(() => useOAuth2Enabled());

        expect(result.current).toStrictEqual([false]);
    });
});
