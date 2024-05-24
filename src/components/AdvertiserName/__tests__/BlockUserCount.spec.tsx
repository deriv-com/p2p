import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlockUserCount from '../BlockUserCount';

const modalManager = {
    hideModal: jest.fn(),
    isModalOpenFor: jest.fn(),
    showModal: jest.fn(),
};
modalManager.showModal.mockImplementation(() => {
    modalManager.isModalOpenFor.mockReturnValue(true);
});

jest.mock('@/hooks', () => ({
    ...jest.requireActual('@/hooks'),
    useModalManager: jest.fn(() => modalManager),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: false })),
}));

describe('BlockUserCount', () => {
    it('should render the component as expected', () => {
        render(<BlockUserCount count={0} />);
        expect(screen.getByText('0')).toBeInTheDocument();
        expect(screen.getByTestId('dt_block_user_count_button')).toBeInTheDocument();
    });
    it('should display the tooltip message on hovering', async () => {
        render(<BlockUserCount count={0} />);
        const button = screen.getByTestId('dt_block_user_count_button');
        await userEvent.hover(button);
        expect(screen.getByText('Nobody has blocked you. Yay!')).toBeInTheDocument();
    });
    it('should display the count in the tooltip message', async () => {
        render(<BlockUserCount count={1} />);
        const button = screen.getByTestId('dt_block_user_count_button');
        await userEvent.hover(button);
        expect(screen.getByText('1 person has blocked you')).toBeInTheDocument();
    });
    it('should open the modal on clicking the button in mobile view', async () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });
        render(<BlockUserCount count={0} />);
        await userEvent.click(screen.getByTestId('dt_block_user_count_button'));
        expect(modalManager.showModal).toHaveBeenCalledWith('BlockUserCountModal');
        expect(modalManager.isModalOpenFor()).toBe(true);
    });
});
