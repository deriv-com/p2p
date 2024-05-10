import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BuySellTable from '../BuySellTable';

const mockPush = jest.fn();

let mockAdvertiserListData = {
    data: [],
    isFetching: false,
    isPending: true,
    loadMoreAdverts: jest.fn(),
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

jest.mock('@/hooks', () => ({
    ...jest.requireActual('@/hooks'),
    api: {
        advert: {
            useGetList: jest.fn(() => mockAdvertiserListData),
        },
        advertiser: {
            useGetInfo: jest.fn(() => ({
                data: {
                    id: '123',
                },
            })),
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

const mockUseModalManager = {
    hideModal: jest.fn(),
    isModalOpenFor: jest.fn(),
    showModal: jest.fn(),
};

jest.mock('@/hooks/custom-hooks', () => ({
    ...jest.requireActual('@/hooks/custom-hooks'),
    useIsAdvertiserBarred: jest.fn().mockReturnValue(false),
    useModalManager: jest.fn(() => mockUseModalManager),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: false })),
}));

jest.mock('../../BuySellHeader/BuySellHeader', () => jest.fn(() => <div>BuySellHeader</div>));

describe('<BuySellTable />', () => {
    beforeEach(() => {
        Object.defineProperty(window, 'location', {
            value: {
                href: 'https://test.com/buy-sell',
            },
            writable: true,
        });
    });
    it('should render the BuySellHeader component and loader component if isLoading is true', () => {
        render(<BuySellTable />);

        expect(screen.getByText('BuySellHeader')).toBeInTheDocument();
        expect(screen.getByTestId('dt_derivs-loader')).toBeInTheDocument();
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
});
