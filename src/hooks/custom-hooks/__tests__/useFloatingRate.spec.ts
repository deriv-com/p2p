import { renderHook } from '@testing-library/react';
import useFloatingRate from '../useFloatingRate';

const mockSettings = {
    fixed_rate_adverts_end_date: '2021-07-01',
    floatRateOffsetLimitString: '0.5',
    rateType: 'float',
    reachedTargetDate: true,
};

jest.mock('../../api', () => ({
    settings: {
        useSettings: jest.fn(() => ({ data: mockSettings })),
    },
}));

describe('useFloatingRate', () => {
    it('should return the correct values', () => {
        const { result } = renderHook(() => useFloatingRate());
        expect(result.current).toEqual({
            fixedRateAdvertsEndDate: '2021-07-01',
            floatRateOffsetLimitString: '0.5',
            rateType: 'float',
            reachedTargetDate: true,
        });
    });
});
