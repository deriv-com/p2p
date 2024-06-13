import { createContext, PropsWithChildren, useContext } from 'react';

type TContextValue = {
    error: { code: string; message: string } | undefined;
    isIdle: boolean;
    isLoading: boolean;
    isSubscribed: boolean;
    setHasCreatedAdvertiser: (hasCreatedAdvertiser: boolean) => void;
};

const AdvertiserInfoStateContext = createContext<TContextValue>({} as TContextValue);

type TAdvertiserInfoStateProviderProps = {
    value: TContextValue;
};

/**
 * A provider that contains the state of the current logged in user's advertiser info.
 */
export const AdvertiserInfoStateProvider = ({
    children,
    value,
}: PropsWithChildren<TAdvertiserInfoStateProviderProps>) => (
    <AdvertiserInfoStateContext.Provider value={value}>{children}</AdvertiserInfoStateContext.Provider>
);

/**
 * Custom hook to access the current logged in user's advertiser info state.
 * @returns {TContextValue} The current logged in user's advertiser info state.
 */
export const useAdvertiserInfoState = (): TContextValue => useContext(AdvertiserInfoStateContext);
