import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RatingModal, { TRatingModalProps } from '../RatingModal';

const mockProps: TRatingModalProps = {
    isBuyOrder: true,
    isModalOpen: true,
    isRecommended: undefined,
    isRecommendedPreviously: false,
    onRequestClose: jest.fn(),
    orderId: '12345',
};

const disabledClassName = 'rating-modal__button--disabled';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({ isMobile: false }),
}));

const mockMutate = jest.fn();

jest.mock('@/hooks', () => ({
    api: {
        orderReview: {
            useReview: () => ({
                mutate: mockMutate,
            }),
        },
    },
}));

jest.mock('@/components/StarRating', () => ({
    StarRating: ({ onClick }: { onClick: (value: number) => void }) => <div onClick={() => onClick(1)}>StarRating</div>,
}));

describe('<RatingModal />', () => {
    it('should render modal', () => {
        render(<RatingModal {...mockProps} />);

        expect(screen.getByText('How would you rate this transaction?')).toBeInTheDocument();
        expect(screen.getByText('StarRating')).toBeInTheDocument();
        expect(screen.queryByText('Would you recommend this buyer?')).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Yes' })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'No' })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Done' })).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Skip' })).toBeInTheDocument();
    });

    it('should enable the Yes button when clicked and disable the No button', async () => {
        render(<RatingModal {...mockProps} isRecommended={false} isRecommendedPreviously />);
        const stars = screen.getByText('StarRating');
        await userEvent.click(stars);

        const noButton = screen.getByRole('button', { name: 'No' });
        expect(noButton).not.toHaveClass(disabledClassName);

        const yesButton = screen.getByRole('button', { name: 'Yes' });
        await userEvent.click(yesButton);

        expect(yesButton).not.toHaveClass(disabledClassName);
        expect(noButton).toHaveClass(disabledClassName);
    });

    it('should enable the No button when clicked and disable the Yes button', async () => {
        render(<RatingModal {...mockProps} isRecommended isRecommendedPreviously />);
        const stars = screen.getByText('StarRating');
        await userEvent.click(stars);

        const yesButton = screen.getByRole('button', { name: 'Yes' });
        expect(yesButton).not.toHaveClass(disabledClassName);

        const noButton = screen.getByRole('button', { name: 'No' });
        await userEvent.click(noButton);

        expect(noButton).not.toHaveClass(disabledClassName);
        expect(yesButton).toHaveClass(disabledClassName);
    });

    it('should call mutate with recommended value 1 when yes is selected, and onRequestClose when Done button is clicked', async () => {
        render(<RatingModal {...mockProps} />);
        const stars = screen.getByText('StarRating');
        await userEvent.click(stars);

        const yesButton = screen.getByRole('button', { name: 'Yes' });
        await userEvent.click(yesButton);

        const doneButton = screen.getByRole('button', { name: 'Done' });
        await userEvent.click(doneButton);

        expect(mockMutate).toHaveBeenCalledWith({ order_id: '12345', rating: 1, recommended: 1 });
        expect(mockProps.onRequestClose).toHaveBeenCalled();
    });

    it('should call mutate with recommended value 0 when no is selected, and onRequestClose when Done button is clicked', async () => {
        render(<RatingModal {...mockProps} />);
        const stars = screen.getByText('StarRating');
        await userEvent.click(stars);

        const noButton = screen.getByRole('button', { name: 'No' });
        await userEvent.click(noButton);

        const doneButton = screen.getByRole('button', { name: 'Done' });
        await userEvent.click(doneButton);

        expect(mockMutate).toHaveBeenCalledWith({ order_id: '12345', rating: 1, recommended: 0 });
        expect(mockProps.onRequestClose).toHaveBeenCalled();
    });

    it('should call mutate with recommended value undefined when nothing is selected and onRequestClose when Done button is clicked', async () => {
        render(<RatingModal {...mockProps} />);
        const stars = screen.getByText('StarRating');
        await userEvent.click(stars);

        const doneButton = screen.getByRole('button', { name: 'Done' });
        await userEvent.click(doneButton);

        expect(mockMutate).toHaveBeenCalledWith({ order_id: '12345', rating: 1, recommended: undefined });
        expect(mockProps.onRequestClose).toHaveBeenCalled();
    });
});
