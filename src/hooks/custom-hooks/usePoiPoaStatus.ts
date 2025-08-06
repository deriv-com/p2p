import { useMemo } from 'react';
import { useGetAccountStatus, useKycAuthStatus } from '@deriv-com/api-hooks';
import { api } from '..';

/** A custom hook that returns the POA, POI status and if POA is required for P2P */
const usePoiPoaStatus = () => {
    const { data: accountStatus, ...rest } = useGetAccountStatus();
    const { data: kycStatus } = useKycAuthStatus();
    const { data: p2pSettings } = api.settings.useSettings();

    // create new response for poi/poa statuses
    const modifiedAccountStatus = useMemo(() => {
        if (!accountStatus && !kycStatus) return undefined;

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const documentStatus = kycStatus?.address?.status;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const identityStatus = kycStatus?.identity?.status;
        const isP2PPoaRequired = !!p2pSettings?.poa_required;
        const isPoaAuthenticatedWithIdv =
            accountStatus?.status.includes('poa_authenticated_with_idv') ||
            accountStatus?.status.includes('poa_authenticated_with_idv_photo');
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
    }, [accountStatus, kycStatus, p2pSettings?.poa_required]);

    return {
        /** The POI & POA status. */
        data: modifiedAccountStatus,
        ...rest,
    };
};

export default usePoiPoaStatus;
