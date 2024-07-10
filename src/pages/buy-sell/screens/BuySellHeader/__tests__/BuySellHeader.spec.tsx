import { useDevice } from '@deriv-com/ui';
import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BuySellHeader from '../BuySellHeader';

const mockProps = {
    activeTab: 'Buy',
    setActiveTab: jest.fn(),
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

const mockStore = {
    filteredCurrency: 'IDR',
    selectedPaymentMethods: [],
    setFilteredCurrency: jest.fn(),
    setSortByValue: jest.fn(),
    shouldUseClientLimits: false,
    sortByValue: 'rate',
};

jest.mock('@/stores', () => ({
    useBuySellFiltersStore: jest.fn(() => mockStore),
}));

const mockUseModalManager = {
    hideModal: jest.fn(),
    isModalOpenFor: jest.fn(),
    showModal: jest.fn(),
};

jest.mock('@/hooks/custom-hooks', () => ({
    ...jest.requireActual('@/hooks/custom-hooks'),
    useModalManager: jest.fn(() => mockUseModalManager),
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

    it('should call setActiveTab when Sell tab is clicked', async () => {
        render(<BuySellHeader {...mockProps} />);

        const sellTab = screen.getByRole('button', { name: 'Sell' });

        await user.click(sellTab);
        expect(mockProps.setActiveTab).toHaveBeenCalledWith(1);
    });

    it('should call setActiveTab when Buy tab is clicked', async () => {
        render(<BuySellHeader {...mockProps} />);

        const buyTab = screen.getByRole('button', { name: 'Buy' });

        await user.click(buyTab);
        expect(mockProps.setActiveTab).toHaveBeenCalledWith(0);
    });

    it('should call setSortDropdownValue when a value is selected from the dropdown', async () => {
        render(<BuySellHeader {...mockProps} />);

        const dropdown = screen.getByRole('combobox', { name: 'Sort by' });

        await user.click(dropdown);

        const ratingOption = screen.getByRole('option', { name: 'User rating' });

        await user.click(ratingOption);

        expect(mockStore.setSortByValue).toHaveBeenCalledWith('rating');
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
});
