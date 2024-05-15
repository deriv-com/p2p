import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DailyLimitModal from '../DailyLimitModal';

const mockUseAdvertiserUpdateMutate = jest.fn();
const mockOnRequestClose = jest.fn();
let mockUseAdvertiserUpdate = {
    data: {
        daily_buy_limit: 100,
        daily_sell_limit: 200,
    },
    error: undefined,
    isPending: true,
    isSuccess: false,
    mutate: mockUseAdvertiserUpdateMutate,
};

jest.mock('@/hooks', () => ({
    ...jest.requireActual('@/hooks'),
    api: {
        advertiser: {
            useUpdate: jest.fn(() => mockUseAdvertiserUpdate),
        },
    },
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({ isMobile: false }),
}));

describe('DailyLimitModal', () => {
    it('should render loader when data is not ready', async () => {
        render(<DailyLimitModal currency='USD' isModalOpen onRequestClose={mockOnRequestClose} />);

        expect(screen.getByTestId('dt_derivs-loader')).toBeVisible();
    });
    it('should render the correct title and behaviour', async () => {
        mockUseAdvertiserUpdate = {
            ...mockUseAdvertiserUpdate,
            isPending: false,
            isSuccess: false,
        };
        render(<DailyLimitModal currency='USD' isModalOpen onRequestClose={mockOnRequestClose} />);

        expect(
            screen.getByText(
                `You won’t be able to change your buy and sell limits again after this. Do you want to continue?`
            )
        ).toBeVisible();

        const continueBtn = screen.getByRole('button', {
            name: 'Yes, continue',
        });
        await userEvent.click(continueBtn);
        expect(mockUseAdvertiserUpdateMutate).toBeCalledWith({
            upgrade_limits: 1,
        });
    });
    it('should render the successful limits increase', async () => {
        mockUseAdvertiserUpdate = {
            ...mockUseAdvertiserUpdate,
            isPending: false,
            isSuccess: true,
        };
        render(<DailyLimitModal currency='USD' isModalOpen onRequestClose={mockOnRequestClose} />);

        expect(
            screen.getByText(`Your daily limits have been increased to 100 USD (buy) and 200 USD (sell).`)
        ).toBeVisible();

        const okBtn = screen.getByRole('button', {
            name: 'Ok',
        });
        await userEvent.click(okBtn);
        expect(mockOnRequestClose).toHaveBeenCalled();
    });
    it('should render the error information when limits are unable to be upgraded', async () => {
        mockUseAdvertiserUpdate = {
            ...mockUseAdvertiserUpdate,
            // @ts-expect-error Mock assertion of error
            error: new Error(),
            isLoading: false,
            isSuccess: false,
        };
        render(<DailyLimitModal currency='USD' isModalOpen onRequestClose={mockOnRequestClose} />);

        expect(
            screen.getByText(
                'Sorry, we’re unable to increase your limits right now. Please try again in a few minutes.'
            )
        ).toBeVisible();

        const okBtn = screen.getByRole('button', {
            name: 'Ok',
        });
        await userEvent.click(okBtn);
        expect(mockOnRequestClose).toBeCalled();
    });
});
