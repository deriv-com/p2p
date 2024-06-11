import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OrdersDateSelectionFullPage from '../OrdersDateSelectionFullPage';

const mockProps = {
    fromDate: '',
    onClickCancel: jest.fn(),
    setFromDate: jest.fn(),
    setToDate: jest.fn(),
    toDate: '',
};

describe('OrdersDateSelectionFullPage', () => {
    it('should render OrdersDateSelectionFullPage', () => {
        render(<OrdersDateSelectionFullPage {...mockProps} />);
        expect(screen.getByText('Please select duration')).toBeInTheDocument();
    });
    it('should call onClickCancel when the cancel button is clicked', async () => {
        render(<OrdersDateSelectionFullPage {...mockProps} />);
        const cancelButton = screen.getByRole('button', { name: 'Cancel' });
        await userEvent.click(cancelButton);
        expect(mockProps.onClickCancel).toHaveBeenCalledTimes(1);
    });
    it('should call setFromDate and setToDate when the OK button is clicked', async () => {
        render(<OrdersDateSelectionFullPage {...mockProps} fromDate='2024-06-01' toDate='2024-06-04' />);
        const okButton = screen.getByRole('button', { name: 'OK' });
        await userEvent.click(okButton);
        expect(mockProps.setFromDate).toHaveBeenCalledTimes(1);
        expect(mockProps.setToDate).toHaveBeenCalledTimes(1);
    });
});
