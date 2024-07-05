import { TOrderStatus } from 'types';
import { mockAdvertValues } from '@/__mocks__/mock-data';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import OrdersTable from '../OrdersTable';

const mockProps = {
    data: [],
    isActive: true,
    isFetching: false,
    isLoading: false,
    loadMoreOrders: jest.fn(),
};

const mockData = [
    {
        account_currency: 'USD',
        advert_details: mockAdvertValues,
        advertiser_details: {
            first_name: 'QA script',
            has_not_been_recommended: true,
            id: '121',
            is_online: true,
            is_recommended: false,
            last_name: 'faidKIVta',
            last_online_time: 1709722552,
            loginid: 'CR90001088',
            name: 'test123',
        },
        amount: 1,
        amount_display: '1.00',
        chat_channel_url: 'p2porder_CR_90_1709716082',
        client_details: {
            first_name: 'QA script',
            has_not_been_recommended: true,
            id: '64',
            is_online: true,
            is_recommended: false,
            last_name: 'userNJqta',
            last_online_time: 1709722597,
            loginid: 'CR90000343',
            name: 'client CR90000343',
        },
        contact_info: '1',
        created_time: 1709716078,
        dispute_details: {
            dispute_reason: null,
            disputer_loginid: null,
        },
        expiry_time: 1709719678,
        id: '90',
        is_incoming: false,
        is_reviewable: false,
        is_seen: true,
        is_verification_pending: false,
        local_currency: 'IDR',
        payment_info: '',
        price: 1,
        price_display: '1.00',
        rate: 1,
        rate_display: '1.00',
        review_details: {
            created_time: 1234567,
            has_not_been_recommended: false,
            is_recommended: false,
            rating: 3,
            recommended: null,
        },
        status: 'refunded' as TOrderStatus,
        type: 'buy' as 'buy' | 'sell',
    },
];

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: true })),
}));

jest.mock('@/components/Modals/RatingModal', () => ({
    RatingModal: () => <div>RatingModal</div>,
}));

jest.mock('@/hooks', () => ({
    api: {
        account: {
            useActiveAccount: jest.fn().mockReturnValue({
                data: {
                    loginid: 'CR90000300',
                },
            }),
            useServerTime: jest.fn().mockReturnValue({
                data: {
                    server_time_moment: 1709812402,
                },
            }),
        },
    },
}));

jest.mock('@/hooks/custom-hooks', () => ({
    ...jest.requireActual('@/hooks/custom-hooks'),
    useExtendedOrderDetails: jest.fn().mockReturnValue({
        data: {
            account_currency: 'USD',
            amount_display: '0.10',
            id: '8',
            isBuyOrderForUser: true,
            isCompletedOrder: true,
            local_currency: 'IDR',
            orderExpiryMilliseconds: 1234567,
            otherUserDetails: {
                name: 'test123',
            },
            price_display: '1350.00',
            purchaseTime: 1234567,
            shouldHighlightAlert: false,
            shouldHighlightDanger: false,
            shouldHighlightDisabled: false,
            shouldHighlightSuccess: false,
            statusString: 'completed',
        },
    }),
    useModalManager: jest.fn().mockReturnValue({
        hideModal: jest.fn(),
        isModalOpenFor: jest.fn(),
        showModal: jest.fn(),
    }),
    useQueryString: jest.fn().mockReturnValue({
        queryString: {
            tab: 'Active orders',
        },
    }),
}));

const mockUseDevice = useDevice as jest.Mock;

describe('OrdersTable', () => {
    it('should render OrdersTable as expected with empty data', () => {
        render(<OrdersTable {...mockProps} />);
        expect(screen.getByText('You have no orders.')).toBeInTheDocument();
    });
    it('should render the loader when isLoading', () => {
        render(<OrdersTable {...mockProps} isLoading />);
        expect(screen.getByTestId('dt_derivs-loader')).toBeInTheDocument();
    });
    it('should render the table when there is data', () => {
        render(<OrdersTable {...mockProps} data={mockData} />);
        expect(screen.getByText('Order')).toBeInTheDocument();
        expect(screen.getByText('Order ID')).toBeInTheDocument();
        expect(screen.getByText('test123')).toBeInTheDocument();
    });
    it('should not render the table header when in mobile view', () => {
        mockUseDevice.mockReturnValue({ isMobile: true });
        render(<OrdersTable {...mockProps} data={mockData} />);
        expect(screen.queryByText('Order')).not.toBeInTheDocument();
    });
});
