/* eslint-disable sort-keys */
import { create } from 'zustand';
import { api } from '@/hooks';

type TUserInfoStates = {
    hasCreatedAdvertiser: boolean;
    userInfoState:
        | {
              error: ReturnType<typeof api.advertiser.useGetInfo>['error'];
              isActive: boolean;
              isIdle: boolean;
              isLoading: boolean;
          }
        | undefined;
};

type TUserInfoActions = {
    setHasCreatedAdvertiser: (hasCreatedAdvertiser: boolean) => void;
    setUserInfoState: (userInfoState: TUserInfoStates['userInfoState']) => void;
};

const useUserInfoStore = create<TUserInfoActions & TUserInfoStates>()(set => ({
    hasCreatedAdvertiser: false,
    userInfoState: undefined,
    setHasCreatedAdvertiser: hasCreatedAdvertiser => set({ hasCreatedAdvertiser }),
    setUserInfoState: userInfoState => set({ userInfoState }),
}));

export default useUserInfoStore;
