import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DatePicker from '../DatePicker';

const mockProps = {
    label: 'Date from',
    onDateChange: jest.fn(),
    value: '',
};

describe('DatePicker', () => {
    it('should render DatePicker', () => {
        render(<DatePicker {...mockProps} />);
        expect(screen.getByText('Date from')).toBeInTheDocument();
    });
    it('should render DatePicker with value', () => {
        render(<DatePicker {...mockProps} value='2024-06-01' />);
        expect(screen.getByDisplayValue('Jun 01, 2024')).toBeInTheDocument();
    });
    it('should open the calendar on clicking the input field', async () => {
        render(<DatePicker {...mockProps} />);
        const input = screen.getByPlaceholderText('Date from');
        await userEvent.click(input);
        expect(screen.getByTestId('dt_datepicker_container')).toBeInTheDocument();
    });
    it('should close the calendar on clicking outside the calendar', async () => {
        render(<DatePicker {...mockProps} />);
        const input = screen.getByPlaceholderText('Date from');
        await userEvent.click(input);
        await userEvent.click(document.body);
        expect(screen.queryByTestId('dt_datepicker_container')).not.toBeInTheDocument();
    });
    it('should handle date change', async () => {
        render(<DatePicker {...mockProps} />);
        const input = screen.getByPlaceholderText('Date from');
        await userEvent.type(input, '2024-06-01');
        expect(mockProps.onDateChange).toHaveBeenCalledWith('Jun 01, 2024');
    });
});
