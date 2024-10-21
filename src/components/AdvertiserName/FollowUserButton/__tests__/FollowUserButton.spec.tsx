import { BUY_SELL_URL } from '@/constants';
import { LocalStorageConstants } from '@deriv-com/utils';
import { fireEvent, render, screen } from '@testing-library/react';
import FollowUserButton from '../FollowUserButton';

const mockPush = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockPush,
    }),
}));

const mockUseDevice = {
    isDesktop: true,
};

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => mockUseDevice),
}));

const mockUseFollow = {
    mutate: jest.fn(),
    mutation: {
        error: undefined,
        reset: jest.fn(),
    },
};

const mockUseUnfollow = {
    mutate: jest.fn(),
    mutation: {
        error: undefined,
        reset: jest.fn(),
    },
};

jest.mock('@/hooks', () => ({
    ...jest.requireActual('@/hooks'),
    api: {
        counterparty: {
            useFollow: jest.fn(() => mockUseFollow),
            useUnfollow: jest.fn(() => mockUseUnfollow),
        },
    },
}));

const mockUseAdvertiserStats = {
    data: {
        is_favourite: false,
    },
};

const mockModalManager = {
    hideModal: jest.fn(),
    isModalOpenFor: jest.fn().mockReturnValue(false),
    showModal: jest.fn(),
};

jest.mock('@/hooks/custom-hooks', () => ({
    useAdvertiserStats: jest.fn(() => mockUseAdvertiserStats),
    useIsAdvertiserBarred: jest.fn(() => false),
    useModalManager: jest.fn(() => mockModalManager),
}));

describe('<FollowUserButton />', () => {
    it('should show Follow button and OnboardingTooltip if is_favourite is false', () => {
        render(<FollowUserButton id='1' />);

        expect(screen.getByRole('button', { name: 'Follow' })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Following' })).not.toBeInTheDocument();
        expect(screen.getByText('Follow advertisers')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Follow your favourite advertisers and set a filter to see their ads first in your Buy/Sell list.'
            )
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
    });

    it('should close OnboardingTooltip and should_show_follow_guide in local storage should be false when OK button is clicked', () => {
        localStorage.clear(); // Clear local storage before test as it sets to false in the first test
        const { rerender } = render(<FollowUserButton id='1' />);

        const okButton = screen.getByRole('button', { name: 'OK' });
        fireEvent.click(okButton);

        rerender(<FollowUserButton id='1' />);

        expect(localStorage.getItem(LocalStorageConstants.p2pShowFollowUserGuide)).toBe('false');
        expect(screen.queryByText('Follow advertisers')).not.toBeInTheDocument();
    });

    it('should close OnboardingTooltip and should_show_follow_user_guide in local storage should be false when close button is clicked', () => {
        localStorage.clear();
        const { rerender } = render(<FollowUserButton id='1' />);

        const closeIcon = screen.getByTestId('dt_onboarding_tooltip_close_btn');
        fireEvent.click(closeIcon);

        rerender(<FollowUserButton id='1' />);

        expect(localStorage.getItem(LocalStorageConstants.p2pShowFollowUserGuide)).toBe('false');
        expect(screen.queryByText('Follow advertisers')).not.toBeInTheDocument();
    });

    it('should show Following text if is_favourite is true', () => {
        mockUseAdvertiserStats.data.is_favourite = true;
        render(<FollowUserButton id='1' />);

        expect(screen.getByRole('button', { name: 'Following' })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Follow' })).not.toBeInTheDocument();
    });

    it('should call useFollow.mutate when user is not following', () => {
        mockUseAdvertiserStats.data.is_favourite = false;
        render(<FollowUserButton id='1' />);

        const followButton = screen.getByRole('button', { name: 'Follow' });
        fireEvent.click(followButton);

        expect(mockUseFollow.mutate).toHaveBeenCalledWith([1]);
    });

    it('should call useUnfollow.mutate when user is following', () => {
        mockUseAdvertiserStats.data.is_favourite = true;
        render(<FollowUserButton id='1' />);

        const followingButton = screen.getByRole('button', { name: 'Following' });
        fireEvent.click(followingButton);

        expect(mockUseUnfollow.mutate).toHaveBeenCalledWith([1]);
    });

    it('should call showModal when followError is present and ErrorModal should appear', () => {
        // @ts-expect-error - error typing is not defined
        mockUseFollow.mutation.error = { message: 'follow error' };
        mockModalManager.isModalOpenFor.mockImplementation((modalName: string) => modalName === 'ErrorModal');
        render(<FollowUserButton id='1' />);

        expect(mockModalManager.showModal).toHaveBeenCalledWith('ErrorModal');
        expect(screen.getByText('follow error')).toBeInTheDocument();
    });

    it('should call useFollow.reset, hideModal and history.push when OK button is clicked', () => {
        render(<FollowUserButton id='1' />);

        const okButton = screen.getByRole('button', { name: 'OK' });
        fireEvent.click(okButton);

        expect(mockUseFollow.mutation.reset).toHaveBeenCalled();
        expect(mockModalManager.hideModal).toHaveBeenCalled();
        expect(mockPush).toHaveBeenCalledWith(BUY_SELL_URL);
    });

    it('should call useUnfollow.reset, hideModal and history.push when OK button is clicked', () => {
        // @ts-expect-error - error typing is not defined
        mockUseUnfollow.mutation.error = { message: 'follow error' };
        mockUseFollow.mutation.error = undefined;

        render(<FollowUserButton id='1' />);

        const okButton = screen.getByRole('button', { name: 'OK' });
        fireEvent.click(okButton);

        expect(mockUseUnfollow.mutation.reset).toHaveBeenCalled();
        expect(mockModalManager.hideModal).toHaveBeenCalled();
        expect(mockPush).toHaveBeenCalledWith(BUY_SELL_URL);
    });

    it('should not show Follow or Following text if isDesktop is false', () => {
        mockUseFollow.mutation.error = undefined;
        mockUseUnfollow.mutation.error = undefined;
        mockUseDevice.isDesktop = false;

        render(<FollowUserButton id='1' />);

        expect(screen.queryByRole('button', { name: 'Follow' })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Following' })).not.toBeInTheDocument();
    });
});
