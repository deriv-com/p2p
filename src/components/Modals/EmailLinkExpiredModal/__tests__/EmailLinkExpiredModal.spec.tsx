import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmailLinkExpiredModal from '../EmailLinkExpiredModal';

const mockProps = {
    isModalOpen: true,
    onClickHandler: jest.fn(),
    onRequestClose: jest.fn(),
};

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({
        isMobile: false,
    }),
}));

describe('EmailLinkExpiredModal', () => {
    it('should render the modal as expected', () => {
        render(<EmailLinkExpiredModal {...mockProps} />);
        expect(
            screen.getByText(
                'The verification link appears to be invalid. Hit the button below to request for a new one'
            )
        ).toBeInTheDocument();
        expect(screen.getByText('Get new link')).toBeInTheDocument();
    });
    it('should handle onClickHandler', async () => {
        render(<EmailLinkExpiredModal {...mockProps} />);
        const button = screen.getByRole('button', { name: 'Get new link' });
        await userEvent.click(button);
        expect(mockProps.onClickHandler).toHaveBeenCalledTimes(1);
    });
});
