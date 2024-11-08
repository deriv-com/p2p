import { useGetSettings } from '@deriv-com/api-hooks';

/** A custom hook that returns if the user's phone number is verified and the phone number */
const useGetPhoneNumberVerification = () => {
    const { data } = useGetSettings();
    const isPhoneNumberVerified = !!data?.phone_number_verification?.verified;
    const phoneNumber = data?.phone;

    return { isPhoneNumberVerified, phoneNumber };
};

export default useGetPhoneNumberVerification;
