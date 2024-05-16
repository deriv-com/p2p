import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlockDropdown from '../BlockDropdown';

jest.mock('@/hooks/custom-hooks', () => ({
    useIsAdvertiserBarred: jest.fn().mockReturnValue(false),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({
        isMobile: false,
    }),
}));

const mockProps = {
    id: '134',
    onClickBlocked: jest.fn(),
};

const mockModalManager = {
    hideModal: jest.fn(),
    isModalOpenFor: jest.fn().mockReturnValue(false),
    showModal: jest.fn(),
};
jest.mock('@/hooks', () => ({
    useAdvertiserStats: jest.fn().mockReturnValue({ data: { is_blocked: false, name: 'test' } }),
    useModalManager: jest.fn(() => mockModalManager),
}));
describe('BlockDropdown', () => {
    it('should render', () => {
        render(<BlockDropdown {...mockProps} />);
        expect(screen.getByTestId('dt_block_dropdown_icon')).toBeInTheDocument();
    });
    it('should render the dropdown list on clicking on the icon', async () => {
        render(<BlockDropdown {...mockProps} />);
        await userEvent.click(screen.getByTestId('dt_block_dropdown_icon'));
        expect(screen.getByText('Block')).toBeInTheDocument();
    });
    it('should handle the onclick event for clicking on the block button', async () => {
        render(<BlockDropdown {...mockProps} />);
        await userEvent.click(screen.getByTestId('dt_block_dropdown_icon'));
        await userEvent.click(screen.getByText('Block'));
        expect(mockModalManager.showModal).toHaveBeenCalledWith('BlockUnblockUserModal');
    });
});
