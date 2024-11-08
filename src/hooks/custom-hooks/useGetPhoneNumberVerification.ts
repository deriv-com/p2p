import { useGetSettings } from '@deriv-com/api-hooks';
import { api } from '..';

/** A custom hook that returns if the user's phone number is verified and the phone number */
const useGetPhoneNumberVerification = () => {
    const { data } = useGetSettings();
    const { data: p2pSettings } = api.settings.useSettings();

    const isPhoneNumberVerificationEnabled = !!p2pSettings?.pnv_required;
    const isPhoneNumberVerified = !!data?.phone_number_verification?.verified;
    const phoneNumber = data?.phone;

    return { isPhoneNumberVerificationEnabled, isPhoneNumberVerified, phoneNumber };
};

export default useGetPhoneNumberVerification;
