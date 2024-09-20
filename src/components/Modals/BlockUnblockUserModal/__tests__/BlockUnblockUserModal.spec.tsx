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
                mutation: {
                    error: {},
                    isSuccess: false,
                },
            })),
        },
    },
}));

jest.mock('@/hooks/custom-hooks', () => ({
    useModalManager: jest.fn(() => mockModalManager),
}));

jest.mock('@/utils', () => ({
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

        expect(mockUseBlockMutate).toBeCalledWith([1]);
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

        expect(mockUseUnblockMutate).toBeCalledWith([2]);
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

    it('should call onClickBlocked and onRequestClose if isSuccess or mutation returns success', async () => {
        mockBlockMutation.isSuccess = true;
        const mockOnClickBlocked = jest.fn();
        render(
            <BlockUnblockUserModal
                advertiserName='Hu Tao'
                id='2'
                isBlocked={true}
                isModalOpen={true}
                onClickBlocked={mockOnClickBlocked}
                onRequestClose={mockOnRequestClose}
            />
        );

        expect(mockOnRequestClose).toHaveBeenCalled();
        expect(mockOnClickBlocked).toHaveBeenCalled();
    });

    it('should show error modal when permission is denied and current route is advertiser', async () => {
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

        expect(screen.queryByText('Unable to block advertiser')).toBeVisible();
        expect(screen.queryByText('You are not allowed to block this user')).toBeVisible();
    });

    it('should call hideModal and history.push when user clicks on Got it button', async () => {
        render(
            <BlockUnblockUserModal
                advertiserName='Hu Tao'
                id='2'
                isBlocked={true}
                isModalOpen={true}
                onRequestClose={mockOnRequestClose}
            />
        );

        const gotItBtn = screen.getByRole('button', {
            name: 'Got it',
        });
        await userEvent.click(gotItBtn);

        expect(mockModalManager.hideModal).toHaveBeenCalled();
        expect(mockPush).toHaveBeenCalledWith(BUY_SELL_URL);
    });
});
