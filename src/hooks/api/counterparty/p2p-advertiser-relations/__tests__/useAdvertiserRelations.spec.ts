import { useP2PAdvertiserRelations } from '@deriv-com/api-hooks';
import { renderHook } from '@testing-library/react';
import useAdvertiserRelations from '../useAdvertiserRelations';

jest.mock('@deriv-com/api-hooks', () => ({
    useP2PAdvertiserRelations: jest.fn().mockReturnValue({
        data: undefined,
        mutate: jest.fn(),
        rest: {},
    }),
}));

const mockInvalidate = jest.fn();

jest.mock('../../../useInvalidateQuery', () => () => mockInvalidate);

const mockUseP2PAdvertiserRelations = useP2PAdvertiserRelations as jest.Mock;

describe('useAdvertiserRelations', () => {
    it('should return data as undefined if not defined', () => {
        const { result } = renderHook(() => useAdvertiserRelations());

        expect(result.current.data).toBeUndefined();
    });

    it('should return blockedAdvertisers as empty if not present', () => {
        mockUseP2PAdvertiserRelations.mockReturnValueOnce({
            data: {
                blocked_advertisers: [],
                favourite_advertisers: [
                    {
                        created_time: 1627584000,
                        id: '19',
                        name: 'client CR123',
                    },
                ],
            },
            mutate: jest.fn(),
            rest: {},
        });

        const { result } = renderHook(() => useAdvertiserRelations());

        expect(result.current.blockedAdvertisers).toEqual([]);

        expect(result.current.favouriteAdvertisers).toEqual([
            {
                created_time: 1627584000,
                id: '19',
                name: 'client CR123',
            },
        ]);
    });

    it('should return favouriteAdvertisers as empty if not present', () => {
        mockUseP2PAdvertiserRelations.mockReturnValueOnce({
            data: {
                blocked_advertisers: [
                    {
                        created_time: 1627584000,
                        id: '19',
                        name: 'client CR123',
                    },
                ],
                favourite_advertisers: [],
            },
            mutate: jest.fn(),
            rest: {},
        });

        const { result } = renderHook(() => useAdvertiserRelations());

        expect(result.current.favouriteAdvertisers).toEqual([]);

        expect(result.current.blockedAdvertisers).toEqual([
            {
                created_time: 1627584000,
                id: '19',
                name: 'client CR123',
            },
        ]);
    });

    it('should call invalidate when onSuccess is called', () => {
        renderHook(() => useAdvertiserRelations());

        const onSuccess = mockUseP2PAdvertiserRelations.mock.calls[0][0].onSuccess;

        onSuccess();

        expect(mockInvalidate).toHaveBeenCalledTimes(2);
        expect(mockInvalidate).toHaveBeenCalledWith('p2p_advertiser_relations');
        expect(mockInvalidate).toHaveBeenCalledWith('p2p_advertiser_list');
    });
});
