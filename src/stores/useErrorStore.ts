import { create } from 'zustand';

type TError = {
    code: string;
    message: string;
};

type TErrorState = {
    errorMessages: TError[];
};

type TErrorAction = {
    reset: () => void;
    setErrorMessages: (errorMessages: TError | null) => void;
};

const useErrorStore = create<TErrorAction & TErrorState>()(set => ({
    errorMessages: [],
    reset: () => set({ errorMessages: [] }),
    setErrorMessages: errorMessages =>
        set(state => {
            if (!errorMessages) {
                return { ...state, errorMessages: [] };
            }

            const isErrorMessageIncluded = state.errorMessages.some(
                error => error.code === errorMessages.code && error.message === errorMessages.message
            );

            return {
                ...state,
                errorMessages: isErrorMessageIncluded
                    ? state.errorMessages
                    : [...state.errorMessages, { code: errorMessages.code, message: errorMessages.message }],
            };
        }),
}));

export default useErrorStore;
