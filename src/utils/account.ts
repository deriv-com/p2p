import { useActiveAccount } from '@/hooks/api/account';

/**
 * The below function is used to get the blocked scenario type based on the active account data.
 * @param activeAccountData
 * @returns account type
 */
export const getBlockedType = (activeAccountData: NonNullable<ReturnType<typeof useActiveAccount>['data']>) => {
    const cryptolist = ['BTC', 'ETH', 'LTC', 'BCH', 'USDT'];
    const typeMap: {
        [key: string]: () => boolean;
    } = {
        crypto: () => cryptolist.includes(activeAccountData?.currency ?? ''),
        demo: () => activeAccountData?.is_virtual === 1,
        nonUSD: () => activeAccountData?.currency !== 'USD',
    };

    const type = Object.keys(typeMap).find(key => typeMap[key]());
    return type;
};
