import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlockUnblockUserModal from '../BlockUnblockUserModal';

const mockOnRequestClose = jest.fn();
const mockUseBlockMutate = jest.fn();
const mockUseUnblockMutate = jest.fn();

jest.mock('@/hooks', () => ({
    ...jest.requireActual('@/hooks'),
    api: {
        counterparty: {
            useBlock: jest.fn(() => ({
                mutate: mockUseBlockMutate,
                mutation: {
                    error: {},
                    isSuccess: false,
                },
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

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: false })),
}));

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
});
