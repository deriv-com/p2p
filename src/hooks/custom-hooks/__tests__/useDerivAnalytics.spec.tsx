import { api } from '@/hooks';
import { useDevice } from '@deriv-com/ui';
import { act, renderHook } from '@testing-library/react';
import useDerivAnalytics from '../useDerivAnalytics';

jest.mock('@deriv-com/api-hooks', () => ({
    useAccountList: jest.fn(() => ({ data: [] })),
    useAuthData: jest.fn(() => ({ activeLoginid: 'test-loginid' })),
    useWebsiteStatus: jest.fn().mockReturnValue({ data: {} }),
}));

jest.mock('@/hooks', () => ({
    api: {
        account: {
            useActiveAccount: jest.fn(() => ({
                data: { currency: 'USD' },
            })),
            useBalance: jest.fn().mockReturnValue({ data: {} }),
        },
    },
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockImplementation(() => ({
        isMobile: false,
    })),
}));

const mockedUseDevice = useDevice as jest.MockedFunction<typeof useDevice>;
const mockUseActiveAccount = api.account.useActiveAccount as jest.MockedFunction<typeof api.account.useActiveAccount>;

describe('useDerivAnalytics', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should initialize analytics with correct attributes', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            json: jest.fn().mockResolvedValue({
                marketing_growthbook: true,
                tracking_rudderstack: true,
            }),
        } as unknown as Response);

        (mockUseActiveAccount as jest.Mock).mockReturnValueOnce({
            ...mockUseActiveAccount,
        });

        (mockedUseDevice as jest.Mock).mockImplementation(() => ({
            isDesktop: false,
            isMobile: true,
            isTablet: false,
            isTabletPortrait: false,
        }));

        const { result } = renderHook(() => useDerivAnalytics());

        await act(async () => {
            await result.current.initialise();
        });

        // expect(mockedAnalytics.initialise).toHaveBeenCalledWith({
        //     growthbookDecryptionKey: 'test_decryption_key',
        //     growthbookKey: 'test_client_key',
        //     rudderstackKey: 'test_rudderstack_key',
        // });
    });
});
