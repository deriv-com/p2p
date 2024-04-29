import { useGetAccountStatus } from '@deriv-com/api-hooks';
import { QueryObserverResult } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import usePoiPoaStatus from '../custom-hooks/usePoiPoaStatus';

const mockUseGetAccountStatus = useGetAccountStatus as jest.MockedFunction<typeof useGetAccountStatus>;

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useGetAccountStatus: jest.fn().mockReturnValue({
        data: {
            authentication: {
                document: {
                    status: 'pending',
                },
                identity: {
                    status: 'pending',
                },
            },
            p2p_poa_required: true,
        },
    }),
}));

const mockValues = {
    error: null,
    isError: false as const,
    isPending: true as const,
    isLoading: false,
    isLoadingError: false as const,
    isRefetchError: false as const,
    isSuccess: false as const,
    status: 'pending' as const,
    dataUpdatedAt: 0,
    errorUpdatedAt: 0,
    failureCount: 0,
    failureReason: null,
    errorUpdateCount: 0,
    isFetched: false,
    isFetchedAfterMount: false,
    isFetching: false,
    isInitialLoading: false,
    isPaused: false,
    isPlaceholderData: false,
    isRefetching: false,
    isStale: false,
    refetch(): Promise<
        QueryObserverResult<
            { get_account_status?: ReturnType<typeof useGetAccountStatus>['data'] | undefined },
            {
                echo_req: { [k: string]: unknown };
                error: { code: string; message: string };
                msg_type: 'get_account_status';
                req_id?: number | undefined;
            }
        >
    > {
        throw new Error('Function not implemented.');
    },
    fetchStatus: 'fetching',
};

describe('usePoiPoaStatus', () => {
    it('should return the correct pending verification statuses', () => {
        const { result } = renderHook(() => usePoiPoaStatus());

        expect(result.current.data).toStrictEqual({
            isP2PPoaRequired: true,
            isPoaPending: true,
            isPoaVerified: false,
            isPoiPending: true,
            isPoiVerified: false,
            poaStatus: 'pending',
            poiStatus: 'pending',
        });
    });
    it('should return the correct verified verification statuses', () => {
        mockUseGetAccountStatus.mockReturnValueOnce({
            ...mockValues,
            data: {
                currency_config: {},
                p2p_status: 'active',
                prompt_client_to_authenticate: 1,
                risk_classification: 'risk',
                status: ['pending'],
                authentication: {
                    document: {
                        status: 'verified',
                    },
                    identity: {
                        status: 'verified',
                    },
                    needs_verification: [],
                },
                p2p_poa_required: 0,
            },
        } as ReturnType<typeof useGetAccountStatus>);
        const { result } = renderHook(() => usePoiPoaStatus());

        expect(result.current.data).toStrictEqual({
            isP2PPoaRequired: false,
            isPoaPending: false,
            isPoaVerified: true,
            isPoiPending: false,
            isPoiVerified: true,
            poaStatus: 'verified',
            poiStatus: 'verified',
        });
    });
    it('should return undefined if data is not available', () => {
        mockUseGetAccountStatus.mockReturnValueOnce({
            ...mockValues,
            data: undefined,
        } as ReturnType<typeof useGetAccountStatus>);
        const { result } = renderHook(() => usePoiPoaStatus());

        expect(result.current.data).toBeUndefined();
    });
});
