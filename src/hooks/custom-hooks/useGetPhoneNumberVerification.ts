import { useGetSettings } from '@deriv-com/api-hooks';
import { api } from '..';

/** A custom hook that returns if phone number verification is enabled,
 * if the user's phone number is verified, should show verification component,
 * and the phone number
 *
 * */
const useGetPhoneNumberVerification = () => {
    const { data, isLoading: isGetSettingsLoading } = useGetSettings();
    const { data: p2pSettings } = api.settings.useSettings();

    const isPhoneNumberVerificationEnabled = !!p2pSettings?.pnv_required;
    const isPhoneNumberVerified = !!data?.phone_number_verification?.verified;
    const shouldShowVerification = !isPhoneNumberVerified && isPhoneNumberVerificationEnabled;
    const phoneNumber = data?.phone;

    return {
        isGetSettingsLoading,
        isPhoneNumberVerificationEnabled,
        isPhoneNumberVerified,
        phoneNumber,
        shouldShowVerification,
    };
};

export default useGetPhoneNumberVerification;
