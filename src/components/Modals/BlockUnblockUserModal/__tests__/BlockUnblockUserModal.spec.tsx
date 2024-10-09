import { BUY_SELL_URL } from '@/constants';
import { getCurrentRoute } from '@/utils';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlockUnblockUserModal from '../BlockUnblockUserModal';

const mockOnRequestClose = jest.fn();
const mockUseBlockMutate = jest.fn();
const mockUseUnblockMutate = jest.fn();

const mockBlockMutation = {
    error: {},
    isSuccess: false,
    reset: jest.fn(),
};

const mockUnblockMutation = {
    error: {},
    isSuccess: false,
    reset: jest.fn(),
};

const mockUseAdvertiserInfo = {
    data: {
        is_favourite: false,
    },
};

const mockModalManager = {
    hideModal: jest.fn(),
    isModalOpenFor: jest.fn().mockReturnValue(false),
    showModal: jest.fn(),
};

const mockStore = {
    errorMessages: [],
    setErrorMessages: jest.fn(),
};

const mockPush = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({ push: mockPush }),
}));

jest.mock('@/hooks', () => ({
    ...jest.requireActual('@/hooks'),
    api: {
        counterparty: {
            useBlock: jest.fn(() => ({
                mutate: mockUseBlockMutate,
                mutation: mockBlockMutation,
            })),
            useUnblock: jest.fn(() => ({
                mutate: mockUseUnblockMutate,
                mutation: mockUnblockMutation,
            })),
        },
    },
    useAdvertiserStats: jest.fn(() => mockUseAdvertiserInfo),
}));

jest.mock('@/hooks/custom-hooks', () => ({
    useModalManager: jest.fn(() => mockModalManager),
}));

jest.mock('@/utils', () => ({
    ...jest.requireActual('@/utils'),
    getCurrentRoute: jest.fn().mockReturnValue('my-profile'),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: false })),
}));

jest.mock('@/stores', () => ({
    useErrorStore: jest.fn(selector => (selector ? selector(mockStore) : mockStore)),
}));

const mockGetCurrentRoute = getCurrentRoute as jest.Mock;

describe('BlockUnblockUserModal', () => {
    it('should render the modal with correct title and behaviour for blocking user', async () => {
        render(
            <BlockUnblockUserModal
                advertiserName='Jane Doe'
                id='1'
                isBlocked={false}
                isModalOpen={true}
                onRequestClose={mockOnRequestClose}
            />
        );

        expect(
            screen.queryByText(
                `You won't see Jane Doe's ads anymore and they won't be able to place orders on your ads.`
            )
        ).toBeVisible();

        const blockBtn = screen.getByRole('button', {
            name: 'Block',
        });
        await userEvent.click(blockBtn);

        expect(mockUseBlockMutate).toHaveBeenCalledWith([1], false);
    });
    it('should render the modal with correct title and behaviour for unblocking user', async () => {
        render(
            <BlockUnblockUserModal
                advertiserName='Hu Tao'
                id='2'
                isBlocked={true}
                isModalOpen={true}
                onRequestClose={mockOnRequestClose}
            />
        );

        expect(
            screen.queryByText(
                `You will be able to see Hu Tao's ads. They'll be able to place orders on your ads, too.`
            )
        ).toBeVisible();

        const unblockBtn = screen.getByRole('button', {
            name: 'Unblock',
        });
        await userEvent.click(unblockBtn);

        expect(mockUseUnblockMutate).toHaveBeenCalledWith([2]);
    });
    it('should hide the modal when user clicks cancel', async () => {
        render(
            <BlockUnblockUserModal
                advertiserName='Hu Tao'
                id='2'
                isBlocked={true}
                isModalOpen={true}
                onRequestClose={mockOnRequestClose}
            />
        );

        const cancelBtn = screen.getByRole('button', {
            name: 'Cancel',
        });
        await userEvent.click(cancelBtn);

        expect(mockOnRequestClose).toBeCalled();
    });

    it('should call onRequestClose if isSuccess or mutation returns success', async () => {
        mockBlockMutation.isSuccess = true;
        render(
            <BlockUnblockUserModal
                advertiserName='Hu Tao'
                id='2'
                isBlocked={true}
                isModalOpen={true}
                onRequestClose={mockOnRequestClose}
            />
        );

        expect(mockOnRequestClose).toHaveBeenCalled();
    });

    it('should show error modal when an error occurs and current route is advertiser', async () => {
        mockGetCurrentRoute.mockReturnValue('advertiser');
        mockModalManager.isModalOpenFor.mockImplementation((modalName: string) => modalName === 'ErrorModal');
        const error = {
            code: 'PermissionDenied',
            message: 'You are not allowed to block this user',
        };
        // @ts-expect-error - mock values
        mockStore.errorMessages = [error];
        mockBlockMutation.error = error;
        mockBlockMutation.isSuccess = false;
        render(
            <BlockUnblockUserModal
                advertiserName='Hu Tao'
                id='2'
                isBlocked={true}
                isModalOpen={true}
                onRequestClose={mockOnRequestClose}
            />
        );

        expect(screen.queryByText('Something’s not right')).toBeVisible();
        expect(screen.queryByText('You are not allowed to block this user')).toBeVisible();
    });

    it('should call hideModal, history.push and unblockMutation.reset when user clicks on OK button if user is unblocking', async () => {
        render(
            <BlockUnblockUserModal
                advertiserName='Hu Tao'
                id='2'
                isBlocked={true}
                isModalOpen={true}
                onRequestClose={mockOnRequestClose}
            />
        );

        const okBtn = screen.getByRole('button', {
            name: 'OK',
        });
        await userEvent.click(okBtn);

        expect(mockModalManager.hideModal).toHaveBeenCalled();
        expect(mockPush).toHaveBeenCalledWith(BUY_SELL_URL);
        expect(mockUnblockMutation.reset).toHaveBeenCalled();
    });

    it('should call blockMutation.reset when user clicks on OK button if user is blocking', async () => {
        render(
            <BlockUnblockUserModal
                advertiserName='Hu Tao'
                id='2'
                isBlocked={false}
                isModalOpen={true}
                onRequestClose={mockOnRequestClose}
            />
        );

        const okBtn = screen.getByRole('button', {
            name: 'OK',
        });
        await userEvent.click(okBtn);

        expect(mockBlockMutation.reset).toHaveBeenCalled();
    });
});
