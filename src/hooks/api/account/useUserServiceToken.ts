import { useGetSettings, useServiceToken } from '@deriv-com/api-hooks';

const useUserServiceToken = () => {
    const { isSuccess } = useGetSettings();
    const { data, ...rest } = useServiceToken({
        enabled: isSuccess,
        payload: {
            service: 'connect',
        },
    });

    return {
        data: data?.connect,
        ...rest,
    };
};

export default useUserServiceToken;
