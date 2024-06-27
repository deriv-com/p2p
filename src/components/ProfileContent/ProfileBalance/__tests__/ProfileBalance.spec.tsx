import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProfileBalance from '../ProfileBalance';

let mockAdvertiserStatsProp = {
    advertiserStats: {
        balance_available: 50000,
        daily_buy_limit: '500',
        daily_sell_limit: '500',
        dailyAvailableBuyLimit: 10,
        dailyAvailableSellLimit: 10,
        fullName: 'Jane Doe',
        isEligibleForLimitUpgrade: false,
        name: 'Jane',
        shouldShowName: false,
    },
};
const mockUseActiveAccount = {
    data: {
        currency: 'USD',
    },
    isLoading: false,
};

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({ isDesktop: true }),
}));

jest.mock('@/hooks', () => ({
    ...jest.requireActual('@/hooks'),
    api: {
        account: {
            useActiveAccount: jest.fn(() => mockUseActiveAccount),
        },
    },
}));

jest.mock('../../ProfileDailyLimit/ProfileDailyLimit', () => jest.fn(() => <div>ProfileDailyLimit</div>));

describe('ProfileBalance', () => {
    it('should render the correct balance', async () => {
        render(<ProfileBalance {...mockAdvertiserStatsProp} />);
        const availableBalanceNode = screen.getByTestId('dt_available_balance_amount');
        expect(within(availableBalanceNode).getByText('50,000.00 USD')).toBeInTheDocument();

        const balanceInfoIcon = screen.getByTestId('dt_available_balance_icon');
        await userEvent.click(balanceInfoIcon);
        expect(screen.getByTestId('dt_available_p2p_balance_modal')).toBeInTheDocument();
        const okButton = screen.getByRole('button', {
            name: 'OK',
        });
        await userEvent.click(okButton);
        expect(screen.queryByTestId('dt_available_p2p_balance_modal')).not.toBeInTheDocument();
    });

    it('should render the correct limits', () => {
        mockAdvertiserStatsProp = {
            advertiserStats: {
                ...mockAdvertiserStatsProp.advertiserStats,
                daily_buy_limit: '500',
                daily_sell_limit: '2000',
                dailyAvailableBuyLimit: 100,
                dailyAvailableSellLimit: 600,
            },
        };
        render(<ProfileBalance {...mockAdvertiserStatsProp} />);
        const dailyBuyLimitNode = screen.getByTestId('dt_profile_balance_daily_buy_limit');
        expect(within(dailyBuyLimitNode).getByText('500 USD')).toBeInTheDocument();
        const availableBuyLimitNode = screen.getByTestId('dt_profile_balance_available_buy_limit');
        expect(within(availableBuyLimitNode).getByText('100.00 USD')).toBeInTheDocument();

        const dailySellLimitNode = screen.getByTestId('dt_profile_balance_daily_sell_limit');
        expect(within(dailySellLimitNode).getByText('2000 USD')).toBeInTheDocument();
        const dailyAvailableSellLimit = screen.getByTestId('dt_profile_balance_available_sell_limit');
        expect(within(dailyAvailableSellLimit).getByText('600.00 USD')).toBeInTheDocument();
    });
    it('should render ProfileDailyLimit', () => {
        mockAdvertiserStatsProp = {
            advertiserStats: {
                ...mockAdvertiserStatsProp.advertiserStats,
                isEligibleForLimitUpgrade: true,
            },
        };
        render(<ProfileBalance {...mockAdvertiserStatsProp} />);
        expect(screen.getByText('ProfileDailyLimit')).toBeInTheDocument();
    });
    it('should render the correct default values', () => {
        mockAdvertiserStatsProp = {
            // @ts-expect-error To clear the mocked values and assert the default values
            advertiserStats: {},
            isLoading: false,
        };
        render(<ProfileBalance {...mockAdvertiserStatsProp} />);
        const availableBalanceNode = screen.getByTestId('dt_available_balance_amount');
        expect(within(availableBalanceNode).getByText('0.00 USD')).toBeInTheDocument();
        const dailyBuyLimitNode = screen.getByTestId('dt_profile_balance_daily_buy_limit');
        expect(within(dailyBuyLimitNode).getByText('0.00 USD')).toBeInTheDocument();
        const availableBuyLimitNode = screen.getByTestId('dt_profile_balance_available_buy_limit');
        expect(within(availableBuyLimitNode).getByText('0.00 USD')).toBeInTheDocument();

        const dailySellLimitNode = screen.getByTestId('dt_profile_balance_daily_sell_limit');
        expect(within(dailySellLimitNode).getByText('0.00 USD')).toBeInTheDocument();
        const dailyAvailableSellLimit = screen.getByTestId('dt_profile_balance_available_sell_limit');
        expect(within(dailyAvailableSellLimit).getByText('0.00 USD')).toBeInTheDocument();
    });
});
