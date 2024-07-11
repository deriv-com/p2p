import { useHistory, useLocation } from 'react-router-dom';
import { api } from '@/hooks';
import { useOrderDetails } from '@/providers/OrderDetailsProvider';
import { useDevice } from '@deriv-com/ui';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OrderDetailsCardFooter from '../OrderDetailsCardFooter';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: jest.fn().mockReturnValue({ push: jest.fn(), replace: jest.fn() }),
    useLocation: jest.fn().mockReturnValue({ pathname: '/orders/11', search: '' }),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({ isMobile: false }),
}));

jest.mock('@/components/Modals', () => ({
    ...jest.requireActual('@/components/Modals'),
    OrderDetailsCancelModal: () => <div>OrderDetailsCancelModal</div>,
    OrderDetailsComplainModal: () => <div>OrderDetailsComplainModal</div>,
    OrderDetailsConfirmModal: () => <div>OrderDetailsConfirmModal</div>,
}));

const modalManager = {
    hideModal: jest.fn(),
    isModalOpenFor: jest.fn(),
    showModal: jest.fn(),
};

jest.mock('@/hooks/custom-hooks', () => ({
    ...jest.requireActual('@/hooks/custom-hooks'),
    useModalManager: () => modalManager,
}));

jest.mock('@/providers/OrderDetailsProvider', () => ({
    useOrderDetails: jest.fn().mockReturnValue({
        orderDetails: {
            advertiser_details: {
                name: 'test123',
            },
            id: '11',
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

jest.mock('../../OrderDetailsCardReview', () => ({
    OrderDetailsCardReview: () => <div>OrderDetailsCardReview</div>,
}));

const mockUseDevice = useDevice as jest.Mock;
const mockUseOrderDetails = useOrderDetails as jest.Mock;
const mockUseConfirm = api.order.useConfirm as jest.Mock;
const mockUseHistory = useHistory as jest.Mock;
const mockUseLocation = useLocation as jest.Mock;

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

    it('should show the OrderDetailsComplainModal when clicking the I’ve received payment button', async () => {
        modalManager.isModalOpenFor.mockImplementationOnce(
            (modalName: string) => modalName === 'OrderDetailsComplainModal'
        );
        render(<OrderDetailsCardFooter {...mockProps} />);

        const receivedButton = screen.getByRole('button', { name: 'I’ve received payment' });
        await userEvent.click(receivedButton);

        expect(screen.getByText('OrderDetailsComplainModal')).toBeInTheDocument();
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

    it('should render the Cancel and Paid button if shouldShowCancelAndPaidButton is true', () => {
        mockUseOrderDetails.mockReturnValue({
            orderDetails: {
                ...mockUseOrderDetails().orderDetails,
                shouldShowCancelAndPaidButton: true,
                shouldShowComplainAndReceivedButton: false,
            },
        });

        render(<OrderDetailsCardFooter {...mockProps} />);

        expect(screen.getByRole('button', { name: 'Cancel order' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'I’ve paid' })).toBeInTheDocument();
    });

    it('should show OrderDetailsConfirmModal on clicking the I’ve paid button', async () => {
        modalManager.isModalOpenFor.mockImplementation((modalName: string) => modalName === 'OrderDetailsConfirmModal');
        mockUseDevice.mockReturnValue({ isMobile: false });

        render(<OrderDetailsCardFooter {...mockProps} />);
        const paidButton = screen.getByRole('button', { name: 'I’ve paid' });
        await userEvent.click(paidButton);

        expect(screen.getByText('OrderDetailsConfirmModal')).toBeInTheDocument();
    });

    it('should show only I’ve received button if shouldShowOnlyReceivedButton is true', () => {
        mockUseOrderDetails.mockReturnValue({
            orderDetails: {
                ...mockUseOrderDetails().orderDetails,
                shouldShowCancelAndPaidButton: false,
                shouldShowOnlyReceivedButton: true,
            },
        });

        render(<OrderDetailsCardFooter {...mockProps} />);

        expect(screen.getByRole('button', { name: 'I’ve received payment' })).toBeInTheDocument();
    });

    it('should call mutate when clicking the I’ve received payment button and show the EmailVerificationModal', async () => {
        mockUseOrderDetails.mockReturnValue({
            orderDetails: {
                ...mockUseOrderDetails().orderDetails,
                verification_next_request: 123756391,
            },
        });

        mockUseConfirm.mockReturnValue({
            error: {
                code: 'OrderEmailVerificationRequired',
            },
            isError: true,
            mutate: jest.fn(),
        });

        modalManager.isModalOpenFor.mockImplementation((modalName: string) => modalName === 'EmailVerificationModal');

        render(<OrderDetailsCardFooter {...mockProps} />);
        const paymentButton = screen.getByRole('button', { name: 'I’ve received payment' });
        await userEvent.click(paymentButton);

        expect(mockUseConfirm().mutate).toHaveBeenCalled();
        expect(screen.getByText('Has the buyer paid you?')).toBeInTheDocument();
    });

    it('should call mutate if Resend email button is clicked inside EmailVerificationModal', async () => {
        render(<OrderDetailsCardFooter {...mockProps} />);
        const paymentButton = screen.getByRole('button', { name: 'I didn’t receive the email' });

        await userEvent.click(paymentButton);

        const resendButton = screen.getByRole('button', { name: 'Resend email' });
        await userEvent.click(resendButton);

        expect(mockUseConfirm().mutate).toHaveBeenCalled();
    });

    it('should show InvalidVerificationLinkModal if ExcessiveVerificationRequests error is returned while pressing I’ve received payment button', async () => {
        mockUseConfirm.mockReturnValue({
            error: {
                code: 'ExcessiveVerificationRequests',
                message: 'Please wait for 59 seconds before requesting another email.',
            },
            isError: true,
            mutate: jest.fn(),
            reset: jest.fn(),
        });

        modalManager.isModalOpenFor.mockImplementation(
            (modalName: string) => modalName === 'InvalidVerificationLinkModal'
        );

        render(<OrderDetailsCardFooter {...mockProps} />);

        const paymentButton = screen.getByRole('button', { name: 'I’ve received payment' });
        await userEvent.click(paymentButton);

        expect(screen.getByText('Please wait for 59 seconds before requesting another email.')).toBeInTheDocument();
    });

    it('should call mutate when clicking on Get new link button in InvalidVerificationLinkModal', async () => {
        modalManager.isModalOpenFor.mockImplementation(
            (modalName: string) => modalName === 'InvalidVerificationLinkModal'
        );

        render(<OrderDetailsCardFooter {...mockProps} />);

        const paymentButton = screen.getByRole('button', { name: 'I’ve received payment' });
        await userEvent.click(paymentButton);

        const okButton = screen.getByRole('button', { name: 'Get new link' });
        await userEvent.click(okButton);

        expect(mockUseConfirm().mutate).toHaveBeenCalled();
    });

    it('should show InvalidVerificationLinkModal if InvalidVerificationToken error is returned when code param is in the URL', async () => {
        mockUseLocation.mockReturnValue({ pathname: '/orders/11', search: '?action=p2p_order_confirm&code=123' });

        mockUseConfirm.mockReturnValue({
            data: {
                isDryRunSuccessful: false,
            },
            error: {
                code: 'InvalidVerificationToken',
                message: 'The link that you used appears to be invalid. Please check and try again.',
            },
            isError: true,
            mutate: jest.fn(),
        });

        modalManager.isModalOpenFor.mockImplementation(
            (modalName: string) => modalName === 'InvalidVerificationLinkModal'
        );

        render(<OrderDetailsCardFooter {...mockProps} />);

        expect(mockUseConfirm().mutate).toHaveBeenCalledWith({ dry_run: 1, id: '11', verification_code: '123' });
        expect(screen.getByText('Invalid verification link')).toBeInTheDocument();
        expect(
            screen.getByText('The link that you used appears to be invalid. Please check and try again.')
        ).toBeInTheDocument();
    });

    it('should call mutate when clicking Get new link button in InvalidVerificationLinkModal', async () => {
        render(<OrderDetailsCardFooter {...mockProps} />);

        const getNewLinkButton = screen.getByRole('button', { name: 'Get new link' });
        await userEvent.click(getNewLinkButton);

        expect(mockUseConfirm().mutate).toHaveBeenCalled();
    });

    it('should show EmailLinkBlockedModal if ExcessiveVerificationFailures error is returned when code param is in the URL', async () => {
        mockUseConfirm.mockReturnValue({
            data: {
                isDryRunSuccessful: false,
            },
            error: {
                code: 'ExcessiveVerificationFailures',
                message:
                    'It looks like you’ve made too many attempts to confirm this order. Please try again after 30 minutes.',
            },
            isError: true,
            mutate: jest.fn(),
        });

        modalManager.isModalOpenFor.mockImplementation((modalName: string) => modalName === 'EmailLinkBlockedModal');

        render(<OrderDetailsCardFooter {...mockProps} />);

        expect(mockUseConfirm().mutate).toHaveBeenCalledWith({ dry_run: 1, id: '11', verification_code: '123' });
        expect(screen.getByText('Too many failed attempts')).toBeInTheDocument();
        expect(
            screen.getByText(
                'It looks like you’ve made too many attempts to confirm this order. Please try again after 30 minutes.'
            )
        ).toBeInTheDocument();
    });

    it('should show EmailLinkVerifiedModal if isDryRunSuccessful is true and code param is in the URL', async () => {
        mockUseLocation.mockReturnValue({ pathname: '/orders/11', search: '?action=p2p_order_confirm&code=123' });

        mockUseConfirm.mockReturnValue({
            data: {
                isDryRunSuccessful: true,
            },
            error: null,
            isError: false,
            isSuccess: true,
            mutate: jest.fn(),
        });

        modalManager.isModalOpenFor.mockImplementation((modalName: string) => modalName === 'EmailLinkVerifiedModal');

        render(<OrderDetailsCardFooter {...mockProps} />);

        expect(mockUseConfirm().mutate).toHaveBeenCalledWith({ dry_run: 1, id: '11', verification_code: '123' });
        expect(screen.getByText('One last step before we close this order')).toBeInTheDocument();
    });

    it('should call history.replace, hideModal, when X icon is pressed in EmailLinkVerifiedModal', async () => {
        mockUseLocation.mockReturnValue({ pathname: '/orders/11', search: '?action=p2p_order_confirm&code=123' });
        modalManager.isModalOpenFor.mockImplementation((modalName: string) => modalName === 'EmailLinkVerifiedModal');

        render(<OrderDetailsCardFooter {...mockProps} />);

        const closeButton = screen.getByTestId('dt-close-icon');
        await userEvent.click(closeButton);

        expect(modalManager.hideModal).toHaveBeenCalled();
        expect(mockUseHistory().replace).toHaveBeenCalled();
    });

    it('should call mutate and history.replace when clicking Confirm button in EmailLinkVerifiedModal and complete the order', async () => {
        mockUseLocation.mockReturnValue({ pathname: '/orders/11', search: '?action=p2p_order_confirm&code=123' });
        mockUseOrderDetails.mockReturnValue({
            orderDetails: {
                ...mockUseOrderDetails().orderDetails,
                isBuyOrderForUser: false,
                statusString: 'Completed',
            },
        });
        modalManager.isModalOpenFor.mockImplementation((modalName: string) => modalName === 'EmailLinkVerifiedModal');

        const { rerender } = render(<OrderDetailsCardFooter {...mockProps} />);

        const confirmButton = screen.getByRole('button', { name: 'Confirm' });
        await userEvent.click(confirmButton);

        expect(mockUseConfirm().mutate).toHaveBeenCalledWith({ id: '11', verification_code: '123' });
        expect(mockUseHistory().replace).toHaveBeenCalled();

        rerender(<OrderDetailsCardFooter {...mockProps} />);

        expect(mockUseHistory().replace).toHaveBeenCalled();
    });

    it('should call history.replace if OrderConfirmCompleted error is returned and show OrderDetailsCardReview when order is already completed', async () => {
        mockUseLocation.mockReturnValue({ pathname: '/orders/11', search: '?action=p2p_order_confirm&code=123' });
        mockUseOrderDetails.mockReturnValue({
            orderDetails: {
                ...mockUseOrderDetails().orderDetails,
                isCompletedOrder: true,
            },
        });
        mockUseConfirm.mockReturnValue({
            error: {
                code: 'OrderConfirmCompleted',
            },
            isError: true,
            mutate: jest.fn(),
        });

        render(<OrderDetailsCardFooter {...mockProps} />);

        expect(mockUseConfirm().mutate).toHaveBeenCalledWith({ dry_run: 1, id: '11', verification_code: '123' });
        expect(mockUseHistory().replace).toHaveBeenCalled();
        expect(screen.getByText('OrderDetailsCardReview')).toBeInTheDocument();
    });
});
