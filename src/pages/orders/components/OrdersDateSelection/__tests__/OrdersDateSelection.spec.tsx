import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OrdersDateSelection from '../OrdersDateSelection';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: true })),
}));

const mockProps = {
    fromDate: '',
    setFromDate: jest.fn(),
    setToDate: jest.fn(),
    toDate: '',
};

describe('OrdersDateSelection', () => {
    it('should render OrdersDateSelection', () => {
        render(<OrdersDateSelection {...mockProps} />);
        expect(screen.getByText('Date from')).toBeInTheDocument();
        expect(screen.getByText('Today')).toBeInTheDocument();
    });
    it('should render the date input section component on mobile', () => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: false });
        render(<OrdersDateSelection {...mockProps} />);
        expect(screen.getByText('All time')).toBeInTheDocument();
    });
    it('should open the full page date selection when the input is clicked on mobile', async () => {
        render(<OrdersDateSelection {...mockProps} />);
        const input = screen.getByPlaceholderText('All time');
        await userEvent.click(input);
        expect(screen.getByText('Please select duration')).toBeInTheDocument();
    });
    it('should close the full page date selection when the cancel button is clicked', async () => {
        render(<OrdersDateSelection {...mockProps} />);
        const input = screen.getByPlaceholderText('All time');
        await userEvent.click(input);
        const cancelButton = screen.getByRole('button', { name: 'Cancel' });
        await userEvent.click(cancelButton);
        expect(screen.queryByText('Please select duration')).not.toBeInTheDocument();
    });
    it('should show the selected dates when from Date and to Date are provided', async () => {
        render(<OrdersDateSelection {...mockProps} fromDate='2024-06-01' toDate='2024-06-04' />);
        const input = screen.getByPlaceholderText('All time');
        expect(input).toHaveValue('2024-06-01 - 2024-06-04');
    });
    it('should show the selected dates when from Date and to Date are provided for desktop', async () => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: true });
        render(<OrdersDateSelection {...mockProps} fromDate='2024-06-01' toDate='2024-06-04' />);
        expect(screen.getByDisplayValue('Jun 01, 2024')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Jun 04, 2024')).toBeInTheDocument();
    });
});
