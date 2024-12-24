import useGetPhoneNumberVerification from './useGetPhoneNumberVerification';
import useIsAdvertiser from './useIsAdvertiser';
import usePoiPoaStatus from './usePoiPoaStatus';

const useIsAdvertiserNotVerified = () => {
    const { shouldShowVerification } = useGetPhoneNumberVerification();
    const { data } = usePoiPoaStatus();
    const isPoiPoaVerified = data?.isPoiPoaVerified;
    const isAdvertiser = useIsAdvertiser();
    const isAdvertiserNotVerified = !isAdvertiser && (!isPoiPoaVerified || shouldShowVerification);

    return isAdvertiserNotVerified;
};

export default useIsAdvertiserNotVerified;
