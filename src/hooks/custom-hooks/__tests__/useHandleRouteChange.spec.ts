import { useLocation } from 'react-router-dom';
import { renderHook } from '@testing-library/react';
import useHandleRouteChange from '../useHandleRouteChange';

jest.mock('react-router-dom', () => ({
    useLocation: jest.fn(),
}));

describe('useHandleRouteChange', () => {
    beforeEach(() => {
        (useLocation as jest.Mock).mockReset();
        window.dataLayer = [] as { [key: string]: boolean | number | string; event: string }[];
    });

    it('should push event to dataLayer on location change', () => {
        (useLocation as jest.Mock).mockReturnValue({ pathname: '/initial' });

        renderHook(() => useHandleRouteChange());

        expect(window.dataLayer).toEqual([{ event: 'page_load' }]);

        (useLocation as jest.Mock).mockReturnValue({ pathname: '/new-path' });

        renderHook(() => useHandleRouteChange());

        expect(window.dataLayer).toEqual([{ event: 'page_load' }, { event: 'page_load' }]);
    });
});
