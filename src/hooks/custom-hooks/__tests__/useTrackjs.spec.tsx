import { TrackJS } from 'trackjs';
import { useAuthData } from '@deriv-com/api-hooks';
import { renderHook } from '@testing-library/react';
import useTrackjs from '../useTrackjs';

jest.mock('trackjs');
jest.mock('@deriv-com/api-hooks');
(useAuthData as jest.Mock).mockReturnValue({ activeLoginid: 'test-loginid' });

describe('useTrackjs', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        Object.defineProperty(window, 'location', {
            value: { host: 'localhost' },
            writable: true,
        });

        const mockQuerySelector = jest.spyOn(document, 'querySelector');
        mockQuerySelector.mockImplementation(selector => {
            if (selector === 'meta[name=version]') {
                return { content: 'test-version' } as HTMLMetaElement;
            }
            return null;
        });
    });

    it('should initialize TrackJS with correct parameters', () => {
        const { result } = renderHook(() => useTrackjs());

        result.current.init();

        expect(TrackJS.install).toHaveBeenCalledWith({
            application: 'deriv-p2p',
            dedupe: false,
            enabled: false,
            token: 'test-token',
            userId: 'test-loginid',
            version: 'test-version',
        });
    });
});
