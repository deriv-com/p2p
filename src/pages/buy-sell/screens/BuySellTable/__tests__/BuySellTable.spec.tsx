import { useDevice } from '@deriv-com/ui';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BuySellTable from '../BuySellTable';

const mockPush = jest.fn();

let mockAdvertiserListData = {
    data: [],
    isFetching: false,
    isPending: true,
    loadMoreAdverts: jest.fn(),
};

let mockAdvertiserInfoData = {
    data: {
        id: '123',
    },
};

jest.mock('use-query-params', () => ({
    ...jest.requireActual('use-query-params'),
    useQueryParams: jest.fn().mockReturnValue([{}, jest.fn()]),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockPush,
    }),
}));

jest.mock('@deriv-com/api-hooks', () => ({
    ...jest.requireActual('@deriv-com/api-hooks'),
    useExchangeRates: jest.fn(() => ({ subscribeRates: jest.fn() })),
}));

jest.mock('@/components/BuySellForm', () => ({
    BuySellForm: jest.fn(() => <div>BuySellForm</div>),
}));

jest.mock('@/components/Modals', () => ({
    ...jest.requireActual('@/components/Modals'),
    NicknameModal: jest.fn(() => <div>NicknameModal</div>),
}));

jest.mock('@/hooks', () => ({
    ...jest.requireActual('@/hooks'),
    api: {
        advert: {
            useGetList: jest.fn(() => mockAdvertiserListData),
        },
        advertiser: {
            useGetInfo: jest.fn(() => mockAdvertiserInfoData),
        },
        advertiserPaymentMethods: {
            useGet: jest.fn(() => ({ data: [] })),
        },
        paymentMethods: {
            useGet: jest.fn(() => ({ data: [] })),
        },
        settings: {
            useSettings: jest.fn(() => ({
                data: {
                    localCurrency: 'USD',
                },
            })),
        },
    },
}));

let mockUseIsAdvertiser = true;

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
    useIsAdvertiser: jest.fn(() => mockUseIsAdvertiser),
    useIsAdvertiserBarred: jest.fn().mockReturnValue(false),
    useModalManager: jest.fn(() => mockUseModalManager),
    useQueryString: jest.fn(() => mockUseQueryString),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: false })),
}));

const mockUseDevice = useDevice as jest.Mock;

describe('<BuySellTable />', () => {
    beforeEach(() => {
        Object.defineProperty(window, 'location', {
            value: {
                href: 'https://test.com/buy-sell',
            },
            writable: true,
        });
    });
    it('should render the BuySellHeader component and loader component if isLoading is true', async () => {
        render(<BuySellTable />);

        const buySellHeader = screen.getByTestId('dt_buy_sell_header');
        const buyTab = within(buySellHeader).getByRole('button', { name: 'Buy' });
        const sellTab = within(buySellHeader).getByRole('button', { name: 'Sell' });

        expect(buyTab).toBeInTheDocument();
        expect(sellTab).toBeInTheDocument();
        expect(screen.getByRole('searchbox')).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: 'Sort by' })).toBeInTheDocument();
        expect(screen.getByTestId('dt_derivs-loader')).toBeInTheDocument();

        await userEvent.click(sellTab);

        expect(mockUseQueryString.setQueryString).toHaveBeenCalledWith({ tab: 'Sell' });
    });

    it('should render the Table component if data is not empty', () => {
        mockAdvertiserListData = {
            data: [
                // @ts-expect-error caused by typing of never[]
                {
                    account_currency: 'USD',
                    advertiser_details: {
                        completed_orders_count: 300,
                        id: '1',
                        is_online: true,
                        name: 'John Doe',
                        rating_average: 5,
                        rating_count: 1,
                    },
                    counterparty_type: 'buy',
                    effective_rate: 0.0001,
                    local_currency: 'USD',
                    max_order_amount_limit_display: 100,
                    min_order_amount_limit_display: 10,
                    payment_method_names: ['Bank transfer'],
                    price_display: 100,
                    rate: 0.0001,
                    rate_type: 'fixed',
                },
            ],
            isFetching: false,
            isPending: false,
            loadMoreAdverts: jest.fn(),
        };

        render(<BuySellTable />);

        expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('should call history.push when clicking on the table row', async () => {
        render(<BuySellTable />);

        const usernameText = screen.getByText('John Doe');
        await userEvent.click(usernameText);

        expect(mockPush).toHaveBeenCalledWith('/advertiser/1?currency=USD');
    });

    it('should render the BuySellForm component when clicking on the Buy button', async () => {
        mockUseModalManager.isModalOpenFor.mockImplementation((modalName: string) => modalName === 'BuySellForm');
        render(<BuySellTable />);

        const buyButton = screen.getByRole('button', { name: /Buy USD/ });
        await userEvent.click(buyButton);

        expect(screen.getByText('BuySellForm')).toBeInTheDocument();
    });

    it('should render the NicknameModal component when user clicks on Buy/Sell button and user is not an advertiser', async () => {
        mockUseIsAdvertiser = false;
        mockUseModalManager.isModalOpenFor.mockImplementation((modalName: string) => modalName === 'NicknameModal');
        render(<BuySellTable />);

        const buyButton = screen.getByText(/Buy USD/);
        await userEvent.click(buyButton);

        expect(screen.getByText('NicknameModal')).toBeInTheDocument();
    });

    it('should not render render the BuySellForm when the user clicks on Buy/Sell button and the user is an advertiser', async () => {
        mockUseIsAdvertiser = true;
        mockUseModalManager.isModalOpenFor.mockImplementation((modalName: string) => modalName === 'BuySellForm');
        render(<BuySellTable />);

        const buyButton = screen.getByText(/Buy USD/);
        await userEvent.click(buyButton);

        expect(screen.getByText('BuySellForm')).toBeInTheDocument();
    });

    it('should not render the Buy/Sell button the advert is yours', () => {
        mockAdvertiserInfoData = {
            data: {
                id: '1',
            },
        };

        render(<BuySellTable />);
        expect(screen.queryByRole('button', { name: /Buy USD/i })).not.toBeInTheDocument();
    });

    it('should render the RadioGroupFilterModal when the filter button is clicked', async () => {
        mockUseDevice.mockReturnValue({ isMobile: true });
        mockUseModalManager.isModalOpenFor.mockImplementation(modal_name => modal_name === 'RadioGroupFilterModal');
        render(<BuySellTable />);

        const filterButton = screen.getByTestId('dt_sort_dropdown_button');
        await userEvent.click(filterButton);

        expect(mockUseModalManager.showModal).toHaveBeenCalledWith('RadioGroupFilterModal');

        const userRatingText = screen.getByText('User rating');
        await userEvent.click(userRatingText);

        expect(mockUseModalManager.hideModal).toHaveBeenCalled();
    });
});
