import { useGetSettings, useServiceToken } from '@deriv-com/api-hooks';

type TUseUserServiceToken = {
    isMigrated: boolean;
};

const useUserServiceToken = ({ isMigrated }: TUseUserServiceToken) => {
    const { isSuccess } = useGetSettings();
    const { data, ...rest } = useServiceToken({
        enabled: isSuccess && isMigrated,
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
