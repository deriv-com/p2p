import { useDevice } from '@deriv-com/ui';
import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BuySellHeader from '../BuySellHeader';

const mockProps = {
    setIsFilterModalOpen: jest.fn(),
    setSearchValue: jest.fn(),
};

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({
        isDesktop: true,
        isMobile: false,
    }),
}));

jest.mock('@/hooks', () => ({
    ...jest.requireActual('@/hooks'),
    api: {
        settings: {
            useGetSettings: () => ({
                data: {},
            }),
        },
    },
}));

const mockFiltersStore = {
    filteredCurrency: 'IDR',
    selectedPaymentMethods: [],
    setFilteredCurrency: jest.fn(),
    setSortByValue: jest.fn(),
    shouldUseClientLimits: false,
    sortByValue: 'rate',
};

const mockTabsStore = {
    activeBuySellTab: 'Buy',
    setActiveBuySellTab: jest.fn(),
};

jest.mock('@/stores', () => ({
    useBuySellFiltersStore: jest.fn(selector => (selector ? selector(mockFiltersStore) : mockFiltersStore)),
    useTabsStore: jest.fn(selector => (selector ? selector(mockTabsStore) : mockTabsStore)),
}));

const mockUseModalManager = {
    hideModal: jest.fn(),
    isModalOpenFor: jest.fn(),
    showModal: jest.fn(),
};

const mockUseQueryString = {
    queryString: {
        tab: 'buy',
    },
    setQueryString: jest.fn(),
};

jest.mock('@/hooks/custom-hooks', () => ({
    ...jest.requireActual('@/hooks/custom-hooks'),
    useModalManager: jest.fn(() => mockUseModalManager),
    useQueryString: jest.fn(() => mockUseQueryString),
}));

jest.mock('../../../components/CurrencyDropdown/CurrencyDropdown', () => jest.fn(() => <div>CurrencyDropdown</div>));
jest.mock('@/components/Modals/FilterModal/FilterModal', () => jest.fn(() => <div>FilterModal</div>));

const mockUseDevice = useDevice as jest.Mock;

const user = userEvent.setup({ delay: null });

describe('<BuySellHeader />', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });
    it('should render the BuySellHeader', () => {
        render(<BuySellHeader {...mockProps} />);

        const buySellHeader = screen.getByTestId('dt_buy_sell_header');

        expect(within(buySellHeader).getByRole('button', { name: 'Buy' })).toBeInTheDocument();
        expect(within(buySellHeader).getByRole('button', { name: 'Sell' })).toBeInTheDocument();
        expect(screen.getByRole('searchbox')).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: 'Sort by' })).toBeInTheDocument();
    });

    it('should call setActiveBuySellTab and setQueryString when Sell tab is clicked', async () => {
        render(<BuySellHeader {...mockProps} />);

        const sellTab = screen.getByRole('button', { name: 'Sell' });

        await user.click(sellTab);
        expect(mockTabsStore.setActiveBuySellTab).toHaveBeenCalledWith('Sell');
        expect(mockUseQueryString.setQueryString).toHaveBeenCalledWith({ tab: 'Sell' });
    });

    it('should call setActiveBuySellTab and setQueryString when Buy tab is clicked', async () => {
        render(<BuySellHeader {...mockProps} />);

        const buyTab = screen.getByRole('button', { name: 'Buy' });

        await user.click(buyTab);
        expect(mockTabsStore.setActiveBuySellTab).toHaveBeenCalledWith('Buy');
        expect(mockUseQueryString.setQueryString).toHaveBeenCalledWith({ tab: 'Buy' });
    });

    it('should call setQueryString if the tab is not set in the query string', () => {
        // @ts-expect-error tab can be undefined
        mockUseQueryString.queryString.tab = undefined;
        render(<BuySellHeader {...mockProps} />);

        expect(mockUseQueryString.setQueryString).toHaveBeenCalledWith({ tab: 'Buy' });
    });

    it('should call setSortDropdownValue when a value is selected from the dropdown', async () => {
        render(<BuySellHeader {...mockProps} />);

        const dropdown = screen.getByRole('combobox', { name: 'Sort by' });

        await user.click(dropdown);

        const ratingOption = screen.getByRole('option', { name: 'User rating' });

        await user.click(ratingOption);

        expect(mockFiltersStore.setSortByValue).toHaveBeenCalledWith('rating');
    });

    it('should allow users to click on filter button', async () => {
        mockUseDevice.mockReturnValue({ isMobile: true });
        mockUseModalManager.isModalOpenFor.mockImplementation(modalName => modalName === 'FilterModal');
        render(<BuySellHeader {...mockProps} />);

        const filterButton = screen.getByTestId('dt_buy_sell_header_filter_button');

        await user.click(filterButton);

        expect(screen.getByText('FilterModal')).toBeInTheDocument();
    });

    it('should set the search value when the user types in the search input', async () => {
        render(<BuySellHeader {...mockProps} />);

        const searchInput = screen.getByRole('searchbox');

        await user.type(searchInput, 'John Doe');

        act(() => {
            jest.runAllTimers();
        });

        expect(searchInput).toHaveValue('John Doe');
    });

    it('should show indicator when selectedPaymentMethods is not empty', () => {
        // @ts-expect-error mocked selectedPaymentMethods can have a value
        mockFiltersStore.selectedPaymentMethods = ['alipay'];
        render(<BuySellHeader {...mockProps} />);

        expect(screen.getByTestId('dt_filter_button_indicator')).toBeInTheDocument();
    });
});
