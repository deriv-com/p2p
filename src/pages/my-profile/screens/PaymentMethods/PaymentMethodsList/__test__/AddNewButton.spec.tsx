import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddNewButton from '../AddNewButton';

describe('AddNewButton', () => {
    it('should render the component correctly', () => {
        render(<AddNewButton isDisabled={false} isMobile={true} onAdd={jest.fn()} />);
        expect(screen.getByText('Add new')).toBeInTheDocument();
    });
    it('should handle the onadd action', async () => {
        const mockOnAdd = jest.fn();
        render(<AddNewButton isDisabled={false} isMobile={true} onAdd={mockOnAdd} />);
        await userEvent.click(screen.getByText('Add new'));
        expect(mockOnAdd).toHaveBeenCalled();
    });
});
