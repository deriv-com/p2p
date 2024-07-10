import { create } from 'zustand';
import { ADVERT_TYPE, ORDERS_STATUS } from '@/constants';

type TTabsState = {
    activeAdvertisersBuySellTab: string;
    activeBuySellTab: string;
    activeOrdersTab: string;
};

type TTabsAction = {
    setActiveAdvertisersBuySellTab: (activeAdvertisersBuySellTab: string) => void;
    setActiveBuySellTab: (activeBuySellTab: string) => void;
    setActiveOrdersTab: (activeOrdersTab: string) => void;
};

const useTabsStore = create<TTabsAction & TTabsState>()(set => ({
    activeAdvertisersBuySellTab: ADVERT_TYPE.BUY,
    activeBuySellTab: ADVERT_TYPE.BUY,
    activeOrdersTab: ORDERS_STATUS.ACTIVE_ORDERS,
    setActiveAdvertisersBuySellTab: activeAdvertisersBuySellTab => set({ activeAdvertisersBuySellTab }),
    setActiveBuySellTab: activeBuySellTab => set({ activeBuySellTab }),
    setActiveOrdersTab: activeOrdersTab => set({ activeOrdersTab }),
}));

export default useTabsStore;
