import { THooks } from 'types';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OrdersTableRow from '../OrdersTableRow';

const mockPush = jest.fn();

jest.mock('use-query-params', () => ({
    ...jest.requireActual('use-query-params'),
    useQueryParams: jest.fn().mockReturnValue([
        {},
        jest.fn(), // setQuery
    ]),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockPush,
    }),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({
        isMobile: false,
    }),
}));

const mockUseDevice = useDevice as jest.Mock;

const mockProps = {
    account_currency: 'USD',
    advert_details: {
        is_block_trade: false,
        block_trade: 0 as THooks.Order.GetList[number]['advert_details']['block_trade'],
        description: 'Created by script. Please call me 02203400',
        id: '116',
        payment_method: 'bank_transfer',
        type: 'sell' as 'buy' | 'sell',
    },
    advertiser_details: {
        first_name: 'QA script',
        id: '59',
        is_online: true,
        is_recommended: undefined,
        last_name: 'userPlOta',
        last_online_time: 1709818078,
        loginid: 'CR90000299',
        name: 'client CR90000299',
    },
    amount: 0.1,
    amount_display: '0.10',
    chat_channel_url: 'p2porder_CR_8_1709812405',
    client_details: {
        first_name: 'QA script',
        id: '60',
        is_online: 1,
        is_recommended: null,
        last_name: 'userzShta',
        last_online_time: 1709818032,
        loginid: 'CR90000300',
        name: 'client CR90000300',
    },
    completion_time: 1709812718,
    contact_info: 'Created by script. Please call me 02203400',
    created_time: 1709812402,
    dispute_details: {
        dispute_reason: null,
        disputer_loginid: null,
    },
    expiry_time: 1709816002,
    id: '8',
    is_incoming: 1,
    is_reviewable: 1,
    local_currency: 'IDR',
    payment_info: 'Transfer to account 000-1111',
    price: 1350,
    price_display: '1350.00',
    rate: 13500,
    rate_display: '13500.00',
    status: 'completed',
    type: 'buy' as 'buy' | 'sell',
    is_seen: false,
    review_details: undefined,
    is_verification_pending: false,
};
describe('OrdersTableRow', () => {
    it('should render the component', () => {
        render(<OrdersTableRow {...mockProps} />);
        expect(screen.getByText('client CR90000299')).toBeInTheDocument();
        expect(screen.getByText('Completed')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Rate' })).toBeInTheDocument();
    });

    it('should call history.push when clicking on the order id', async () => {
        render(<OrdersTableRow {...mockProps} />);
        const advertiserName = screen.getByText('client CR90000299');
        await userEvent.click(advertiserName);
        expect(mockPush).toHaveBeenCalledWith('/orders/8');
    });

    it('should call history.push when clicking chat icon on mobile view', async () => {
        mockUseDevice.mockReturnValue({
            isMobile: true,
        });

        render(<OrdersTableRow {...mockProps} />);

        const chatIcon = screen.getByTestId('dt_orders_table_row_chat_button');
        await userEvent.click(chatIcon);

        expect(mockPush).toHaveBeenCalledWith('/orders/8?showChat=true');
    });
});
