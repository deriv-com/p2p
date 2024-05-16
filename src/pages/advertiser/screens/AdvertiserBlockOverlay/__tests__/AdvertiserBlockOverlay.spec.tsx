import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdvertiserBlockOverlay from '../AdvertiserBlockOverlay';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: true })),
}));

const mockProps = {
    advertiserName: 'advertiserName',
    id: '133',
    isOverlayVisible: true,
    onClickUnblock: jest.fn(),
    setShowOverlay: jest.fn(),
};

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

jest.mock('@/components/Modals', () => ({
    BlockUnblockUserModal: () => <div>BlockUnblockUserModal</div>,
}));

describe('AdvertiserBlockOverlay', () => {
    it('should render the component as expected with overlay', () => {
        render(
            <AdvertiserBlockOverlay {...mockProps}>
                <div>children</div>
            </AdvertiserBlockOverlay>
        );
        expect(screen.getByRole('button', { name: /unblock/i })).toBeInTheDocument();
    });
    it('should open the modal on clicking unblock button', async () => {
        render(
            <AdvertiserBlockOverlay {...mockProps}>
                <div>children</div>
            </AdvertiserBlockOverlay>
        );
        await userEvent.click(screen.getByRole('button', { name: /unblock/i }));
        expect(modalManager.showModal).toHaveBeenCalledWith('BlockUnblockUserModal');
        expect(modalManager.isModalOpenFor()).toBe(true);
    });
    it('should render only childerne and not overlay when overlay is not visible', () => {
        render(
            <AdvertiserBlockOverlay {...mockProps} isOverlayVisible={false}>
                <div>children</div>
            </AdvertiserBlockOverlay>
        );
        expect(screen.queryByRole('button', { name: /unblock/i })).not.toBeInTheDocument();
    });
});
