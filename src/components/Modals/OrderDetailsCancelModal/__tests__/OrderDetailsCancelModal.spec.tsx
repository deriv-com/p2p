import { fireEvent, render, screen } from '@testing-library/react';
import OrderDetailsCancelModal from '../OrderDetailsCancelModal';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: false })),
}));

const mockMutate = jest.fn();

jest.mock('@/hooks', () => ({
    api: {
        advertiser: {
            useGetInfo: jest.fn().mockReturnValue({ data: { cancels_remaining: 2 } }),
        },
        order: {
            useCancel: () => ({ mutate: mockMutate }),
        },
        settings: {
            useSettings: jest.fn().mockReturnValue({
                data: { cancellation_block_duration: 2, cancellation_count_period: 2, cancellation_limit: 2 },
            }),
        },
    },
}));

const mockProps = {
    id: '1',
    isModalOpen: true,
    onRequestClose: jest.fn(),
};

describe('<OrderDetailsCancelModal />', () => {
    it('should render the modal', () => {
        render(<OrderDetailsCancelModal {...mockProps} />);

        expect(screen.getByText('Do you want to cancel this order?')).toBeInTheDocument();
        expect(
            screen.getByText(
                /If you cancel your order 2 times in 2 hours, you will be blocked from using Deriv P2P for 2 hours./
            )
        ).toBeInTheDocument();
        expect(screen.getByText(/(2 cancellations remaining)/)).toBeInTheDocument();
        expect(screen.getByText('Please do not cancel if you have already made payment.')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel this order' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Do not cancel' })).toBeInTheDocument();
    });

    it('should call the cancel function when the cancel button is clicked', () => {
        render(<OrderDetailsCancelModal {...mockProps} />);

        const cancelButton = screen.getByRole('button', { name: 'Cancel this order' });

        fireEvent.click(cancelButton);

        expect(mockProps.onRequestClose).toHaveBeenCalledTimes(1);
        expect(mockMutate).toHaveBeenCalledTimes(1);
    });
});
