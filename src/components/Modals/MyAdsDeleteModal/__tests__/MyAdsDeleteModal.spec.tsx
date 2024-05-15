import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyAdsDeleteModal from '../MyAdsDeleteModal';

const mockProps = {
    error: '',
    id: '123',
    isModalOpen: true,
    onClickDelete: jest.fn(),
    onRequestClose: jest.fn(),
};

const mockUseGet = {
    data: {
        active_orders: 0,
    },
    isLoading: false,
};

jest.mock('@/hooks', () => ({
    api: {
        advert: {
            useGet: jest.fn(() => mockUseGet),
        },
    },
    useAuthorize: () => ({
        data: {
            local_currencies: ['USD'],
        },
    }),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({ isMobile: false }),
}));

describe('MyAdsDeleteModal', () => {
    it('should render the component as expected', () => {
        render(<MyAdsDeleteModal {...mockProps} />);
        expect(screen.getByText('Do you want to delete this ad?')).toBeInTheDocument();
        expect(screen.getByText('You will NOT be able to restore it.')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });
    it('should not allow deletion if there are active orders', () => {
        mockUseGet.data.active_orders = 1;
        render(<MyAdsDeleteModal {...mockProps} />);
        expect(
            screen.getByText('You have open orders for this ad. Complete all open orders before deleting this ad.')
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Ok' })).toBeInTheDocument();
    });
    it('should display the error message if there is an error', () => {
        const newProps = {
            ...mockProps,
            error: 'An error occurred',
        };
        render(<MyAdsDeleteModal {...newProps} />);
        expect(screen.getByText('An error occurred')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Ok' })).toBeInTheDocument();
    });
    it('should handle onclick Delete', async () => {
        mockUseGet.data.active_orders = 0;
        render(<MyAdsDeleteModal {...mockProps} />);
        const deleteButton = screen.getByRole('button', { name: 'Delete' });
        await userEvent.click(deleteButton);
        expect(mockProps.onClickDelete).toHaveBeenCalled();
    });
});
