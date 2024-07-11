import { useActiveAccount } from '@/hooks/api/account';

/**
 * The below function is used to get the blocked scenario type based on the active account data.
 * @param activeAccountData
 * @returns account type
 */
export const getBlockedType = (activeAccountData: NonNullable<ReturnType<typeof useActiveAccount>['data']>) => {
    const typeMap: {
        [key: string]: () => boolean;
    } = {
        // @ts-expect-error - currency type is not defined. to be removed after updating the version
        crypto: () => activeAccountData?.currency_type === 'crypto',
        demo: () => activeAccountData?.is_virtual === 1,
        nonUSD: () => activeAccountData?.currency !== 'USD',
    };

    const type = Object.keys(typeMap).find(key => typeMap[key]());
    return type;
};
