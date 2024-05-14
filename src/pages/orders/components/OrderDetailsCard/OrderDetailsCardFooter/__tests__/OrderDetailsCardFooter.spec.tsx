import { useOrderDetails } from '@/providers/OrderDetailsProvider';
import { useDevice } from '@deriv-com/ui';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OrderDetailsCardFooter from '../OrderDetailsCardFooter';

const mockUseDevice = useDevice as jest.Mock;

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({ isMobile: false }),
}));

jest.mock('@/components/Modals', () => ({
    OrderDetailsCancelModal: () => <div>OrderDetailsCancelModal</div>,
    OrderDetailsComplainModal: () => <div>OrderDetailsComplainModal</div>,
}));

const modalManager = {
    hideModal: jest.fn(),
    isModalOpenFor: jest.fn().mockReturnValue(false),
    showModal: jest.fn(),
};

jest.mock('@/hooks/custom-hooks', () => ({
    ...jest.requireActual('@/hooks'),
    useModalManager: () => modalManager,
}));

jest.mock('@/providers/OrderDetailsProvider', () => ({
    useOrderDetails: jest.fn().mockReturnValue({
        orderDetails: {
            shouldShowCancelAndPaidButton: true,
            shouldShowComplainAndReceivedButton: false,
            shouldShowOnlyComplainButton: false,
            shouldShowOnlyReceivedButton: false,
        },
    }),
}));

jest.mock('@/hooks', () => ({
    ...jest.requireActual('@/hooks'),
    api: {
        order: {
            useConfirm: jest.fn().mockReturnValue({ error: null, isError: false, mutate: jest.fn() }),
        },
    },
}));

const mockUseOrderDetails = useOrderDetails as jest.Mock;
const mockProps = { sendFile: jest.fn() };
describe('<OrderDetailsCardFooter />', () => {
    it('should render cancel and paid buttons', () => {
        render(<OrderDetailsCardFooter {...mockProps} />);
        expect(screen.getByRole('button', { name: 'Cancel order' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'I’ve paid' })).toBeInTheDocument();
    });

    it('should render complain and received buttons', () => {
        mockUseOrderDetails.mockReturnValue({
            orderDetails: {
                ...mockUseOrderDetails().orderDetails,
                shouldShowCancelAndPaidButton: false,
                shouldShowComplainAndReceivedButton: true,
            },
        });

        render(<OrderDetailsCardFooter {...mockProps} />);

        expect(screen.getByRole('button', { name: 'Complain' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'I’ve received payment' })).toBeInTheDocument();
    });

    it('should render only complain button', () => {
        mockUseOrderDetails.mockReturnValue({
            orderDetails: {
                ...mockUseOrderDetails().orderDetails,
                shouldShowComplainAndReceivedButton: false,
                shouldShowOnlyComplainButton: true,
            },
        });

        render(<OrderDetailsCardFooter {...mockProps} />);

        expect(screen.getByRole('button', { name: 'Complain' })).toBeInTheDocument();
    });

    it('should render only received button', () => {
        mockUseOrderDetails.mockReturnValue({
            orderDetails: {
                ...mockUseOrderDetails().orderDetails,
                shouldShowOnlyComplainButton: false,
                shouldShowOnlyReceivedButton: true,
            },
        });

        render(<OrderDetailsCardFooter {...mockProps} />);

        expect(screen.getByRole('button', { name: 'I’ve received payment' })).toBeInTheDocument();
    });
    it('should not render any buttons', () => {
        mockUseOrderDetails.mockReturnValue({
            orderDetails: {
                ...mockUseOrderDetails().orderDetails,
                shouldShowOnlyReceivedButton: false,
            },
        });

        const { container } = render(<OrderDetailsCardFooter {...mockProps} />);

        expect(container).toBeEmptyDOMElement();
    });
    it('should open the OrderDetailsComplainModal on clicking the complain button', async () => {
        modalManager.isModalOpenFor.mockImplementation(
            (modalName: string) => modalName === 'OrderDetailsComplainModal'
        );
        mockUseDevice.mockReturnValue({ isMobile: true });
        mockUseOrderDetails.mockReturnValue({
            orderDetails: {
                ...mockUseOrderDetails().orderDetails,
                shouldShowCancelAndPaidButton: false,
                shouldShowOnlyComplainButton: true,
            },
        });

        render(<OrderDetailsCardFooter {...mockProps} />);

        const complainButton = screen.getByRole('button', { name: 'Complain' });
        expect(complainButton).toBeInTheDocument();
        await userEvent.click(complainButton);
        await waitFor(() => {
            expect(screen.getByText('OrderDetailsComplainModal')).toBeInTheDocument();
        });
    });
    it('should open OrderDetailsCancelModal on clicking the cancel order button', async () => {
        modalManager.isModalOpenFor.mockImplementation((modalName: string) => modalName === 'OrderDetailsCancelModal');
        mockUseDevice.mockReturnValue({ isMobile: true });
        mockUseOrderDetails.mockReturnValue({
            orderDetails: {
                ...mockUseOrderDetails().orderDetails,
                shouldShowCancelAndPaidButton: true,
                shouldShowOnlyComplainButton: false,
            },
        });

        render(<OrderDetailsCardFooter {...mockProps} />);

        const cancelOrderButton = screen.getByRole('button', { name: 'Cancel order' });
        expect(cancelOrderButton).toBeInTheDocument();
        await userEvent.click(cancelOrderButton);
        await waitFor(() => {
            expect(screen.getByText('OrderDetailsCancelModal')).toBeInTheDocument();
        });
    });
    it('should show OrderDetailsComplainModal on clicking the complain button if shouldShowComplainAndReceiveButton is true', async () => {
        modalManager.isModalOpenFor.mockImplementation(
            (modalName: string) => modalName === 'OrderDetailsComplainModal'
        );
        mockUseDevice.mockReturnValue({ isMobile: true });
        mockUseOrderDetails.mockReturnValue({
            orderDetails: {
                ...mockUseOrderDetails().orderDetails,
                shouldShowCancelAndPaidButton: false,
                shouldShowComplainAndReceivedButton: true,
            },
        });

        render(<OrderDetailsCardFooter {...mockProps} />);

        const complainButton = screen.getByRole('button', { name: 'Complain' });
        expect(complainButton).toBeInTheDocument();
        await userEvent.click(complainButton);
        await waitFor(() => {
            expect(screen.getByText('OrderDetailsComplainModal')).toBeInTheDocument();
        });
    });
});
