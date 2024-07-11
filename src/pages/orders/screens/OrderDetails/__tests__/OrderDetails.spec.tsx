import { api } from '@/hooks';
import { useExtendedOrderDetails } from '@/hooks/custom-hooks';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OrderDetails from '../OrderDetails';

const mockGoBack = jest.fn();
const mockHistoryPush = jest.fn();
let mockSearch = '';
let mockState = {};

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        goBack: mockGoBack,
        push: mockHistoryPush,
    }),
    useLocation: () => ({
        search: mockSearch,
        state: mockState,
    }),
    useParams: () => ({
        orderId: '1',
    }),
}));

jest.mock('@deriv-com/api-hooks', () => ({
    useAuthData: jest.fn().mockReturnValue({
        isAuthorized: true,
    }),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({ isDesktop: true }),
}));

jest.mock('@/hooks', () => ({
    api: {
        account: {
            useActiveAccount: jest.fn(() => ({
                data: {
                    currency: 'USD',
                    loginid: '12345',
                },
            })),
            useServerTime: jest.fn(() => ({
                data: {
                    server_time: 1626864000,
                },
            })),
        },
        order: {
            useGet: jest.fn().mockReturnValue({
                data: {},
                error: undefined,
                isLoading: true,
                subscribe: jest.fn(),
                unsubscribe: jest.fn(),
            }),
        },
    },
}));

jest.mock('@/hooks/custom-hooks', () => ({
    useExtendedOrderDetails: jest.fn().mockReturnValue({
        data: {
            isBuyOrderForUser: true,
            shouldShowLostFundsBanner: true,
        },
    }),
    useSendbird: () => ({
        activeChatChannel: {
            isFrozen: false,
        },
        isOnline: true,
        lastOnlineTime: 123546789,
        nickname: 'John Doe',
    }),
}));

jest.mock('../../../components/OrderDetailsCard', () => ({
    OrderDetailsCard: () => <div>OrderDetailsCard</div>,
}));
jest.mock('../../../components/OrderDetailsCard/OrderDetailsCardFooter', () => ({
    OrderDetailsCardFooter: () => <div>OrderDetailsCardFooter</div>,
}));
jest.mock('../../../components/ChatFooter', () => ({
    ChatFooter: () => <div>ChatFooter</div>,
}));
jest.mock('../../../components/ChatMessages', () => ({
    ChatMessages: () => <div>ChatMessages</div>,
}));

const mockUseDevice = useDevice as jest.Mock;
const mockUseGet = api.order.useGet as jest.MockedFunction<typeof api.order.useGet>;
const mockUseExtendedOrderDetails = useExtendedOrderDetails as jest.Mock;

describe('<OrderDetails />', () => {
    it('should show loading screen if isLoading is true', () => {
        render(<OrderDetails />);

        expect(screen.getByTestId('dt_derivs-loader')).toBeInTheDocument();
    });

    it('should show loading screen if orderInfo is undefined and error is undefined', () => {
        (mockUseGet as jest.Mock).mockReturnValue({
            ...mockUseGet(),
            data: undefined,
            isLoading: false,
        });

        render(<OrderDetails />);

        expect(screen.getByTestId('dt_derivs-loader')).toBeInTheDocument();
    });

    it('should render Desktop view if isMobile is false', () => {
        (mockUseGet as jest.Mock).mockReturnValue({
            ...mockUseGet(),
            data: {},
        });

        render(<OrderDetails />);

        expect(screen.getByText('Buy USD order')).toBeInTheDocument();
        expect(
            screen.getByText('Don’t risk your funds with cash transactions. Use bank transfers or e-wallets instead.')
        ).toBeInTheDocument();
        expect(screen.getByText('OrderDetailsCard')).toBeInTheDocument();
        expect(screen.getByText('ChatMessages')).toBeInTheDocument();
        expect(screen.getByText('ChatFooter')).toBeInTheDocument();
    });

    it('should call goBack when back button is clicked', async () => {
        render(<OrderDetails />);

        const backButton = screen.getByTestId('dt_page_return_btn');
        await userEvent.click(backButton);

        expect(mockGoBack).toHaveBeenCalled();
    });

    it('should render Mobile view if isMobile is true', () => {
        mockUseDevice.mockReturnValue({ isDesktop: false });

        render(<OrderDetails />);

        expect(screen.getByText('Buy USD order')).toBeInTheDocument();
        expect(screen.getByText('OrderDetailsCard')).toBeInTheDocument();
        expect(screen.queryByText('ChatMessages')).not.toBeInTheDocument();
        expect(screen.queryByText('ChatFooter')).not.toBeInTheDocument();
    });

    it('should show OrdersChatSection if Chat icon is clicked', async () => {
        render(<OrderDetails />);

        const chatButton = screen.getByTestId('dt_order_details_chat_button');
        await userEvent.click(chatButton);

        expect(screen.getByText('ChatMessages')).toBeInTheDocument();
        expect(screen.getByText('ChatFooter')).toBeInTheDocument();
        expect(screen.queryByText('OrderDetailsCard')).not.toBeInTheDocument();
    });

    it('should call goBack when back button is clicked in mobile view and showChat is true in search param', async () => {
        mockSearch = '?showChat=true';

        render(<OrderDetails />);

        const backButton = screen.getByTestId('dt_mobile_wrapper_button');
        await userEvent.click(backButton);

        expect(mockGoBack).toHaveBeenCalled();

        mockSearch = '';
    });

    it('should show Sell USD order if isBuyOrderForUser is false', () => {
        mockUseExtendedOrderDetails.mockReturnValue({
            ...mockUseGet(),
            data: {
                isBuyOrderForUser: false,
                shouldShowLostFundsBanner: true,
            },
        });

        render(<OrderDetails />);

        expect(screen.getByText('Sell USD order')).toBeInTheDocument();
    });

    it('should push to Orders URL if from is Orders', async () => {
        mockUseDevice.mockReturnValue({ isDesktop: true });
        mockState = { from: 'Orders' };

        render(<OrderDetails />);

        const backButton = screen.getByTestId('dt_page_return_btn');
        await userEvent.click(backButton);

        expect(mockHistoryPush).toHaveBeenCalledWith('/orders');
    });

    it('should push to BuySell URL if from is BuySell', async () => {
        mockState = { from: 'BuySell' };

        render(<OrderDetails />);

        const backButton = screen.getByTestId('dt_page_return_btn');
        await userEvent.click(backButton);

        expect(mockHistoryPush).toHaveBeenCalledWith('/buy-sell');
    });

    it('should push to PastOrders url if orderStatusParam is completed', async () => {
        mockState = { from: '' };
        mockSearch = '?order_status=completed';

        render(<OrderDetails />);

        const backButton = screen.getByTestId('dt_page_return_btn');
        await userEvent.click(backButton);

        expect(mockHistoryPush).toHaveBeenCalledWith('/orders?tab=Past+orders');

        mockSearch = '';
    });

    it('should show error message if isError is true', () => {
        (mockUseGet as jest.Mock).mockReturnValue({
            ...mockUseGet(),
            data: {},
            error: { message: 'error message' },
            isLoading: false,
        });

        render(<OrderDetails />);

        expect(screen.getByText('error message')).toBeInTheDocument();
    });
});
