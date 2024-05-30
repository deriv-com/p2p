import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyProfileCounterpartiesTableRow from '../MyProfileCounterpartiesTableRow';

const mockProps = {
    id: 'id1',
    isBlocked: false,
    nickname: 'nickname',
    setErrorMessage: jest.fn(),
};

const mockPush = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockPush,
    }),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({ isMobile: false }),
}));

jest.mock('@/components/UserAvatar', () => ({
    UserAvatar: () => <div>UserAvatar</div>,
}));

const mockModalManager = {
    hideModal: jest.fn(),
    isModalOpenFor: jest.fn().mockReturnValue(false),
    showModal: jest.fn(),
};

jest.mock('@/hooks', () => ({
    api: {
        counterparty: {
            useBlock: () => ({
                mutate: jest.fn(),
                mutation: {
                    isSuccess: false,
                },
            }),
            useUnblock: () => ({
                mutate: jest.fn(),
                mutation: {
                    isSuccess: false,
                },
            }),
        },
    },
}));

jest.mock('@/hooks/custom-hooks', () => ({
    useIsAdvertiserBarred: () => false,
    useModalManager: () => mockModalManager,
}));

describe('MyProfileCounterpartiesTableRow', () => {
    it('should render the component as expected', () => {
        render(<MyProfileCounterpartiesTableRow {...mockProps} />);
        expect(screen.getByText('nickname')).toBeInTheDocument();
        expect(screen.getByText('Block')).toBeInTheDocument();
        expect(screen.getByText('UserAvatar')).toBeInTheDocument();
    });
    it('should handle open modal for click of block/unblock button in the row', async () => {
        render(<MyProfileCounterpartiesTableRow {...mockProps} />);
        await userEvent.click(screen.getByText('Block'));
        expect(mockModalManager.showModal).toHaveBeenCalledWith('BlockUnblockUserModal');
    });
    it('should close modal for onRequest close of modal', async () => {
        mockModalManager.isModalOpenFor.mockImplementation(
            (modalName: string) => modalName === 'BlockUnblockUserModal'
        );
        render(<MyProfileCounterpartiesTableRow {...mockProps} />);
        await userEvent.click(screen.getByTestId('dt_block_unblock_button'));

        expect(screen.getByText('Block nickname?')).toBeInTheDocument();
        const button = screen.getByRole('button', { name: 'Cancel' });
        await userEvent.click(button);
        expect(mockModalManager.hideModal).toHaveBeenCalled();
    });

    it('should call history.push when clicking on the nickname', async () => {
        render(<MyProfileCounterpartiesTableRow {...mockProps} />);
        const nickname = screen.getByText('nickname');
        await userEvent.click(nickname);
        expect(mockPush).toHaveBeenCalledWith('/advertiser/id1', { from: 'MyProfile' });
    });
});
