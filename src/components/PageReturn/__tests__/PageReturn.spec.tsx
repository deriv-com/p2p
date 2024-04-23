import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PageReturn from '../PageReturn';

const mockOnClick = jest.fn();
describe('PageReturn', () => {
    it('should render the title and behaviour of return correctly', async () => {
        render(<PageReturn onClick={mockOnClick} pageTitle='Cashier P2P' />);

        expect(screen.getByText('Cashier P2P')).toBeVisible();
        const returnBtn = screen.getByTestId('dt_page_return_btn');
        await userEvent.click(returnBtn);
        expect(mockOnClick).toBeCalled();
    });
});
