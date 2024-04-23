import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FlyoutMenu from '../FlyoutMenu';

const flyoutItems = ['item1', 'item2', 'item3'];

describe('FlyoutMenu', () => {
    it('should render the flyout menu correctly', () => {
        render(<FlyoutMenu listItems={flyoutItems} renderIcon={() => 'MockIcCashierVerticalEllipsis'} />);
        expect(screen.getByText('MockIcCashierVerticalEllipsis')).toBeInTheDocument();
    });
    it('should display the menu items when the icon is clicked', async () => {
        render(<FlyoutMenu listItems={flyoutItems} />);
        await userEvent.click(screen.getByTestId('dt_flyout_toggle'));
        flyoutItems.forEach(item => {
            expect(screen.getByText(item)).toBeInTheDocument();
        });
    });
    it('should hide the flyout menu list when the parent is clicked', async () => {
        render(
            <div data-testid='dt_flyout_parent'>
                <FlyoutMenu listItems={flyoutItems} />
            </div>
        );
        await userEvent.click(screen.getByTestId('dt_flyout_toggle'));
        expect(screen.getByText(flyoutItems[0])).toBeInTheDocument();
        await userEvent.click(screen.getByTestId('dt_flyout_parent'));
        expect(screen.queryByText(flyoutItems[0])).not.toBeInTheDocument();
    });
});
