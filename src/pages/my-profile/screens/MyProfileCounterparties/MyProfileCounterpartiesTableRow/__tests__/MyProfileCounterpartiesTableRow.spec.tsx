import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyProfileCounterpartiesTableRow from '../MyProfileCounterpartiesTableRow';

const mockProps = {
    id: 'id1',
    isBlocked: false,
    nickname: 'nickname',
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

jest.mock('@deriv/api-v2', () => ({
    p2p: {
        counterparty: {
            useBlock: () => ({
                mutate: jest.fn(),
            }),
            useUnblock: () => ({
                mutate: jest.fn(),
            }),
        },
    },
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
        await waitFor(() => {
            expect(screen.getByText('Block nickname?')).toBeInTheDocument();
        });
    });
    it('should close modal for onRequest close of modal', async () => {
        render(<MyProfileCounterpartiesTableRow {...mockProps} />);
        await userEvent.click(screen.getByText('Block'));
        await waitFor(async () => {
            expect(screen.getByText('Block nickname?')).toBeInTheDocument();
            const button = screen.getByRole('button', { name: 'Cancel' });
            await userEvent.click(button);
        });
        await waitFor(() => {
            expect(screen.queryByText('Block nickname?')).not.toBeInTheDocument();
        });
    });

    it('should call history.push when clicking on the nickname', async () => {
        render(<MyProfileCounterpartiesTableRow {...mockProps} />);
        const nickname = screen.getByText('nickname');
        await userEvent.click(nickname);
        expect(mockPush).toHaveBeenCalledWith('/advertiser/id1', { from: 'MyProfile' });
    });
});
