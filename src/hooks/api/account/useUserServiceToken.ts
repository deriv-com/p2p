import { useGetSettings, useServiceToken } from '@deriv-com/api-hooks';

const useUserServiceToken = () => {
    const { isSuccess } = useGetSettings();
    const { data, ...rest } = useServiceToken({
        enabled: isSuccess,
        payload: {
            // @ts-expect-error - connect is not defined
            service: 'connect',
        },
    });

    return {
        // @ts-expect-error - connect is not defined
        data: data?.connect,
        ...rest,
    };
};

export default useUserServiceToken;
