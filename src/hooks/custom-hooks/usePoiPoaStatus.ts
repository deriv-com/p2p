import { useMemo } from 'react';
import { useGetAccountStatus } from '@deriv-com/api-hooks';

/** A custom hook that returns the POA, POI status and if POA is required for P2P */
const usePoiPoaStatus = () => {
    const { data, ...rest } = useGetAccountStatus();

    // create new response for poi/poa statuses
    const modifiedAccountStatus = useMemo(() => {
        if (!data) return undefined;

        const documentStatus = data?.authentication?.document?.status;
        const identityStatus = data?.authentication?.identity?.status;
        const isP2PPoaRequired = data?.p2p_poa_required;
        const isPoaAuthenticatedWithIdv =
            data?.status.includes('poa_authenticated_with_idv') ||
            data?.status.includes('poa_authenticated_with_idv_photo');
        const isPoaPending = documentStatus === 'pending';
        const isPoaVerified = documentStatus === 'verified';
        const isPoiPending = identityStatus === 'pending';
        const isPoiVerified = identityStatus === 'verified';

        return {
            isP2PPoaRequired,
            isPoaAuthenticatedWithIdv,
            isPoaPending,
            isPoaVerified,
            isPoiPending,
            isPoiPoaVerified: isPoiVerified && (!isP2PPoaRequired || (isPoaVerified && !isPoaAuthenticatedWithIdv)),
            isPoiVerified,
            poaStatus: documentStatus,
            poiStatus: identityStatus,
        };
    }, [data]);

    return {
        /** The POI & POA status. */
        data: modifiedAccountStatus,
        ...rest,
    };
};

export default usePoiPoaStatus;
