import { render, screen } from '@testing-library/react';
import AdvertiserNameStats from '../AdvertiserNameStats';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: false })),
}));

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
        expect(screen.getByText('(29 ratings)')).toBeInTheDocument();
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
});
