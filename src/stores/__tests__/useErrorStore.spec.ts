import { act } from 'react';
import { renderHook } from '@testing-library/react';
import useErrorStore from '../useErrorStore';

describe('useErrorStore', () => {
    it('should update the store state correctly', () => {
        const { result } = renderHook(() => useErrorStore());

        expect(result.current.errorMessages).toEqual([]);

        act(() => {
            result.current.setErrorMessages({ code: 'error-code', message: 'error-message' });
        });

        expect(result.current.errorMessages).toEqual([{ code: 'error-code', message: 'error-message' }]);

        act(() => {
            result.current.setErrorMessages(null);
        });
    });

    it('should not add the same error message twice', () => {
        const { result } = renderHook(() => useErrorStore());

        expect(result.current.errorMessages).toEqual([]);

        act(() => {
            result.current.setErrorMessages({ code: 'error-code', message: 'error-message' });
        });

        expect(result.current.errorMessages).toEqual([{ code: 'error-code', message: 'error-message' }]);

        act(() => {
            result.current.setErrorMessages({ code: 'error-code', message: 'error-message' });
        });

        expect(result.current.errorMessages).toEqual([{ code: 'error-code', message: 'error-message' }]);

        act(() => {
            result.current.setErrorMessages(null);
        });
    });

    it('should reset the error messages', () => {
        const { result } = renderHook(() => useErrorStore());

        expect(result.current.errorMessages).toEqual([]);

        act(() => {
            result.current.setErrorMessages({ code: 'error-code', message: 'error-message' });
        });

        expect(result.current.errorMessages).toEqual([{ code: 'error-code', message: 'error-message' }]);

        act(() => {
            result.current.reset();
        });

        expect(result.current.errorMessages).toEqual([]);
    });
});
