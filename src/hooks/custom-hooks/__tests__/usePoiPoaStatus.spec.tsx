import { useGetAccountStatus } from '@deriv-com/api-hooks';
import { QueryObserverResult } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import usePoiPoaStatus from '../usePoiPoaStatus';

const mockUseGetAccountStatus = useGetAccountStatus as jest.MockedFunction<typeof useGetAccountStatus>;

jest.mock('@deriv-com/api-hooks', () => ({
    ...jest.requireActual('@deriv-com/api-hooks'),
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
    dataUpdatedAt: 0,
    error: null,
    errorUpdateCount: 0,
    errorUpdatedAt: 0,
    failureCount: 0,
    failureReason: null,
    fetchStatus: 'fetching',
    isError: false as const,
    isFetched: false,
    isFetchedAfterMount: false,
    isFetching: false,
    isInitialLoading: false,
    isLoading: false,
    isLoadingError: false as const,
    isPaused: false,
    isPending: true as const,
    isPlaceholderData: false,
    isRefetchError: false as const,
    isRefetching: false,
    isStale: false,
    isSuccess: false as const,
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
    status: 'pending' as const,
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
                authentication: {
                    document: {
                        status: 'verified',
                    },
                    identity: {
                        status: 'verified',
                    },
                    needs_verification: [],
                },
                currency_config: {},
                p2p_poa_required: 0,
                p2p_status: 'active',
                prompt_client_to_authenticate: 1,
                risk_classification: 'risk',
                status: ['pending'],
            },
        } as ReturnType<typeof useGetAccountStatus>);
        const { result } = renderHook(() => usePoiPoaStatus());

        expect(result.current.data).toStrictEqual({
            isP2PPoaRequired: 0,
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
