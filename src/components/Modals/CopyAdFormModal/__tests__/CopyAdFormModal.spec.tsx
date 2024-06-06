import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CopyAdFormModal from '../CopyAdFormModal';

const mockProps = {
    isModalOpen: true,
    isValid: true,
    onClickCancel: jest.fn(),
    onSubmit: jest.fn(),
};

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({ isMobile: false }),
}));
describe('CopyAdFormModal', () => {
    it('should render the component as expected', () => {
        render(<CopyAdFormModal {...mockProps} />);
        expect(screen.getByText('Create a similar ad')).toBeInTheDocument();
    });
    it('should call onClickCancel function on clicking cancel button', async () => {
        render(<CopyAdFormModal {...mockProps} />);
        const button = screen.getByRole('button', { name: 'Cancel' });
        await userEvent.click(button);
        expect(mockProps.onClickCancel).toHaveBeenCalledTimes(1);
    });
    it('should call onSubmit function on clicking submit button', async () => {
        render(<CopyAdFormModal {...mockProps} />);
        const button = screen.getByRole('button', { name: 'Create ad' });
        await userEvent.click(button);
        expect(mockProps.onSubmit).toHaveBeenCalledTimes(1);
    });
    it('should render the children as expected', () => {
        render(
            <CopyAdFormModal {...mockProps}>
                <div>Children</div>
            </CopyAdFormModal>
        );
        expect(screen.getByText('Children')).toBeInTheDocument();
    });
});
