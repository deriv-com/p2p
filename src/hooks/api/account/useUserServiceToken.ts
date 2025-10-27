import { useGetSettings, useServiceToken } from '@deriv-com/api-hooks';

type TUseUserServiceToken = {
    from: string;
    isMigrated: boolean;
};
const useUserServiceToken = ({ from, isMigrated }: TUseUserServiceToken) => {
    const { isSuccess } = useGetSettings();
    const { data, ...rest } = useServiceToken({
        enabled: isSuccess && isMigrated && from != 'p2p-v2',
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
