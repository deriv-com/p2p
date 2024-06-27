import { useGetSettings, useServiceToken } from '@deriv-com/api-hooks';
import { renderHook } from '@testing-library/react';
import { useSendbirdServiceToken } from '..';

jest.mock('@deriv-com/api-hooks', () => ({
    useGetSettings: jest.fn(() => ({ isSuccess: true })),
    useServiceToken: jest.fn(() => ({})),
}));

describe('useSendbirdServiceToken', () => {
    it('should return a service token', async () => {
        (useServiceToken as jest.Mock).mockReturnValueOnce({
            data: {
                sendbird: {
                    app_id: 'A123-456-789',
                    expiry_time: 1234567890,
                    token: '0123445678901234567890',
                },
            },
        });
        const { result } = renderHook(() => useSendbirdServiceToken());
        expect(result.current.data?.app_id).toBe('A123-456-789');
    });

    it('should return undefined if isSuccess is false', async () => {
        (useGetSettings as jest.Mock).mockReturnValue({ isSuccess: false });
        const { result } = renderHook(() => useSendbirdServiceToken());
        expect(result.current.data).toBeUndefined();
    });
});
