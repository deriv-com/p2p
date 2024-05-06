import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AlertComponent from '../AlertComponent';

const mockProps = {
    onClick: jest.fn(),
};
describe('AlertComponent', () => {
    it('should render the component as expected', () => {
        render(<AlertComponent {...mockProps} />);
        expect(screen.getByTestId('dt_alert_icon')).toBeInTheDocument();
    });
    it('should show the tooltip text on hovering the icon', async () => {
        render(<AlertComponent {...mockProps} />);
        const icon = screen.getByTestId('dt_alert_icon');
        await userEvent.hover(icon);
        expect(screen.getByText('Ad not listed')).toBeInTheDocument();
    });
    it('should handle the onclick', async () => {
        render(<AlertComponent {...mockProps} />);
        const button = screen.getByRole('button');
        await userEvent.click(button);
        expect(mockProps.onClick).toHaveBeenCalledTimes(1);
    });
});
