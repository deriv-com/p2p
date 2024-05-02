import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProfileDailyLimit from '../ProfileDailyLimit';

const mockUseAdvertiserStats = {
    data: {
        daily_buy_limit: 100,
        daily_sell_limit: 200,
    },
    isLoading: true,
};

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({ isMobile: false }),
}));

jest.mock('@/hooks/custom-hooks', () => ({
    useAdvertiserStats: jest.fn(() => mockUseAdvertiserStats),
}));

jest.mock('@/hooks', () => ({
    ...jest.requireActual('@/hooks'),
    api: {
        account: {
            useActiveAccount: jest.fn(() => ({
                currency: 'USD',
            })),
        },
        advertiser: {
            useUpdate: jest.fn(() => ({
                data: {
                    data: {
                        daily_buy_limit: 100,
                        daily_sell_limit: 200,
                    },
                },
                error: null,
                isPending: false,
                isSuccess: false,
                mutate: jest.fn(),
            })),
        },
    },
}));

describe('ProfileDailyLimit', () => {
    it('should render the correct limits message', () => {
        render(<ProfileDailyLimit />);
        const tokens = ['Want to increase your daily limits to (buy) and (sell)?', '100 USD ', '200 USD '];

        expect(
            screen.getByText((content, element) => {
                return element?.tagName.toLowerCase() === 'span' && tokens.includes(content.trim());
            })
        ).toBeInTheDocument();
    });
    it('should render limits modal when requested to increase limits', async () => {
        render(<ProfileDailyLimit />);
        const increaseLimitsBtn = screen.getByRole('button', {
            name: 'Increase my limits',
        });
        expect(screen.queryByTestId('dt_daily_limit_modal')).not.toBeInTheDocument();
        await userEvent.click(increaseLimitsBtn);
        expect(screen.getByTestId('dt_daily_limit_modal')).toBeInTheDocument();

        const noButton = screen.getByRole('button', { name: 'No' });
        await userEvent.click(noButton);

        expect(screen.queryByTestId('dt_daily_limit_modal')).not.toBeInTheDocument();
    });
});
