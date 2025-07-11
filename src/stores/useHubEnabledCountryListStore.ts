import { create } from 'zustand';

type THubEnabledCountryListState = {
    hubEnabledCountryList: string[];
};

type THubEnabledCountryListAction = {
    setHubEnabledCountryList: (hubEnabledCountryList: string[]) => void;
};

const useHubEnabledCountryListStore = create<THubEnabledCountryListAction & THubEnabledCountryListState>()(set => ({
    hubEnabledCountryList: [],
    setHubEnabledCountryList: hubEnabledCountryList => set({ hubEnabledCountryList }),
}));

export default useHubEnabledCountryListStore;
