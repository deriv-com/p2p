import { useTranslations } from '@deriv-com/translations';
import { renderHook } from '@testing-library/react';
import useIsRtl from '../useIsRtl';

jest.mock('@deriv-com/translations', () => ({
    useTranslations: jest.fn().mockReturnValue({
        instance: {
            dir: jest.fn().mockReturnValue('rtl'),
        },
    }),
}));

describe('useIsRtl', () => {
    it('should return true if the language direction is rtl', () => {
        const { result } = renderHook(() => useIsRtl());
        expect(result.current).toBe(true);
    });

    it('should return false if the language direction is ltr', () => {
        (useTranslations as jest.Mock).mockReturnValue({
            instance: {
                dir: jest.fn().mockReturnValue('ltr'),
            },
        });
        const { result } = renderHook(() => useIsRtl());
        expect(result.current).toBe(false);
    });
});
