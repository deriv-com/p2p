import { TSortByValues } from '@/utils';
import { useDevice } from '@deriv-com/ui';
import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BuySellHeader from '../BuySellHeader';

const mockProps = {
    activeTab: 'Buy',
    list: [
        {
            text: 'Exchange rate',
            value: 'rate',
        },
        {
            text: 'User rating',
            value: 'rating',
        },
    ],
    selectedCurrency: 'IDR',
    selectedPaymentMethods: [],
    setActiveTab: jest.fn(),
    setIsFilterModalOpen: jest.fn(),
    setSearchValue: jest.fn(),
    setSelectedCurrency: jest.fn(),
    setSelectedPaymentMethods: jest.fn(),
    setShouldUseClientLimits: jest.fn(),
    setSortDropdownValue: jest.fn(),
    shouldUseClientLimits: false,
    sortDropdownValue: 'rate' as TSortByValues,
};

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({
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

jest.mock('@/hooks/custom-hooks', () => ({
    ...jest.requireActual('@/hooks/custom-hooks'),
    useIsAdvertiserBarred: jest.fn(() => false),
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

        expect(mockProps.setSortDropdownValue).toHaveBeenCalledWith('rating');
    });

    it('should call setIsFilterModalOpen when the filter button is clicked on responsive', async () => {
        mockUseDevice.mockReturnValue({ isMobile: true });

        render(<BuySellHeader {...mockProps} />);

        const filterButton = screen.getByTestId('dt_sort_dropdown_button');

        await user.click(filterButton);

        expect(mockProps.setIsFilterModalOpen).toHaveBeenCalledWith(true);
    });

    it('should allow users to click on filter button', async () => {
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
