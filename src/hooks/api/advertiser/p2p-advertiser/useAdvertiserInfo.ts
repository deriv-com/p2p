import { useEffect } from 'react';
import { DeepPartial } from 'react-hook-form';
import { useLocalStorage } from 'usehooks-ts';
import { useP2PAdvertiserInfo, useSubscribe } from '@deriv-com/api-hooks';

type TP2PAdvertiserInfo = ReturnType<typeof useP2PAdvertiserInfo>['data'] & {
    hasBasicVerification: boolean;
    hasFullVerification: boolean;
    isApprovedBoolean: boolean;
    isBlockedBoolean: boolean;
    isFavouriteBoolean: boolean;
    isListedBoolean: boolean;
    isOnlineBoolean: boolean;
    shouldShowName: boolean;
};

/** This custom hook returns information about the given advertiser ID */
const useAdvertiserInfo = (id?: string) => {
    const { data, error, subscribe, ...rest } = useSubscribe('p2p_advertiser_info') ?? {};

    /**
     * Use different local storage key for each advertiser, one to keep the current user's info, the other to keep the advertiser's info
     * This is to prevent the current user's info from being overwritten by the advertiser's info when the current user views the advertiser's profile.
     *
     * Key removal is handled in useAdvertiserStats hook's useEffect.
     * */
    const local_storage_key = id ? `p2p_advertiser_info_${id}` : 'p2p_advertiser_info';
    const [p2p_advertiser_info, setP2PAdvertiserInfo] = useLocalStorage<DeepPartial<TP2PAdvertiserInfo>>(
        local_storage_key,
        {}
    );

    // Add additional information to the p2p_advertiser_info data
    useEffect(() => {
        if (data) {
            const advertiser_info = data.p2p_advertiser_info;

            if (!advertiser_info) return;

            const {
                basic_verification,
                full_verification,
                is_approved,
                is_blocked,
                is_favourite,
                is_listed,
                is_online,
                show_name,
            } = advertiser_info;

            setP2PAdvertiserInfo({
                ...advertiser_info,
                /** Indicating whether the advertiser's identify has been verified. */
                hasBasicVerification: Boolean(basic_verification),
                /** Indicating whether the advertiser's address has been verified. */
                hasFullVerification: Boolean(full_verification),
                /** The approval status of the advertiser. */
                isApprovedBoolean: Boolean(is_approved),
                /** Indicates that the advertiser is blocked by the current user. */
                isBlockedBoolean: Boolean(is_blocked),
                /** Indicates that the advertiser is a favourite of the current user. */
                isFavouriteBoolean: Boolean(is_favourite),
                /** Indicates if the advertiser's active adverts are listed. When false, adverts won't be listed regardless if they are active or not. */
                isListedBoolean: Boolean(is_listed),
                /** Indicates if the advertiser is currently online. */
                isOnlineBoolean: Boolean(is_online),
                /** When true, the advertiser's real name will be displayed on to other users on adverts and orders. */
                shouldShowName: Boolean(show_name),
            });
        } else if (error) {
            setP2PAdvertiserInfo({});
        }
    }, [data, error, setP2PAdvertiserInfo]);

    return {
        /** P2P advertiser information */
        data: p2p_advertiser_info,
        error,
        subscribe,
        ...rest,
    };
};

export default useAdvertiserInfo;
