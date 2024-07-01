import { renderHook } from '@testing-library/react';
import useAdvertiserRelations from '../useAdvertiserRelations';
import useAdvertiserRelationsAddBlocked from '../useAdvertiserRelationsAddBlocked';

jest.mock('../useAdvertiserRelations', () => ({
    __esModule: true,
    default: jest.fn().mockReturnValue({
        blockedAdvertisers: [],
        data: undefined,
        favouriteAdvertisers: [],
        mutate: jest.fn(),
        mutation: {},
    }),
}));

const mockUseAdvertiserRelations = useAdvertiserRelations as jest.Mock;

describe('useAdvertiserRelationsAddBlocked', () => {
    it('should call mutate with the correct arguments', () => {
        const { result } = renderHook(() => useAdvertiserRelationsAddBlocked());

        result.current.mutate([1]);

        expect(mockUseAdvertiserRelations().mutate).toHaveBeenCalledWith({
            add_blocked: [1],
        });
    });
});
