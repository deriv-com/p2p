import { renderHook } from '@testing-library/react';
import useAdvertiserRelations from '../useAdvertiserRelations';
import useAdvertiserRelationsRemoveBlocked from '../useAdvertiserRelationsRemoveBlocked';

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

describe('useAdvertiserRelationsRemoveBlocked', () => {
    it('should call mutate with the correct arguments', () => {
        const { result } = renderHook(() => useAdvertiserRelationsRemoveBlocked());

        result.current.mutate([1]);

        expect(mockUseAdvertiserRelations().mutate).toHaveBeenCalledWith({
            remove_blocked: [1],
        });
    });
});
