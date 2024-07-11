import { act, renderHook } from '@testing-library/react';
import useFullScreen from '../useFullScreen';

describe('useFullScreen', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should add and remove fullscreen event listeners', () => {
        const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
        const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

        const { unmount } = renderHook(() => useFullScreen());

        expect(addEventListenerSpy).toHaveBeenCalledWith('fullscreenchange', expect.any(Function), false);
        expect(addEventListenerSpy).toHaveBeenCalledWith('webkitfullscreenchange', expect.any(Function), false);
        expect(addEventListenerSpy).toHaveBeenCalledWith('mozfullscreenchange', expect.any(Function), false);
        expect(addEventListenerSpy).toHaveBeenCalledWith('MSFullscreenChange', expect.any(Function), false);

        unmount();

        expect(removeEventListenerSpy).toHaveBeenCalledWith('fullscreenchange', expect.any(Function), false);
        expect(removeEventListenerSpy).toHaveBeenCalledWith('webkitfullscreenchange', expect.any(Function), false);
        expect(removeEventListenerSpy).toHaveBeenCalledWith('mozfullscreenchange', expect.any(Function), false);
        expect(removeEventListenerSpy).toHaveBeenCalledWith('MSFullscreenChange', expect.any(Function), false);
    });

    it('should call requestFullscreen when trying to enter fullscreen', () => {
        const requestFullscreenMock = jest.fn();
        document.documentElement.requestFullscreen = requestFullscreenMock;
        const { result } = renderHook(() => useFullScreen());

        act(() => {
            result.current.toggleFullScreenMode();
        });

        expect(requestFullscreenMock).toHaveBeenCalled();
    });

    it('should clean up event listeners on unmount', () => {
        const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
        const { unmount } = renderHook(() => useFullScreen());

        unmount();

        expect(removeEventListenerSpy).toHaveBeenCalledTimes(4);
    });
});
