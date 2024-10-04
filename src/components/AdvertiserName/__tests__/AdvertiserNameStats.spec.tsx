import { getCurrentRoute } from '@/utils';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdvertiserNameStats from '../AdvertiserNameStats';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({
        isDesktop: true,
        isMobile: false,
    }),
}));

jest.mock('@/utils', () => ({
    ...jest.requireActual('@/utils'),
    getCurrentRoute: jest.fn().mockReturnValue('advertiser'),
}));

const mockModalManager = {
    hideModal: jest.fn(),
    isModalOpenFor: jest.fn().mockReturnValue(false),
    showModal: jest.fn(),
};
jest.mock('@/hooks', () => ({
    useIsRtl: () => false,
    useModalManager: jest.fn(() => mockModalManager),
}));

jest.mock('../BusinessHoursTooltip', () => ({
    BusinessHoursTooltip: () => <div>BusinessHoursTooltip</div>,
}));

jest.mock('../BlockUserCount.tsx', () => ({
    __esModule: true,
    default: () => <div>BlockUserCount</div>,
}));

const mockUseDevice = useDevice as jest.Mock;
const mockGetCurrentRoute = getCurrentRoute as jest.Mock;

describe('AdvertiserNameStats', () => {
    it('should render correct advertiser stats', () => {
        const mockUseAdvertiserStats = {
            advertiserStats: {
                blocked_by_count: 1,
                daysSinceJoined: 22,
                rating_average: 4.4,
                rating_count: 29,
                recommended_average: 3.3,
            },
        };
        render(<AdvertiserNameStats {...mockUseAdvertiserStats} />);
        expect(screen.getByText('Joined 22d')).toBeInTheDocument();
    });

    it('should render correct advertiser stats based on availability', () => {
        const mockUseAdvertiserStats = {
            advertiserStats: {
                blocked_by_count: 1,
                daysSinceJoined: 22,
                rating_count: 29,
            },
        };
        render(<AdvertiserNameStats {...mockUseAdvertiserStats} />);
        expect(screen.getByText('Not rated yet')).toBeInTheDocument();
    });

    it('should show Recommended by 1 trader if recommended count is 1', async () => {
        const mockUseAdvertiserStats = {
            advertiserStats: {
                blocked_by_count: 1,
                daysSinceJoined: 22,
                rating_average: 4.4,
                rating_count: 29,
                recommended_average: 5,
                recommended_count: 1,
            },
        };
        render(<AdvertiserNameStats {...mockUseAdvertiserStats} />);

        const recommendedAverage = screen.getByText('5%');
        await userEvent.hover(recommendedAverage);
        expect(screen.getByText('Recommended by 1 trader')).toBeInTheDocument();
    });

    it('should show Recommended by 2 traders if recommended count is 2', async () => {
        const mockUseAdvertiserStats = {
            advertiserStats: {
                blocked_by_count: 1,
                daysSinceJoined: 22,
                rating_average: 4.4,
                rating_count: 29,
                recommended_average: 5,
                recommended_count: 2,
            },
        };
        render(<AdvertiserNameStats {...mockUseAdvertiserStats} />);

        const recommendedAverage = screen.getByText('5%');
        await userEvent.hover(recommendedAverage);
        expect(screen.getByText('Recommended by 2 traders')).toBeInTheDocument();
    });

    it('should call showModal if user clicks on recommended average in responsive', async () => {
        const mockUseAdvertiserStats = {
            advertiserStats: {
                blocked_by_count: 1,
                daysSinceJoined: 22,
                rating_average: 4.4,
                rating_count: 29,
                recommended_average: 5,
                recommended_count: 2,
            },
        };
        mockUseDevice.mockReturnValue({
            isDesktop: false,
            isMobile: true,
        });
        render(<AdvertiserNameStats {...mockUseAdvertiserStats} />);

        const recommendedAverage = screen.getByText('5%');
        await userEvent.click(recommendedAverage);
        expect(mockModalManager.showModal).toHaveBeenCalled();
    });

    it('should show BlockUserCount and BusinessHoursTooltip if the user is on my profile', () => {
        const mockUseAdvertiserStats = {
            advertiserStats: {
                blocked_by_count: 1,
                daysSinceJoined: 22,
                rating_average: 4.4,
                rating_count: 29,
                recommended_average: 5,
                recommended_count: 2,
            },
        };
        mockGetCurrentRoute.mockReturnValue('my-profile');
        render(<AdvertiserNameStats {...mockUseAdvertiserStats} />);
        expect(screen.getByText('BlockUserCount')).toBeInTheDocument();
        expect(screen.getByText('BusinessHoursTooltip')).toBeInTheDocument();
    });
});
